-- Minimart: skema awal (port dari db_dimas.sql versi PHP/MySQL)

-- Pengguna ------------------------------------------------------------------
-- Login pakai Supabase Auth. Username disimpan sebagai email "<username>@minimart.local".
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text not null unique,
  nama text not null,
  role text not null default 'kasir' check (role in ('pemilik', 'gudang', 'kasir')),
  aktif boolean not null default true
);

-- Profil dibuat otomatis untuk setiap user baru (dari admin API atau dashboard Supabase).
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username, nama, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'nama', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'kasir')
  );
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Role user yang sedang login; null kalau tidak aktif, jadi semua policy menolak.
create function public.my_role() returns text
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid() and aktif
$$;

-- Master data ----------------------------------------------------------------
create table public.barang (
  id bigint generated always as identity primary key,
  barcode text not null unique,
  nama text not null,
  harga integer not null check (harga >= 0),
  stok integer not null default 0 check (stok >= 0)
);

create table public.supplier (
  id bigint generated always as identity primary key,
  nama text not null,
  alamat text not null,
  telp text not null
);

-- Transaksi ------------------------------------------------------------------
create table public.pembelian (
  id bigint generated always as identity primary key,
  kode text not null default to_char(now() at time zone 'Asia/Jakarta', 'YYYYMMDDHH24MISS'),
  waktu timestamptz not null default now(),
  supplier_id bigint not null references public.supplier,
  pengguna_id uuid not null default auth.uid() references public.profiles
);

create table public.beli_barang (
  id bigint generated always as identity primary key,
  pembelian_id bigint not null references public.pembelian on delete cascade,
  barang_id bigint not null references public.barang,
  qty integer not null check (qty > 0),
  harga integer not null check (harga >= 0)
);

create table public.penjualan (
  id bigint generated always as identity primary key,
  kode text not null default to_char(now() at time zone 'Asia/Jakarta', 'YYYYMMDDHH24MISS'),
  waktu timestamptz not null default now(),
  pengguna_id uuid not null default auth.uid() references public.profiles
);

create table public.jual_barang (
  id bigint generated always as identity primary key,
  penjualan_id bigint not null references public.penjualan on delete cascade,
  barang_id bigint not null references public.barang,
  qty integer not null check (qty > 0),
  harga integer not null check (harga >= 0),
  unique (penjualan_id, barang_id)
);

-- Stok ikut berubah saat item beli/jual ditambah, diubah, atau dihapus.
-- Constraint barang_stok_check menolak stok minus, jadi oversell gagal secara atomik.
create function public.sync_stok() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  arah int := case when tg_table_name = 'beli_barang' then 1 else -1 end;
begin
  if tg_op in ('UPDATE', 'DELETE') then
    update public.barang set stok = stok - arah * old.qty where id = old.barang_id;
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    update public.barang set stok = stok + arah * new.qty where id = new.barang_id;
  end if;
  return null;
end $$;

create trigger sync_stok after insert or update or delete on public.beli_barang
for each row execute function public.sync_stok();
create trigger sync_stok after insert or update or delete on public.jual_barang
for each row execute function public.sync_stok();

-- Kasir scan barcode: harga diambil dari DB, barang yang sama digabung qty-nya.
create function public.tambah_jual(p_penjualan bigint, p_barcode text, p_qty int default 1) returns void
language plpgsql set search_path = '' as $$
begin
  insert into public.jual_barang (penjualan_id, barang_id, qty, harga)
  select p_penjualan, id, p_qty, harga from public.barang where barcode = p_barcode
  on conflict (penjualan_id, barang_id) do update set qty = jual_barang.qty + excluded.qty;
  if not found then
    raise exception 'Barang tidak ditemukan';
  end if;
end $$;

-- View laporan ---------------------------------------------------------------
create view public.pembelian_list with (security_invoker = true) as
select p.id, p.kode, p.waktu, (p.waktu at time zone 'Asia/Jakarta')::date as tanggal,
  s.nama, coalesce(sum(b.qty::bigint * b.harga), 0) as total
from public.pembelian p
join public.supplier s on s.id = p.supplier_id
left join public.beli_barang b on b.pembelian_id = p.id
group by p.id, s.nama;

create view public.penjualan_list with (security_invoker = true) as
select p.id, p.kode, p.waktu, (p.waktu at time zone 'Asia/Jakarta')::date as tanggal,
  u.nama, coalesce(sum(j.qty::bigint * j.harga), 0) as total
from public.penjualan p
join public.profiles u on u.id = p.pengguna_id
left join public.jual_barang j on j.penjualan_id = p.id
group by p.id, u.nama;

-- Hak akses ------------------------------------------------------------------
-- pemilik: kelola pengguna (lewat admin API) + baca laporan
-- gudang:  kelola barang, supplier, pembelian
-- kasir:   kelola penjualan
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on all tables in schema public from anon;

alter table public.profiles enable row level security;
alter table public.barang enable row level security;
alter table public.supplier enable row level security;
alter table public.pembelian enable row level security;
alter table public.beli_barang enable row level security;
alter table public.penjualan enable row level security;
alter table public.jual_barang enable row level security;

create policy baca on public.profiles for select to authenticated using (public.my_role() is not null);

create policy baca on public.barang for select to authenticated using (public.my_role() is not null);
create policy kelola on public.barang for all to authenticated
  using (public.my_role() = 'gudang') with check (public.my_role() = 'gudang');

create policy baca on public.supplier for select to authenticated using (public.my_role() in ('gudang', 'pemilik'));
create policy kelola on public.supplier for all to authenticated
  using (public.my_role() = 'gudang') with check (public.my_role() = 'gudang');

create policy baca on public.pembelian for select to authenticated using (public.my_role() in ('gudang', 'pemilik'));
create policy kelola on public.pembelian for all to authenticated
  using (public.my_role() = 'gudang') with check (public.my_role() = 'gudang');

create policy baca on public.beli_barang for select to authenticated using (public.my_role() in ('gudang', 'pemilik'));
create policy kelola on public.beli_barang for all to authenticated
  using (public.my_role() = 'gudang') with check (public.my_role() = 'gudang');

create policy baca on public.penjualan for select to authenticated using (public.my_role() in ('kasir', 'pemilik'));
create policy kelola on public.penjualan for all to authenticated
  using (public.my_role() = 'kasir') with check (public.my_role() = 'kasir');

create policy baca on public.jual_barang for select to authenticated using (public.my_role() in ('kasir', 'pemilik'));
create policy kelola on public.jual_barang for all to authenticated
  using (public.my_role() = 'kasir') with check (public.my_role() = 'kasir');

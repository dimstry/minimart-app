-- Ringkasan untuk beranda, dihitung di database: API Supabase membatasi 1000 baris per request,
-- jadi menjumlah ribuan transaksi setahun di aplikasi akan terpotong.
-- security_invoker: RLS tabel asal tetap berlaku (gudang tidak melihat penjualan).

create view public.transaksi_bulanan with (security_invoker = true) as
select 'penjualan' as jenis, date_trunc('month', tanggal)::date as bulan, sum(total)::bigint as total, count(*)::int as jumlah
from public.penjualan_list group by 2
union all
select 'pembelian', date_trunc('month', tanggal)::date, sum(total)::bigint, count(*)::int
from public.pembelian_list group by 2;

create view public.barang_bulanan with (security_invoker = true) as
select 'penjualan' as jenis, date_trunc('month', p.waktu at time zone 'Asia/Jakarta')::date as bulan,
  b.nama, sum(j.qty)::int as qty, sum(j.qty::bigint * j.harga) as omzet
from public.jual_barang j
join public.penjualan p on p.id = j.penjualan_id
join public.barang b on b.id = j.barang_id
group by 2, 3
union all
select 'pembelian', date_trunc('month', p.waktu at time zone 'Asia/Jakarta')::date,
  b.nama, sum(j.qty)::int, sum(j.qty::bigint * j.harga)
from public.beli_barang j
join public.pembelian p on p.id = j.pembelian_id
join public.barang b on b.id = j.barang_id
group by 2, 3;

grant select on public.transaksi_bulanan, public.barang_bulanan to authenticated;
revoke all on public.transaksi_bulanan, public.barang_bulanan from anon;

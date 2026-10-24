-- Data demo: barang dengan perkiraan harga eceran minimarket 2026, supplier, dan
-- transaksi pembelian & penjualan dari 1 Januari 2026 sampai hari ini (ramai saat Lebaran, Maret).
--
-- Jalankan SEKALI di SQL Editor, setelah migrasi + seed.sql dan setelah ada akun
-- (minimal pemilik; transaksi kasir/gudang memakai akun kasir/gudang kalau ada).
-- Harga hanya perkiraan, bisa beda per daerah dan promo.
-- Barcode berawalan 2 = kode internal toko, jadi tidak bentrok dengan barcode pabrik asli.

begin;

insert into public.barang (barcode, nama, harga) values
  ('2000000000015', 'Indomie Goreng 85 g', 3500),
  ('2000000000022', 'Indomie Soto Mie 70 g', 3300),
  ('2000000000039', 'Indomie Ayam Bawang 69 g', 3300),
  ('2000000000046', 'Mie Sedaap Goreng 90 g', 3500),
  ('2000000000053', 'Pop Mie Ayam Bawang 75 g', 6000),
  ('2000000000060', 'Sarden ABC Saus Tomat 155 g', 10500),
  ('2000000000077', 'Beras Sania Premium 5 kg', 76500),
  ('2000000000084', 'Gula Pasir Gulaku 1 kg', 18500),
  ('2000000000091', 'Minyakita 1 L', 15700),
  ('2000000000107', 'Minyak Goreng Bimoli 2 L', 41000),
  ('2000000000114', 'Kecap Manis Bango 220 ml', 11500),
  ('2000000000121', 'Saus Sambal ABC 335 ml', 13000),
  ('2000000000138', 'Susu Kental Manis Frisian Flag 370 g', 13500),
  ('2000000000145', 'Aqua Air Mineral 600 ml', 4000),
  ('2000000000152', 'Le Minerale 600 ml', 3500),
  ('2000000000169', 'Aqua Air Mineral 1500 ml', 7000),
  ('2000000000176', 'Teh Pucuk Harum 350 ml', 4000),
  ('2000000000183', 'Teh Botol Sosro Kotak 250 ml', 4000),
  ('2000000000190', 'Ultra Milk Coklat 250 ml', 6800),
  ('2000000000206', 'Bear Brand 189 ml', 11500),
  ('2000000000213', 'Pocari Sweat 500 ml', 8500),
  ('2000000000220', 'Coca-Cola 390 ml', 6500),
  ('2000000000237', 'Good Day Cappuccino 25 g', 2000),
  ('2000000000244', 'Kopi Kapal Api Special 165 g', 15500),
  ('2000000000251', 'Teh Celup Sariwangi isi 25', 7500),
  ('2000000000268', 'Chitato Sapi Panggang 68 g', 11500),
  ('2000000000275', 'Qtela Singkong Balado 60 g', 8000),
  ('2000000000282', 'SilverQueen Almond 58 g', 16500),
  ('2000000000299', 'Oreo Vanila 119,6 g', 9500),
  ('2000000000305', 'Roma Kelapa 300 g', 11000),
  ('2000000000312', 'Sabun Lifebuoy Merah 110 g', 5000),
  ('2000000000329', 'Pepsodent 190 g', 14500),
  ('2000000000336', 'Sunlight Jeruk Nipis 755 ml', 17500),
  ('2000000000343', 'Rinso Anti Noda 770 g', 23500),
  ('2000000000350', 'Tisu Paseo 250 lembar', 13500),
  ('8996001354124', 'Beng-Beng 20 g', 2500),
  ('8994834006012', 'Mie Gemez Enaak 14 g', 1000),
  ('8994096219434', 'Lemon Tea 330 ml', 5000)
on conflict (barcode) do update set nama = excluded.nama, harga = excluded.harga;

insert into public.supplier (nama, alamat, telp) values
  ('Toko Grosir Berkah Jaya', 'Jl. Otto Iskandardinata No. 12, Subang', '0260-411203'),
  ('CV Sumber Rejeki', 'Jl. Ahmad Yani No. 88, Subang', '0812-2034-5512'),
  ('UD Tani Makmur', 'Jl. Raya Pagaden Km 3, Subang', '0813-2190-7745'),
  ('CV Sinar Pangan Abadi', 'Jl. Kapten Piere Tendean No. 5, Subang', '0260-417760');

-- bobot = seberapa laku (makin besar makin sering dibeli), sisa = stok akhir yang diinginkan (null = acak)
create temp table demo_barang (barcode text primary key, bobot int, sisa int) on commit drop;
insert into demo_barang values
  ('2000000000015', 10, null),
  ('2000000000022', 6, null),
  ('2000000000039', 5, 4),
  ('2000000000046', 6, null),
  ('2000000000053', 3, null),
  ('2000000000060', 1, 2),
  ('2000000000077', 1, null),
  ('2000000000084', 2, null),
  ('2000000000091', 3, null),
  ('2000000000107', 1, null),
  ('2000000000114', 2, null),
  ('2000000000121', 1, null),
  ('2000000000138', 1, null),
  ('2000000000145', 9, null),
  ('2000000000152', 7, null),
  ('2000000000169', 3, null),
  ('2000000000176', 7, null),
  ('2000000000183', 4, null),
  ('2000000000190', 4, null),
  ('2000000000206', 2, null),
  ('2000000000213', 3, 0),
  ('2000000000220', 2, null),
  ('2000000000237', 4, null),
  ('2000000000244', 1, null),
  ('2000000000251', 1, null),
  ('2000000000268', 2, null),
  ('2000000000275', 2, null),
  ('2000000000282', 1, 0),
  ('2000000000299', 2, null),
  ('2000000000305', 1, null),
  ('2000000000312', 2, null),
  ('2000000000329', 1, null),
  ('2000000000336', 1, null),
  ('2000000000343', 1, null),
  ('2000000000350', 1, null),
  ('8996001354124', 5, null),
  ('8994834006012', 3, 3),
  ('8994096219434', 2, null);

do $$
declare
  kasir uuid[] := array(select id from public.profiles where role = 'kasir' and aktif);
  gudang uuid := coalesce(
    (select id from public.profiles where role = 'gudang' and aktif limit 1),
    (select id from public.profiles where role = 'pemilik' limit 1));
  supplier bigint[] := array(select id from public.supplier);
  pool bigint[];
  awal date := '2026-01-01';
  akhir date := (now() at time zone 'Asia/Jakarta')::date;
  minggu int := (akhir - awal) / 7 + 1;
  hari date;
  t timestamptz;
  n int;
  pid bigint;
  r record;
begin
  if gudang is null then raise exception 'Buat akun pemilik dulu sebelum menjalankan demo.sql'; end if;
  if (select count(*) from public.penjualan) > 50 then raise exception 'Data transaksi sudah banyak, demo.sql sepertinya sudah pernah dijalankan'; end if;
  if cardinality(kasir) = 0 then kasir := array[gudang]; end if;

  -- barang_id diulang sesuai bobot, jadi ambil acak dari sini = barang laku lebih sering terpilih
  select array_agg(b.id) into pool from public.barang b join demo_barang d using (barcode), generate_series(1, d.bobot);

  -- 1. Rancang penjualan dulu (belum disimpan), 8-17 transaksi per hari, lebih ramai akhir pekan & menjelang Lebaran.
  create temp table demo_jual (no serial primary key, waktu timestamptz) on commit drop;
  create temp table demo_item (no int, barang_id bigint, qty int, primary key (no, barang_id)) on commit drop;
  for hari in select generate_series(awal, akhir, '1 day')::date loop
    n := 8 + floor(random() * 10)::int;
    if extract(isodow from hari) >= 6 then n := n + 4; end if;
    if hari between '2026-03-08' and '2026-03-21' then n := n * 2; end if;
    for i in 1..n loop
      t := (hari + time '07:00' + random() * interval '14 hours') at time zone 'Asia/Jakarta';
      continue when t > now();
      insert into demo_jual (waktu) values (t) returning no into pid;
      for j in 1..(1 + floor(random() ^ 1.5 * 4)::int) loop
        insert into demo_item values (pid, pool[1 + floor(random() * cardinality(pool))::int], 1 + floor(random() ^ 3 * 3)::int)
        on conflict (no, barang_id) do update set qty = demo_item.qty + excluded.qty;
      end loop;
    end loop;
  end loop;

  -- 2. Pembelian mingguan sebanyak yang terjual + stok akhir yang diinginkan,
  --    disimpan lebih dulu supaya stok tidak pernah minus saat penjualan dimasukkan.
  create temp table demo_beli on commit drop as
  select b.id as barang_id, b.harga,
    greatest(0, coalesce(s.qty, 0) + coalesce(d.sisa, 10 + floor(random() * 50)::int) - b.stok) as total
  from public.barang b
  join demo_barang d using (barcode)
  left join (select barang_id, sum(qty) as qty from demo_item group by 1) s on s.barang_id = b.id;

  for w in 0..minggu - 1 loop
    t := ((awal + w * 7) + time '08:00' + random() * interval '3 hours') at time zone 'Asia/Jakarta';
    insert into public.pembelian (kode, waktu, supplier_id, pengguna_id)
    values (to_char(t at time zone 'Asia/Jakarta', 'YYYYMMDDHH24MISS'), t, supplier[1 + w % cardinality(supplier)], gudang)
    returning id into pid;
    insert into public.beli_barang (pembelian_id, barang_id, qty, harga)
    select pid, barang_id, q, round(harga * 0.85 / 100) * 100
    from (select barang_id, harga, total / minggu + (case when w < total % minggu then 1 else 0 end) as q from demo_beli) x
    where q > 0;
  end loop;

  -- 3. Simpan penjualan (stok berkurang lewat trigger seperti transaksi biasa).
  for r in select * from demo_jual order by waktu loop
    insert into public.penjualan (kode, waktu, pengguna_id)
    values (to_char(r.waktu at time zone 'Asia/Jakarta', 'YYYYMMDDHH24MISS'), r.waktu, kasir[1 + floor(random() * cardinality(kasir))::int])
    returning id into pid;
    insert into public.jual_barang (penjualan_id, barang_id, qty, harga)
    select pid, i.barang_id, i.qty, b.harga from demo_item i join public.barang b on b.id = i.barang_id where i.no = r.no;
  end loop;
end $$;

commit;

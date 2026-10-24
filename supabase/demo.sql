-- Aktifkan mode demo di database Supabase (jalankan sekali di SQL Editor, setelah semua migrasi).
-- Jadwal pakai UTC: 20.00 UTC = 03.00 WIB.

create extension if not exists pg_cron;

select cron.schedule('reset-demo', '0 20 * * *', 'select public.reset_demo()');
select cron.schedule('demo-penjualan', '*/30 * * * *', 'select public.demo_tambah_penjualan()');

-- Isi data sekarang juga, tidak perlu menunggu nanti malam.
select public.reset_demo();

# Minimart App

Aplikasi kasir dan manajemen stok minimart berbasis web, dengan tiga peran: **pemilik**, **bagian gudang**, dan **kasir**.

Awalnya proyek tugas akhir SMK (2022) yang dibuat dengan PHP native + MySQL. Versi ini adalah rewrite penuh ke stack modern dengan fitur yang sama.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Server Actions) + TypeScript
- [Supabase](https://supabase.com): Postgres, Auth, Row Level Security
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com), dengan dark mode

## Fitur

| Peran   | Fitur |
|---------|-------|
| Pemilik | Kelola pengguna (tambah, edit, nonaktifkan, reset password), laporan pembelian & penjualan per rentang tanggal |
| Gudang  | Kelola barang & supplier, buat barcode internal & cetak label, catat pembelian (stok masuk), laporan stok siap cetak |
| Kasir   | Layar kasir dengan scan barcode, riwayat & edit penjualan |

Logika penting ada di database, bukan di aplikasi:

- **Stok otomatis**: trigger menambah/mengurangi stok saat item pembelian/penjualan berubah.
- **Anti oversell**: constraint `stok >= 0` membuat transaksi gagal secara atomik kalau stok tidak cukup, aman walau ada dua kasir bersamaan.
- **Hak akses**: setiap tabel dilindungi RLS sesuai peran; akun nonaktif otomatis kehilangan akses.

## Menjalankan secara lokal

1. Buat project di [Supabase](https://supabase.com/dashboard).
2. Buka **SQL Editor**, jalankan semua file di `supabase/migrations/` berurutan (nama file = urutan), lalu `supabase/seed.sql`.
3. Buat akun pemilik pertama: **Authentication → Users → Add user**, isi email `admin@minimart.local` (username = bagian sebelum `@`), password, centang *Auto Confirm*. Lalu jalankan di SQL Editor:

   ```sql
   update profiles set role = 'pemilik', nama = 'Nama Anda' where username = 'admin';
   ```

4. Salin `.env.example` ke `.env.local` dan isi dengan key dari **Project Settings → API Keys**.
5. Jalankan:

   ```bash
   npm install
   npm run dev
   ```

   Buka http://localhost:3000 dan masuk dengan username `admin`. Akun gudang & kasir dibuat dari menu **Pengguna**.

6. (Opsional) Isi data demo supaya dashboard ramai: setelah akun kasir dibuat, jalankan `supabase/demo.sql` di SQL Editor. Isinya ±38 barang dengan perkiraan harga pasar, 4 supplier, dan ribuan transaksi sejak 1 Januari 2026.

## Tes

```bash
npm test
```

Menjalankan migrasi di [PGlite](https://pglite.dev) (Postgres in-process, tanpa Docker), lalu menguji trigger stok, anti oversell, dan RLS tiap peran.

## Versi lama (2022)

Kode PHP aslinya tetap tersimpan di branch [`legacy-php`](../../tree/legacy-php).

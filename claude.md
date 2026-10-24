# mutherhelp — aplikasi kasir & stok minimart

## Stack

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui. Bahasa UI: Indonesia.
Mata uang Rupiah, format `Rp 15.000` (Intl.NumberFormat 'id-ID').

## Referensi desain

Folder `design/` berisi mockup per halaman (`*.dc.html`). Itu REFERENSI VISUAL,
bukan kode untuk disalin. Baca markup & style-nya untuk ukuran, spasi, warna, isi.

- `design/Sidebar.dc.html` = sidebar (bisa diciutkan jadi ikon)
- `design/Beranda.dc.html` = dashboard, `design/Main.dc.html` = layar kasir (POS)
- `design/Landing.dc.html` = landing page
- `design/Komponen.dc.html` = state: tabel kosong/loading, dialog hapus, toast, tombol loading

## Gaya visual (glass monokrom)

- Latar abu-abu lembut bergradasi (lihat `.jyp{background:...}` di file desain).
- Kartu putih semi-transparan + backdrop-blur, radius 28px, border putih tipis.
- Kartu aksen hitam (#18181b, teks putih); di dark mode kebalik jadi putih.
- Kartu "glass" ekstra bening (class `.glass` di Beranda.dc.html).
- Tombol & menu aktif = pil hitam (rounded-full). Input radius 16px.
- Font: Plus Jakarta Sasns (teks), JetBrains Mono + tabular-nums (angka, barcode).
- Status: Habis = merah lembut, Menipis = kuning lembut (stok ≤ 5).
- Wajib light & dark mode (next-themes). Desktop dulu, tetap rapi di tablet/HP.

## Aturan implementasi

- Token warna jadi CSS variable shadcn di `globals.css` (:root & .dark).
- Efek kaca jadi utility/varian komponen (mis. `glass`, `<Card variant="glass">`).
  JANGAN pakai selector atribut `[style*=...]` seperti di file desain, itu hack mockup.
- Pakai komponen shadcn: Card, Table, Dialog, AlertDialog, Badge, Sidebar, Input,
  Button, Sonner (toast), Skeleton, Switch, Tabs.
- Tiga peran: Pemilik, Gudang, Kasir. Menu sidebar mengikuti peran.

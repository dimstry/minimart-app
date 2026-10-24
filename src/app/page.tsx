import Link from "next/link"
import type { ReactNode } from "react"
import {
  AlertCircleIcon,
  ArrowRightIcon,
  BarChart3Icon,
  BoxIcon,
  CheckCircle2Icon,
  LockIcon,
  PlusIcon,
  PrinterIcon,
  ScanBarcodeIcon,
  StoreIcon,
  TruckIcon,
  type LucideIcon,
} from "lucide-react"
import { DEMO } from "@/lib/supabase"
import { cn, TOKO } from "@/lib/utils"
import { ThemeToggle } from "@/components/app-sidebar"
import { buttonVariants } from "@/components/ui/button"

// Landing page publik. Semua tombol masuk ke /beranda: tamu otomatis diarahkan ke /login oleh proxy.

const REPO = "https://github.com/dimstry/minimart-app"
const card = "frosted border border-border bg-card shadow-card"

const FITUR: [LucideIcon, string, string, "hero" | "card" | "glass"][] = [
  [ScanBarcodeIcon, "Kasir pakai scanner", "Scan atau ketik barcode, nama barang dan sisa stok muncul seketika. Jumlah default 1, tinggal Enter.", "hero"],
  [BoxIcon, "Stok bergerak sendiri", "Stok bertambah dari setiap pembelian dan berkurang di setiap penjualan. Badge habis dan menipis langsung terlihat.", "card"],
  [TruckIcon, "Pembelian dari supplier", "Pilih supplier, masukkan barang, harga beli, dan jumlah. Total pembelian terhitung otomatis.", "glass"],
  [PrinterIcon, "Laporan siap cetak", "Laporan stok dan transaksi per rentang tanggal, lengkap dengan kolom tanda tangan.", "glass"],
  [LockIcon, "Akses sesuai peran", "Pemilik, gudang, dan kasir punya menu masing-masing. Akun bisa dinonaktifkan kapan saja.", "card"],
  [BarChart3Icon, "Dashboard harian", "Penjualan hari ini, grafik per bulan, dan barang paling laku dalam satu layar.", "hero"],
]

const LANGKAH = [
  ["01", "Daftarkan barang & supplier", "Masukkan barcode, nama, dan harga jual. Catat juga supplier langgananmu."],
  ["02", "Catat barang masuk", "Setiap barang yang dicatat di pembelian otomatis menambah stok di gudang."],
  ["03", "Jual di kasir", "Stok berkurang di setiap transaksi, laporan siap dicetak kapan pun dibutuhkan."],
]

const PERAN = [
  { t: "Pemilik", tag: "Kontrol penuh", v: "hero", items: ["Kelola akun karyawan", "Reset password", "Laporan pembelian & penjualan", "Dashboard toko"] },
  { t: "Gudang", tag: "Barang masuk", v: "glass", items: ["Daftar barang & harga", "Data supplier", "Pembelian dari supplier", "Laporan stok siap cetak"] },
  { t: "Kasir", tag: "Barang keluar", v: "card", items: ["Layar kasir dengan scanner", "Saran barang & sisa stok", "Riwayat penjualan", "Peringatan stok tidak cukup"] },
]

const FAQ = [
  ["Perlu perangkat khusus?", `Tidak. ${TOKO.nama} berjalan di browser laptop, PC, atau tablet. Untuk kasir, barcode scanner USB biasa sudah cukup karena scanner bekerja seperti keyboard.`],
  ["Bisa dipakai lebih dari satu kasir?", "Bisa. Setiap kasir punya akun sendiri, dan setiap transaksi mencatat siapa kasirnya."],
  ["Bagaimana kalau stok barang tidak cukup?", "Saat jumlah yang dimasukkan melebihi stok, kasir langsung mendapat peringatan dan barang tidak ditambahkan ke transaksi. Database juga menolaknya, jadi aman walau dua kasir menjual barang yang sama bersamaan."],
  ["Laporannya bisa dicetak?", "Laporan stok dan laporan transaksi punya versi cetak ukuran A4 lengkap dengan tanggal dan kolom tanda tangan."],
  ["Kalau karyawan berhenti bekerja?", "Pemilik cukup menonaktifkan akunnya. Ia tidak bisa masuk lagi, tetapi riwayat transaksinya tetap tersimpan."],
]

const MINI = [55, 58, 90, 62, 65, 67, 71, 74]

function H2({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-[34px] leading-[1.08] font-extrabold tracking-[-0.035em] sm:text-[46px]", className)}>{children}</h2>
}

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden px-4 pt-6 pb-8 sm:px-6">
      <span aria-hidden className="orb top-36 right-[6%] size-75 max-sm:hidden" />
      <span aria-hidden className="orb top-[560px] left-[46%] size-35 max-lg:hidden" />
      <span aria-hidden className="orb top-[1320px] -left-15 size-65 max-sm:hidden" />
      <span aria-hidden className="orb top-[2600px] -right-10 size-55 max-sm:hidden" />

      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-24 sm:gap-30">
        <header className="glass flex flex-wrap items-center justify-between gap-3 rounded-full py-2.5 pr-2.5 pl-5">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <StoreIcon className="size-5" />
            </span>
            <strong className="text-[19px] font-extrabold tracking-tight">{TOKO.nama}</strong>
          </a>
          <nav aria-label="Navigasi" className="flex flex-wrap gap-1 max-md:hidden">
            {[
              ["#fitur", "Fitur"],
              ["#cara", "Cara kerja"],
              ["#peran", "Peran"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a key={href} href={href} className={buttonVariants({ variant: "ghost" })}>
                {label}
              </a>
            ))}
          </nav>
          <div className="flex gap-2">
            <ThemeToggle />
            <Link href="/beranda" className={buttonVariants({ variant: "outline", className: "h-11 border-[1.5px] border-foreground px-4.5" })}>
              Masuk
            </Link>
          </div>
        </header>

        <section id="top" className="-mt-10 flex flex-wrap items-center gap-12">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
            <span className="glass inline-flex h-9 items-center gap-2 self-start rounded-full px-4 text-[13px] font-bold">
              <span className="size-2 rounded-full bg-foreground" />
              Kasir &amp; stok untuk minimart
            </span>
            <h1 className="text-5xl leading-[1.02] font-extrabold tracking-[-0.045em] sm:text-[68px]">
              Kasir cepat.
              <br />
              Stok selalu
              <br />
              ketahuan.
            </h1>
            <p className="max-w-[520px] text-lg leading-relaxed text-muted-foreground">
              {TOKO.nama} merapikan urusan harian toko: scan barang di kasir, catat barang masuk dari supplier, dan cetak laporan stok atau transaksi kapan saja, dari satu aplikasi di browser.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={DEMO ? "/login#demo" : "/beranda"} className={buttonVariants({ className: "h-14 px-7 text-base" })}>
                {DEMO ? "Coba demo" : "Mulai sekarang"} <ArrowRightIcon />
              </Link>
              <a href={REPO} className={cn("glass inline-flex h-14 items-center rounded-full px-6.5 text-base font-bold")}>
                Lihat kode
              </a>
            </div>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScanBarcodeIcon className="size-4" /> Cukup pakai barcode scanner USB biasa.
            </span>
          </div>

          <div aria-hidden className="flex min-w-0 flex-[1_1_460px] flex-col gap-4">
            <div className="hero flex flex-col gap-4.5 rounded-[32px] p-6.5 shadow-[0_24px_60px_rgba(17,17,19,0.25)] sm:mr-16">
              <div className="flex items-center justify-between">
                <strong className="text-[17px]">Ringkasan hari ini</strong>
                <span className="inline-flex h-7 items-center rounded-full border border-(--hero-border) px-3 text-xs font-semibold">Sab, 24 Okt</span>
              </div>
              <div className="flex items-end gap-4.5">
                <strong className="font-mono text-[38px] leading-none tracking-tight">Rp 562.000</strong>
                <span className="pb-1 text-[13px] text-(--hero-muted)">8 transaksi</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  ["10", "Jenis barang", "bg-[#c4c4c9]"],
                  ["2", "Menipis", "bg-white"],
                  ["1", "Habis", "bg-white"],
                ].map(([n, l, bg]) => (
                  <span key={l} className={cn("grid gap-0.5 rounded-[20px] p-3.5 text-[#111113]", bg)}>
                    <strong className="font-mono text-2xl">{n}</strong>
                    <span className="text-xs font-semibold">{l}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4 sm:ml-12">
              <div className="glass flex min-w-0 flex-[1.3_1_0] flex-col gap-3.5 rounded-[28px] p-5">
                <strong className="text-[15px]">Penjualan per bulan</strong>
                <div className="flex h-25 items-end gap-1.5">
                  {MINI.map((v, i) => (
                    <div
                      key={i}
                      className={cn("flex-1 rounded-full", i === 2 ? "bg-primary" : "border border-foreground/8 bg-white/95 dark:border-0 dark:bg-white/22")}
                      style={{ height: `${v}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className={cn(card, "flex min-w-0 flex-1 flex-col justify-between gap-2.5 rounded-[28px] p-5")}>
                <span className="text-[13px] text-muted-foreground">Total belanja</span>
                <strong className="font-mono text-[26px] tracking-tight">Rp 168.500</strong>
                <span className="inline-flex h-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">Selesai</span>
              </div>
            </div>
          </div>
        </section>

        <section id="fitur" className="flex scroll-mt-6 flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <H2 className="max-w-[620px]">Semua yang dibutuhkan toko setiap hari.</H2>
            <p className="max-w-[380px] leading-relaxed text-muted-foreground">Dari rak gudang sampai meja kasir, setiap barang yang masuk dan keluar langsung tercatat.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FITUR.map(([Icon, t, d, v]) => (
              <article key={t} className={cn("flex min-h-65 flex-col justify-between gap-6 rounded-[32px] p-7.5", v === "card" ? card : v)}>
                <span className={cn("grid size-13 place-items-center rounded-full", v === "hero" ? "bg-(--hero-line)" : "bg-primary text-primary-foreground")}>
                  <Icon className="size-[22px]" />
                </span>
                <div className="grid gap-2">
                  <h3 className="text-xl font-bold">{t}</h3>
                  <p className={cn("text-[15px] leading-relaxed", v === "hero" ? "text-(--hero-muted)" : "text-muted-foreground")}>{d}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="hero flex flex-wrap items-center gap-12 rounded-[40px] p-8 shadow-[0_30px_80px_rgba(17,17,19,0.25)] sm:p-14">
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
            <span className="inline-flex h-8 items-center self-start rounded-full border border-(--hero-border) px-3.5 text-[13px] font-semibold">Layar kasir</span>
            <h2 className="text-[34px] leading-tight font-extrabold tracking-tight sm:text-[42px]">Dibuat untuk tangan kasir, bukan mouse.</h2>
            <p className="leading-relaxed text-(--hero-muted)">
              Scan barcode, tekan Enter, lanjut ke barang berikutnya. Kalau stok tidak cukup, kasir langsung diberi tahu sebelum transaksi disimpan.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-(--hero-muted)">
              {[
                ["F2", "Fokus barcode"],
                ["↑↓", "Pilih saran"],
                ["Enter", "Tambah barang"],
                ["F12", "Selesai"],
              ].map(([k, l]) => (
                <span key={k} className="flex items-center gap-2.5">
                  <kbd className="inline-flex h-7 min-w-10 items-center justify-center rounded-lg border border-(--hero-border) px-1.5 font-mono text-xs font-bold">{k}</kbd>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div aria-hidden className="flex min-w-0 flex-[1.2_1_440px] flex-col gap-3.5 rounded-[30px] bg-[#f4f4f6] p-5.5 text-[#111113]">
            <div className="flex h-15 items-center gap-3.5 rounded-[18px] border-2 border-[#18181b] bg-white px-4.5">
              <ScanBarcodeIcon className="size-6" />
              <span className="font-mono text-xl font-bold">899600160</span>
              <span className="h-6.5 w-0.5 bg-[#18181b]" />
            </div>
            <div className="overflow-hidden rounded-[18px] bg-white">
              {[
                ["Indomie Goreng 85 g", "Rp 3.500", "Stok 240", false],
                ["Indomie Soto Mie 75 g", "Rp 3.300", "Stok 96", false],
                ["Indomie Ayam Bawang 69 g", "Rp 3.300", "Stok 3", true],
              ].map(([nm, h, s, tipis]) => (
                <div key={String(nm)} className="flex items-center gap-3 border-b border-[#ececef] px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1 font-semibold">{nm}</span>
                  <span className="font-mono text-[#56565e]">{h}</span>
                  <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-xs font-bold whitespace-nowrap", tipis ? "bg-[#fcefd2] text-[#6b3a00]" : "bg-[#f0f0f2] text-[#56565e]")}>{s}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 rounded-[18px] bg-white px-4 py-3 text-sm">
              <AlertCircleIcon className="size-5 shrink-0 text-[#b42318]" />
              <span>
                <strong>Stok tidak cukup.</strong> Indomie Ayam Bawang tinggal 3.
              </span>
            </div>
          </div>
        </section>

        <section id="cara" className="flex scroll-mt-6 flex-col gap-10">
          <H2 className="text-center">Tiga langkah, stok ikut rapi.</H2>
          <div className="grid gap-5 md:grid-cols-3">
            {LANGKAH.map(([n, t, d]) => (
              <div key={n} className="glass flex min-h-55 flex-col gap-5 rounded-[32px] p-7.5">
                <span className="grid size-13 place-items-center rounded-full bg-primary font-mono text-lg font-bold text-primary-foreground">{n}</span>
                <div className="grid gap-2">
                  <h3 className="text-[21px] font-bold">{t}</h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="peran" className="flex scroll-mt-6 flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <H2 className="max-w-[560px]">Satu toko, tiga peran.</H2>
            <p className="max-w-[400px] leading-relaxed text-muted-foreground">Setiap orang punya akun sendiri dan hanya melihat menu yang ia butuhkan.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {PERAN.map((r) => (
              <div key={r.t} className={cn("flex flex-col gap-6 rounded-[32px] p-7.5", r.v === "card" ? card : r.v)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-[26px] font-extrabold tracking-tight">{r.t}</h3>
                  <span className={cn("inline-flex h-7.5 items-center rounded-full border px-3 text-xs font-bold", r.v === "hero" ? "border-(--hero-border)" : "border-input")}>{r.tag}</span>
                </div>
                <ul className="grid gap-3">
                  {r.items.map((i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[15px]">
                      <CheckCircle2Icon className="size-[18px] shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="flex scroll-mt-6 flex-wrap items-start gap-12">
          <div className="flex flex-[1_1_320px] flex-col gap-4">
            <H2>Pertanyaan yang sering muncul</H2>
            <p className="leading-relaxed text-muted-foreground">
              Ini proyek portofolio.{" "}
              <a href={REPO} className="font-semibold text-foreground underline underline-offset-4">
                Lihat kodenya di GitHub
              </a>
              .
            </p>
          </div>
          <div className="flex min-w-0 flex-[1.6_1_520px] flex-col gap-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="glass group rounded-3xl px-6">
                <summary className="flex min-h-17 cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-open:rotate-45">
                    <PlusIcon className="size-4" />
                  </span>
                </summary>
                <p className="mb-5.5 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="hero flex flex-wrap items-center justify-between gap-8 rounded-[40px] p-8 sm:p-14">
          <div className="grid gap-3">
            <h2 className="text-[34px] leading-tight font-extrabold tracking-tight sm:text-[42px]">Siap merapikan toko?</h2>
            <p className="text-(--hero-muted)">Daftarkan barang pertamamu hari ini. Kasir bisa langsung jualan besok pagi.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/beranda" className="inline-flex h-14 items-center gap-2.5 rounded-full bg-(--hero-tile-strong) px-7 text-base font-bold text-(--hero-tile-strong-fg)">
              Mulai sekarang <ArrowRightIcon className="size-4" />
            </Link>
            <a href="#faq" className="inline-flex h-14 items-center rounded-full border-[1.5px] border-(--hero-border) px-6.5 text-base font-bold">
              Tanya-tanya
            </a>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 px-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <strong className="text-foreground">{TOKO.nama}</strong>© {new Date().getFullYear()}
          </span>
          <span className="flex flex-wrap gap-5">
            <a href="#fitur">Fitur</a>
            <a href="#cara">Cara kerja</a>
            <a href="#faq">FAQ</a>
            <Link href="/beranda">Masuk</Link>
          </span>
        </footer>
      </div>
    </div>
  )
}

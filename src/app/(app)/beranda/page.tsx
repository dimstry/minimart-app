import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import { AlertTriangleIcon, ArrowUpRightIcon, BanIcon, BoxIcon, ChevronRightIcon, PlusIcon, ReceiptTextIcon, StoreIcon, UserIcon, UsersIcon } from "lucide-react"
import { createClient, requireRole, type Profile, type Role } from "@/lib/supabase"
import { cn, hariIni, inisial, jam, ROLE_LABEL, rupiah, tanggalPanjang, TOKO } from "@/lib/utils"
import { EmptyState, MENIPIS } from "@/components/blocks"
import { ActionForm } from "@/components/form"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { buatPenjualan } from "../penjualan/actions"

export const metadata: Metadata = { title: "Beranda" }

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
const ringkas = (n: number) => "Rp " + new Intl.NumberFormat("id-ID", { notation: "compact" }).format(n)

type Baris = { id: number; kode: string; waktu: string; nama: string; total: number }

// Tombol utama & akses cepat per peran. href null = buat transaksi kasir baru.
const AKSES: Record<Role, { t: string; d: string; href: string | null }[]> = {
  gudang: [
    { t: "Daftar barang", d: "Cek harga & stok", href: "/barang" },
    { t: "Pembelian baru", d: "Catat barang masuk", href: "/pembelian?baru=1" },
    { t: "Laporan stok", d: "Siap cetak", href: "/barang/stok" },
  ],
  kasir: [
    { t: "Transaksi baru", d: "Buka layar kasir", href: null },
    { t: "Daftar penjualan", d: "Transaksi hari ini", href: "/penjualan" },
  ],
  pemilik: [
    { t: "Laporan transaksi", d: "Pembelian & penjualan", href: "/laporan" },
    { t: "Pengguna", d: "Kelola akun karyawan", href: "/pengguna" },
    { t: "Laporan stok", d: "Siap cetak", href: "/barang/stok" },
  ],
}

export default async function BerandaPage() {
  const profile = await requireRole()
  // Gudang tidak boleh melihat penjualan (RLS), jadi ringkasannya dari pembelian.
  const jenis = profile.role === "gudang" ? "pembelian" : "penjualan"
  const hari = hariIni()
  const supabase = await createClient()
  const awalTahun = `${hari.slice(0, 4)}-01-01`
  const [{ data: profiles }, { data: barang }, { data: transaksiHariIni }, { data: bulanan }, { data: laris }] = await Promise.all([
    supabase.from("profiles").select("nama, role, aktif").overrideTypes<Profile[], { merge: false }>(),
    supabase.from("barang").select("stok"),
    supabase.from(`${jenis}_list`).select("id, kode, waktu, nama, total").eq("tanggal", hari).order("waktu", { ascending: false }).overrideTypes<Baris[], { merge: false }>(),
    supabase.from("transaksi_bulanan").select("bulan, total").eq("jenis", jenis).gte("bulan", awalTahun),
    supabase.from("barang_bulanan").select("nama, qty, omzet").eq("jenis", jenis).eq("bulan", `${hari.slice(0, 7)}-01`).order("qty", { ascending: false }).limit(5),
  ])

  const pemilik = profiles?.find((p) => p.role === "pemilik")
  const karyawan = profiles?.filter((p) => p.aktif && p.role !== "pemilik") ?? []
  const stok = barang?.map((b) => b.stok) ?? []
  const hariIniRows = transaksiHariIni ?? []

  const bulanIni = Number(hari.slice(5, 7))
  const perBulan = BULAN.slice(0, bulanIni).map((m, i) => ({
    m,
    v: Number(bulanan?.find((b) => Number(b.bulan.slice(5, 7)) === i + 1)?.total ?? 0),
  }))
  const top = (laris ?? []).map((r) => [r.nama, { q: r.qty, omzet: Number(r.omzet) }] as const)

  const daftarHref = profile.role === "pemilik" ? `/laporan/${jenis}` : `/${jenis}`
  const stokHref = (f: string) => (profile.role === "gudang" ? `/barang?f=${f}` : profile.role === "pemilik" ? "/barang/stok" : undefined)
  const [cta] = AKSES[profile.role]

  return (
    <div className="relative flex flex-col gap-6">
      <span aria-hidden className="orb top-72 right-10 hidden size-52 lg:block" />
      <span aria-hidden className="orb top-[640px] left-[44%] hidden size-36 opacity-90 lg:block" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-extrabold tracking-tight">Halo, {profile.nama.split(" ")[0]}!</h1>
          <div className="flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
            {tanggalPanjang()}
            <span className="size-1 rounded-full bg-muted-foreground" />
            Masuk sebagai
            <span className="frosted inline-flex h-6.5 items-center rounded-full border bg-card px-3 text-xs font-bold text-foreground">
              {ROLE_LABEL[profile.role]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <AksesLink item={cta}>
            {(cls) => (
              <span className={cn(buttonVariants({ size: "lg" }), cls)}>
                <PlusIcon /> {profile.role === "pemilik" ? "Lihat laporan" : cta.t}
              </span>
            )}
          </AksesLink>
          <span className="grid size-12 place-items-center rounded-full bg-primary text-[15px] font-extrabold text-primary-foreground">
            {inisial(profile.nama)}
          </span>
        </div>
      </div>

      <section aria-label="Info toko" className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={StoreIcon} label="Nama toko" value={TOKO.nama} sub={`Minimart · ${TOKO.kota}`} />
        <InfoCard icon={UserIcon} label="Pemilik" value={pemilik?.nama ?? "-"} sub="Pengelola akun karyawan" />
        <Card variant="hero" className="flex-row items-center gap-4 rounded-[28px] px-5.5 py-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-(--hero-line)">
            <UsersIcon className="size-5" />
          </span>
          <span className="grid gap-0.5">
            <span className="text-[13px] text-(--hero-muted)">Karyawan aktif</span>
            <strong className="font-mono text-2xl leading-tight">
              {karyawan.length} <span className="font-sans text-sm font-semibold text-(--hero-muted)">orang</span>
            </strong>
            <span className="text-xs text-(--hero-muted)">
              {karyawan.filter((k) => k.role === "gudang").length} gudang · {karyawan.filter((k) => k.role === "kasir").length} kasir
            </span>
          </span>
        </Card>
      </section>

      <div className="relative flex flex-wrap items-stretch gap-5">
        <Card variant="hero" className="min-w-0 flex-[1.15_1_360px] gap-5.5 rounded-[32px] p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Ringkasan hari ini</h2>
            <Link href={daftarHref} aria-label={`Lihat ${jenis} hari ini`} className="grid size-9 place-items-center rounded-full border border-(--hero-border)">
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <div className="grid gap-0.5">
              <strong className="font-mono text-[34px] leading-none font-bold tracking-tight">{rupiah(hariIniRows.reduce((s, r) => s + r.total, 0))}</strong>
              <span className="text-[13px] text-(--hero-muted)">{jenis} hari ini</span>
            </div>
            <span className="h-10 w-px bg-(--hero-line)" />
            <div className="flex items-center gap-2.5">
              <strong className="font-mono text-[34px] leading-none font-bold">{hariIniRows.length}</strong>
              <span className="text-[13px] leading-snug text-(--hero-muted)">
                transaksi
                <br />
                {jenis === "penjualan" ? "kasir" : "gudang"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StokTile href={stokHref("semua")} icon={BoxIcon} n={stok.length} label="Jenis barang" soft />
            <StokTile href={stokHref("tipis")} icon={AlertTriangleIcon} n={stok.filter((s) => s > 0 && s <= MENIPIS).length} label="Menipis" />
            <StokTile href={stokHref("habis")} icon={BanIcon} n={stok.filter((s) => s === 0).length} label="Habis" />
          </div>
        </Card>

        <Card className="min-w-0 flex-[1.7_1_460px] gap-4.5 rounded-[32px] p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1.5">
              <h2 className="text-xl font-bold">{jenis === "penjualan" ? "Penjualan" : "Pembelian"} per bulan</h2>
              <div className="flex items-center gap-3.5 text-[13px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-foreground" />
                  {hari.slice(0, 4)}
                </span>
                <span>Jan – {BULAN[bulanIni - 1]}</span>
              </div>
            </div>
            <div className="grid justify-items-end gap-0.5">
              <strong className="font-mono text-2xl font-bold tracking-tight">{ringkas(perBulan.reduce((s, b) => s + b.v, 0))}</strong>
              <span className="text-xs text-muted-foreground">total tahun ini</span>
            </div>
          </div>
          <BarChart data={perBulan} />
        </Card>
      </div>

      <div className="relative flex flex-wrap items-stretch gap-5">
        <Card className="min-w-0 flex-[1.2_1_400px] gap-4.5 rounded-[32px] p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="grid gap-1">
              <h2 className="text-xl font-bold">{jenis === "penjualan" ? "Barang paling laku" : "Barang paling banyak dibeli"}</h2>
              <span className="text-[13px] text-muted-foreground">Bulan ini · berdasarkan jumlah</span>
            </div>
            <span className="inline-flex h-7.5 items-center rounded-full border border-input px-3 font-mono text-xs font-bold">Top 5</span>
          </div>
          {top.length === 0 && <EmptyState className="py-8">Belum ada transaksi bulan ini.</EmptyState>}
          <ol className="grid gap-3.5">
            {top.map(([nama, t], i) => (
              <li key={nama} className="flex items-center gap-3.5">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-[10px] font-mono text-[13px] font-bold",
                    i === 0 ? "bg-primary text-primary-foreground" : "border-[1.5px] border-input",
                  )}
                >
                  {i + 1}
                </span>
                <div className="grid min-w-0 flex-1 gap-1.5">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate font-semibold">{nama}</span>
                    <span className="font-mono font-bold whitespace-nowrap">
                      {t.q} <span className="font-sans font-medium text-muted-foreground">{jenis === "penjualan" ? "terjual" : "dibeli"}</span>
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", i === 0 ? "bg-primary" : "bg-muted-foreground")} style={{ width: `${(t.q / top[0][1].q) * 100}%` }} />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{rupiah(t.omzet)}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card variant="glass" className="min-w-0 flex-[1_1_340px] gap-4 rounded-[32px] p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="grid gap-1">
              <h2 className="text-xl font-bold">Transaksi terakhir</h2>
              <span className="text-[13px] text-muted-foreground">Hari ini, {jenis === "penjualan" ? "dari layar kasir" : "dari gudang"}</span>
            </div>
            <Link href={daftarHref} className="inline-flex items-center gap-1 text-[13px] font-bold">
              Semua <ChevronRightIcon className="size-3.5" />
            </Link>
          </div>
          {hariIniRows.length === 0 && <EmptyState icon={ReceiptTextIcon} className="py-8" title="Belum ada transaksi hari ini" />}
          <ul className="grid gap-2.5">
            {hariIniRows.slice(0, 4).map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-[20px] border border-white/70 bg-white/50 px-3.5 py-3 dark:border-white/10 dark:bg-white/6">
                <span className="grid size-9.5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <ReceiptTextIcon className="size-4" />
                </span>
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <strong className="font-mono text-[13px]">{r.kode}</strong>
                  <span className="truncate text-xs text-muted-foreground">
                    {jam(r.waktu)} · {r.nama}
                  </span>
                </span>
                <strong className="font-mono text-sm whitespace-nowrap">{rupiah(r.total)}</strong>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="relative grid gap-4">
        <h2 className="px-1 text-xl font-bold">Akses cepat</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AKSES[profile.role].map((k) => (
            <AksesLink key={k.t} item={k}>
              {(cls) => (
                <span className={cn("hero flex min-h-28 w-full flex-col justify-between gap-3 rounded-[28px] px-6 py-5.5 text-left", cls)}>
                  <span className="flex items-center justify-between gap-3">
                    <strong className="text-lg font-bold">{k.t}</strong>
                    <span className="grid size-8 place-items-center rounded-full border-[1.5px] border-(--hero-border)">
                      <ArrowUpRightIcon className="size-3.5" />
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-[13px] text-(--hero-muted)">
                    <span className="size-1.5 rounded-full bg-current" />
                    {k.d}
                  </span>
                </span>
              )}
            </AksesLink>
          ))}
        </div>
      </section>
    </div>
  )
}

// Link biasa, atau tombol yang membuat transaksi kasir baru (href null).
function AksesLink({ item, children }: { item: (typeof AKSES)[Role][number]; children: (cls: string) => ReactNode }) {
  if (item.href) return <Link href={item.href}>{children("")}</Link>
  return (
    <ActionForm action={buatPenjualan}>
      <Button type="submit" variant="ghost" className="h-auto w-full p-0 hover:bg-transparent">
        {children("")}
      </Button>
    </ActionForm>
  )
}

function InfoCard({ icon: Icon, label, value, sub }: { icon: typeof StoreIcon; label: string; value: string; sub: string }) {
  return (
    <Card className="flex-row items-center gap-4 rounded-[28px] px-5.5 py-5">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-muted">
        <Icon className="size-5" />
      </span>
      <span className="grid gap-0.5">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <strong className="text-xl font-extrabold tracking-tight">{value}</strong>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </span>
    </Card>
  )
}

function StokTile({ href, icon: Icon, n, label, soft }: { href?: string; icon: typeof BoxIcon; n: number; label: string; soft?: boolean }) {
  const cls = cn(
    "flex min-h-28 flex-col items-center justify-center gap-1 rounded-[22px] p-3",
    soft ? "bg-(--hero-tile) text-[#111113] dark:text-[#f4f4f6]" : "bg-(--hero-tile-strong) text-(--hero-tile-strong-fg)",
  )
  const body = (
    <>
      <Icon className="size-[18px]" />
      <strong className="font-mono text-[28px] leading-tight">{n}</strong>
      <span className="text-xs font-semibold">{label}</span>
    </>
  )
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}

// Grafik batang pil: bulan berjalan hitam, bulan tertinggi abu tua, sisanya putih.
function BarChart({ data }: { data: { m: string; v: number }[] }) {
  const peak = Math.max(...data.map((d) => d.v))
  // Skala dibulatkan ke angka "cantik" supaya label sumbu rapi (mis. 0 / 6 rb / 12 rb / 18 rb).
  const kasar = peak / 3 || 1
  const pangkat = 10 ** Math.floor(Math.log10(kasar))
  const max = Math.ceil(kasar / pangkat) * pangkat * 3
  const now = data.length - 1
  return (
    <div className="flex min-h-[230px] flex-1 gap-2.5 pt-7">
      <div className="flex w-14 flex-col justify-between pb-9 text-right font-mono text-[11px] text-muted-foreground">
        {[1, 2 / 3, 1 / 3, 0].map((f) => (
          <span key={f}>{new Intl.NumberFormat("id-ID", { notation: "compact" }).format(max * f)}</span>
        ))}
      </div>
      <div className="relative flex min-w-0 flex-1 gap-2">
        <div className="pointer-events-none absolute inset-x-0 top-1.5 bottom-9 flex flex-col justify-between">
          <span className="border-t border-dashed border-input" />
          <span className="border-t border-dashed border-input" />
          <span className="border-t border-dashed border-input" />
          <span className="border-t border-input" />
        </div>
        {data.map((d, i) => {
          const tip = d.v > 0 && (i === now || d.v === peak)
          return (
            <div key={d.m} className="flex min-w-0 flex-1 flex-col items-center gap-2.5">
              <div className="relative flex w-full flex-1 flex-col items-center justify-end pt-1.5">
                {tip && (
                  <span
                    className="absolute left-1/2 z-10 inline-flex h-6.5 -translate-x-1/2 items-center rounded-full bg-primary px-2.5 font-mono text-[11px] font-bold whitespace-nowrap text-primary-foreground"
                    style={{ top: `calc(${100 - (d.v / max) * 100}% - 30px)` }}
                  >
                    {ringkas(d.v)}
                  </span>
                )}
                <div
                  title={`${d.m} · ${rupiah(d.v)}`}
                  className={cn(
                    "w-full max-w-[34px] rounded-full",
                    i === now ? "bg-primary" : d.v === peak ? "bg-foreground/40" : "border border-foreground/8 bg-white/95 dark:border-0 dark:bg-white/14",
                  )}
                  style={{ height: `${Math.max((d.v / max) * 100, 2)}%` }}
                />
              </div>
              <span
                className={cn(
                  "inline-flex h-6.5 min-w-6.5 items-center justify-center rounded-full px-1.5 text-xs",
                  i === now ? "bg-primary font-bold text-primary-foreground" : "font-medium text-muted-foreground",
                )}
              >
                {d.m}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

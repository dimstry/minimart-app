import type { ComponentProps, ReactNode } from "react"
import Link from "next/link"
import { ArrowLeftIcon, InboxIcon, SearchIcon, StoreIcon, type LucideIcon } from "lucide-react"
import { cn, jam, rupiah, tanggal, tanggalPanjang, TOKO, waktu } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PageHeader({
  title,
  description,
  back,
  badge,
  children,
}: {
  title: ReactNode
  description?: ReactNode
  back?: string
  badge?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[26px] font-extrabold tracking-tight">{title}</h1>
          {badge}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {back && (
          <Link href={back} className={buttonVariants({ variant: "ghost" })}>
            <ArrowLeftIcon /> Kembali
          </Link>
        )}
        {children}
      </div>
    </div>
  )
}

// Filter lewat query string (?q=), cukup form GET biasa. children = input hidden filter lain.
export function SearchForm({ q, placeholder = "Cari…", children }: { q?: string; placeholder?: string; children?: ReactNode }) {
  return (
    <form className="relative w-full max-w-[380px] flex-1 basis-64">
      <SearchIcon className="absolute top-3 left-3.5 size-4 text-muted-foreground" />
      <Input name="q" defaultValue={q} placeholder={placeholder} aria-label={placeholder} className="h-10 rounded-full pl-10 text-sm md:text-sm" />
      {children}
    </form>
  )
}

// Pilihan filter berbentuk tab pil (link biasa, jadi tetap jalan tanpa JS).
export function Segmented({ items }: { items: { href: string; label: string; n?: number; active: boolean }[] }) {
  return (
    <nav className="inline-flex gap-0.5 rounded-full bg-muted p-1">
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={t.active ? "page" : undefined}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium",
            t.active && "bg-card font-bold shadow-sm frosted",
          )}
        >
          {t.label}
          {t.n !== undefined && <span className="font-mono text-xs text-muted-foreground">{t.n}</span>}
        </Link>
      ))}
    </nav>
  )
}

export function TableCard({
  toolbar,
  head,
  children,
  footer,
  note,
  className,
}: {
  toolbar?: ReactNode
  head: ReactNode
  children: ReactNode
  footer?: ReactNode
  note?: ReactNode
  className?: string
}) {
  return (
    <Card className={cn("gap-0 py-0", className)}>
      {toolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 print:hidden">{toolbar}</div>
      )}
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">{head}</TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
        {footer && <TableFooter>{footer}</TableFooter>}
      </Table>
      {note && <div className="px-5 py-3 text-[13px] text-muted-foreground">{note}</div>}
    </Card>
  )
}

export function EmptyState({
  icon: Icon = InboxIcon,
  title = "Belum ada data",
  children,
  className,
}: {
  icon?: LucideIcon
  title?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-6 py-14 text-center", className)}>
      <span className="mb-1 grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-[22px]" />
      </span>
      <strong className="text-[15px]">{title}</strong>
      {children && <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">{children}</div>}
    </div>
  )
}

export function EmptyRow({ cols, ...props }: { cols: number } & ComponentProps<typeof EmptyState>) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={cols} className="h-auto whitespace-normal">
        <EmptyState {...props} />
      </TableCell>
    </TableRow>
  )
}

export const MENIPIS = 5

export function StokBadge({ stok }: { stok: number }) {
  if (stok === 0) return <Badge variant="destructive">Habis</Badge>
  if (stok <= MENIPIS) return <Badge variant="warning">Menipis</Badge>
  return null
}

// Kartu form: judul di atas, isian di tengah, tombol di bawah.
export function FormCard({
  title,
  description,
  footer,
  children,
}: {
  title: string
  description?: string
  footer: ReactNode
  children: ReactNode
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b py-5">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <div className="flex flex-col gap-5 p-6">{children}</div>
      <CardFooter className="flex-wrap justify-end gap-2">{footer}</CardFooter>
    </Card>
  )
}

type Transaksi = { id: number; kode: string; waktu: string; nama: string; total: number }

// Daftar pembelian/penjualan + total. Dengan aksi = daftar harian (kolom jam);
// tanpa aksi = laporan rentang tanggal (kolom No & tanggal).
export function TransaksiTable({
  rows,
  namaLabel,
  aksi,
  toolbar,
  empty,
}: {
  rows: Transaksi[]
  namaLabel: string
  aksi?: (row: Transaksi) => ReactNode
  toolbar?: ReactNode
  empty?: ReactNode
}) {
  const laporan = !aksi
  return (
    <TableCard
      toolbar={toolbar}
      head={
        <>
          {laporan && <TableHead className="w-14">No</TableHead>}
          <TableHead>Kode</TableHead>
          <TableHead>{laporan ? "Tanggal" : "Waktu"}</TableHead>
          <TableHead>{namaLabel}</TableHead>
          <TableHead className="text-right">Total</TableHead>
          {aksi && <TableHead className="w-28 text-right">Aksi</TableHead>}
        </>
      }
      footer={
        rows.length > 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={laporan ? 4 : 3}>TOTAL</TableCell>
            <TableCell className="text-right font-mono">{rupiah(rows.reduce((s, r) => s + r.total, 0))}</TableCell>
            {aksi && <TableCell />}
          </TableRow>
        )
      }
    >
      {rows.length === 0 && (
        <EmptyRow cols={5}>{empty}</EmptyRow>
      )}
      {rows.map((r, i) => (
        <TableRow key={r.id}>
          {laporan && <TableCell className="font-mono text-muted-foreground">{i + 1}</TableCell>}
          <TableCell className="font-mono font-semibold">{r.kode}</TableCell>
          <TableCell className="font-mono text-muted-foreground">{laporan ? tanggal(r.waktu) : jam(r.waktu)}</TableCell>
          <TableCell>{r.nama}</TableCell>
          <TableCell className="text-right font-mono font-semibold">{rupiah(r.total)}</TableCell>
          {aksi && <TableCell className="text-right">{aksi(r)}</TableCell>}
        </TableRow>
      ))}
    </TableCard>
  )
}

export type Item = { id: number; qty: number; harga: number; barang: { barcode: string; nama: string } | null }

// Lembar laporan siap cetak (A4): kop toko, tabel, tanda tangan. Warna tetap hitam-putih di mode apa pun.
export function PrintSheet({
  judul,
  periode,
  head,
  children,
  catatan,
  jabatan,
  nama,
}: {
  judul: string
  periode: string
  head: ReactNode
  children: ReactNode
  catatan?: string
  jabatan: string
  nama: string
}) {
  const now = new Date().toISOString()
  return (
    <div className="mx-auto flex min-h-[1123px] w-full max-w-[794px] flex-col gap-6 rounded-[28px] bg-white px-8 py-14 text-base text-[#111113] shadow-card sm:px-15 print:min-h-0 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
      <div className="flex items-center justify-between gap-4 border-b-2 border-[#111113] pb-4">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 place-items-center rounded-[10px] bg-[#18181b] text-white">
            <StoreIcon className="size-6" />
          </span>
          <div className="grid gap-0.5">
            <strong className="text-[22px] font-extrabold">{TOKO.nama}</strong>
            <span className="text-[#4a4a52]">Minimart · {TOKO.kota}</span>
          </div>
        </div>
        <div className="grid gap-0.5 text-right">
          <strong className="text-lg tracking-wide uppercase">{judul}</strong>
          <span className="text-[#4a4a52]">{periode}</span>
        </div>
      </div>
      <table className="w-full border border-[#c9c9d0] text-[15px] [&_td]:border-b [&_td]:border-[#e2e2e7] [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 [&_th]:py-2.5 [&_th]:text-left [&_tfoot_td]:bg-[#f0f0f2] [&_tfoot_td]:font-extrabold">
        <thead className="border-b border-[#c9c9d0] bg-[#f0f0f2] font-bold">
          <tr>{head}</tr>
        </thead>
        {children}
      </table>
      {catatan && <p className="text-[#4a4a52]">{catatan}</p>}
      <div className="flex-1" />
      <div className="ml-auto grid w-64 justify-items-center gap-1 text-center">
        <span>
          {TOKO.kota}, {tanggalPanjang(undefined, false)}
        </span>
        <span>{jabatan}</span>
        <span className="h-20" />
        <strong className="w-full border-b border-[#111113] pb-1">{nama}</strong>
      </div>
      <div className="flex justify-between border-t border-[#e2e2e7] pt-3 text-xs text-[#6b6b74]">
        <span>
          Dicetak dari {TOKO.nama} · {waktu(now)}
        </span>
      </div>
    </div>
  )
}

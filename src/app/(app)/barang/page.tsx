import type { Metadata } from "next"
import Link from "next/link"
import { PackageIcon, PencilIcon, PlusIcon, PrinterIcon, TagIcon } from "lucide-react"
import { createClient, requireRole } from "@/lib/supabase"
import { cari, rupiah } from "@/lib/utils"
import { EmptyRow, MENIPIS, PageHeader, SearchForm, Segmented, StokBadge, TableCard } from "@/components/blocks"
import { DeleteButton } from "@/components/form"
import { buttonVariants } from "@/components/ui/button"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import { hapusBarang } from "./actions"

export const metadata: Metadata = { title: "Barang" }

const FILTER = {
  semua: { label: "Semua", cocok: () => true },
  tipis: { label: "Menipis", cocok: (s: number) => s > 0 && s <= MENIPIS },
  habis: { label: "Habis", cocok: (s: number) => s === 0 },
}

export default async function BarangPage({ searchParams }: PageProps<"/barang">) {
  await requireRole("gudang")
  const { q, f: fRaw } = (await searchParams) as { q?: string; f?: string }
  const f = fRaw && fRaw in FILTER ? (fRaw as keyof typeof FILTER) : "semua"
  const supabase = await createClient()
  let query = supabase.from("barang").select().order("nama")
  if (q) query = query.or(`nama.ilike.${cari(q)},barcode.ilike.${cari(q)}`)
  const { data: semua } = await query
  // ponytail: filter stok di JS biar jumlah per tab tetap kelihatan; pindah ke query kalau barang ribuan.
  const rows = semua?.filter((b) => FILTER[f].cocok(b.stok)) ?? []
  const href = (k: string) => `/barang?${new URLSearchParams({ ...(q && { q }), ...(k !== "semua" && { f: k }) })}`

  return (
    <>
      <PageHeader title="Daftar barang" description="Kelola katalog, harga jual, dan pantau stok gudang.">
        <Link href="/barang/label" className={buttonVariants({ variant: "outline" })}>
          <TagIcon /> Cetak label
        </Link>
        <Link href="/barang/stok" className={buttonVariants({ variant: "outline" })}>
          <PrinterIcon /> Laporan stok
        </Link>
        <Link href="/barang/baru" className={buttonVariants()}>
          <PlusIcon /> Tambah barang
        </Link>
      </PageHeader>
      <TableCard
        toolbar={
          <>
            <SearchForm q={q} placeholder="Cari nama atau barcode…">
              {f !== "semua" && <input type="hidden" name="f" value={f} />}
            </SearchForm>
            <Segmented
              items={Object.entries(FILTER).map(([k, v]) => ({
                href: href(k),
                label: v.label,
                n: semua?.filter((b) => v.cocok(b.stok)).length,
                active: k === f,
              }))}
            />
          </>
        }
        head={
          <>
            <TableHead>Barcode</TableHead>
            <TableHead>Nama barang</TableHead>
            <TableHead className="text-right">Harga</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead className="w-28 text-right">Aksi</TableHead>
          </>
        }
        note={`Menampilkan ${rows.length} dari ${semua?.length ?? 0} barang`}
      >
        {rows.length === 0 && (
          <EmptyRow cols={5} icon={PackageIcon} title={q || f !== "semua" ? "Barang tidak ditemukan" : "Belum ada barang"}>
            Coba kata kunci lain atau tambahkan barang baru.
          </EmptyRow>
        )}
        {rows.map((b) => (
          <TableRow key={b.id}>
            <TableCell className="font-mono text-[13px] text-muted-foreground">{b.barcode}</TableCell>
            <TableCell className="font-semibold">{b.nama}</TableCell>
            <TableCell className="text-right font-mono">{rupiah(b.harga)}</TableCell>
            <TableCell>
              <span className="flex items-center gap-2.5">
                <span className="min-w-9 font-mono font-bold">{b.stok}</span>
                <StokBadge stok={b.stok} />
              </span>
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-0.5">
                <Link href={`/barang/${b.id}`} aria-label="Edit barang" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground" })}>
                  <PencilIcon />
                </Link>
                <DeleteButton action={hapusBarang.bind(null, b.id)} what="barang" label={b.nama} description="akan dihapus dari katalog. Tindakan ini tidak bisa dibatalkan." />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableCard>
    </>
  )
}

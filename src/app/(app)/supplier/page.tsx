import type { Metadata } from "next"
import Link from "next/link"
import { PencilIcon, PlusIcon, TruckIcon } from "lucide-react"
import { createClient, requireRole } from "@/lib/supabase"
import { cari } from "@/lib/utils"
import { EmptyRow, PageHeader, SearchForm, TableCard } from "@/components/blocks"
import { DeleteButton } from "@/components/form"
import { buttonVariants } from "@/components/ui/button"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import { hapusSupplier } from "./actions"

export const metadata: Metadata = { title: "Supplier" }

export default async function SupplierPage({ searchParams }: PageProps<"/supplier">) {
  await requireRole("gudang")
  const { q } = (await searchParams) as { q?: string }
  const supabase = await createClient()
  let query = supabase.from("supplier").select().order("nama")
  if (q) query = query.or(`nama.ilike.${cari(q)},alamat.ilike.${cari(q)},telp.ilike.${cari(q)}`)
  const { data: rows } = await query

  return (
    <>
      <PageHeader title="Daftar supplier" description="Pemasok barang yang dipakai saat mencatat pembelian.">
        <Link href="/supplier/baru" className={buttonVariants()}>
          <PlusIcon /> Tambah supplier
        </Link>
      </PageHeader>
      <TableCard
        toolbar={<SearchForm q={q} placeholder="Cari nama, alamat, atau telp…" />}
        head={
          <>
            <TableHead>Nama</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Telp</TableHead>
            <TableHead className="w-28 text-right">Aksi</TableHead>
          </>
        }
        note={`${rows?.length ?? 0} supplier terdaftar`}
      >
        {!rows?.length && (
          <EmptyRow cols={4} icon={TruckIcon} title={q ? "Supplier tidak ditemukan" : "Belum ada supplier"}>
            Tambahkan pemasok sebelum mencatat pembelian.
          </EmptyRow>
        )}
        {rows?.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-semibold">{s.nama}</TableCell>
            <TableCell className="whitespace-normal text-muted-foreground">{s.alamat}</TableCell>
            <TableCell className="font-mono">{s.telp}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-0.5">
                <Link href={`/supplier/${s.id}`} aria-label="Edit supplier" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground" })}>
                  <PencilIcon />
                </Link>
                <DeleteButton action={hapusSupplier.bind(null, s.id)} what="supplier" label={s.nama} description="akan dihapus. Tindakan ini tidak bisa dibatalkan." />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableCard>
    </>
  )
}

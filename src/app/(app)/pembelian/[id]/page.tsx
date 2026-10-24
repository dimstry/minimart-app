import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckIcon, PackageIcon, PlusIcon } from "lucide-react"
import { createClient, requireRole } from "@/lib/supabase"
import { rupiah, waktu } from "@/lib/utils"
import { EmptyRow, PageHeader, TableCard, type Item } from "@/components/blocks"
import { ActionForm, DeleteButton, Field, SelectField, SubmitButton } from "@/components/form"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import { hapusBeli, hapusPembelian, tambahBeli } from "../actions"

export const metadata: Metadata = { title: "Pembelian" }

export default async function PembelianDetailPage({ params }: PageProps<"/pembelian/[id]">) {
  await requireRole("gudang")
  const { id } = await params
  const supabase = await createClient()
  const [{ data: pembelian }, { data: items }, { data: barang }] = await Promise.all([
    supabase
      .from("pembelian")
      .select("id, kode, waktu, supplier(nama)")
      .eq("id", id)
      .maybeSingle()
      .overrideTypes<{ id: number; kode: string; waktu: string; supplier: { nama: string } }, { merge: false }>(),
    supabase.from("beli_barang").select("id, qty, harga, barang(barcode, nama)").eq("pembelian_id", id).order("id").overrideTypes<Item[], { merge: false }>(),
    supabase.from("barang").select("id, barcode, nama").order("nama"),
  ])
  if (!pembelian) notFound()
  const rows = items ?? []
  const total = rows.reduce((s, i) => s + i.qty * i.harga, 0)

  return (
    <>
      <PageHeader title="Detail pembelian" description="Tambahkan barang yang diterima. Stok langsung bertambah setiap item ditambahkan." back="/pembelian" />
      <Card className="grid gap-0 py-0 sm:grid-cols-3">
        {[
          ["Kode", <span key="k" className="font-mono">{pembelian.kode}</span>],
          ["Supplier", pembelian.supplier?.nama],
          ["Waktu", <span key="w" className="font-mono">{waktu(pembelian.waktu)}</span>],
        ].map(([label, value], i) => (
          <div key={i} className="grid gap-1 border-b px-5 py-4 last:border-0 sm:border-r sm:border-b-0">
            <span className="text-[13px] text-muted-foreground">{label}</span>
            <strong className="text-base">{value}</strong>
          </div>
        ))}
      </Card>
      <ActionForm action={tambahBeli.bind(null, pembelian.id)} resetOnSuccess>
        <Card size="sm" className="flex-row flex-wrap items-end gap-3 px-5">
          <SelectField label="Barang" name="barang_id" required defaultValue="" className="min-w-0 flex-[999_1_300px]">
            <option value="" disabled>
              Pilih barang
            </option>
            {barang?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nama} · {b.barcode}
              </option>
            ))}
          </SelectField>
          <Field label="Harga beli" name="harga" prefix="Rp" type="number" min={0} required className="flex-[1_1_170px]" />
          <Field label="Jumlah" name="qty" type="number" min={1} required className="flex-[0_1_110px] [&_input]:text-center [&_input]:font-mono" />
          <SubmitButton variant="secondary" className="h-11">
            <PlusIcon /> Tambah item
          </SubmitButton>
        </Card>
      </ActionForm>
      <TableCard
        toolbar={
          <>
            <h2 className="text-base font-bold">Item pembelian</h2>
            <span className="text-[13px] text-muted-foreground">{rows.length} item</span>
          </>
        }
        head={
          <>
            <TableHead className="w-12">No</TableHead>
            <TableHead>Barang</TableHead>
            <TableHead className="text-right">Harga beli</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
            <TableHead className="w-14" />
          </>
        }
        note={
          <div className="-mx-5 -my-3 flex flex-wrap items-center justify-between gap-4 bg-muted p-5 text-foreground">
            <div className="grid gap-0.5">
              <span className="text-[13px] font-semibold text-muted-foreground">Total pembelian</span>
              <strong className="font-mono text-[30px] font-bold tracking-tight">{rupiah(total)}</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              <DeleteButton
                action={hapusPembelian.bind(null, pembelian.id)}
                what="pembelian"
                label={pembelian.kode}
                description="beserta semua itemnya akan dihapus dan stok dikembalikan."
                trigger={
                  <Button variant="outline" size="lg" className="text-destructive hover:text-destructive">
                    Batalkan
                  </Button>
                }
              />
              <Link href="/pembelian" className={buttonVariants({ size: "lg" })}>
                <CheckIcon /> Selesai
              </Link>
            </div>
          </div>
        }
      >
        {rows.length === 0 && (
          <EmptyRow cols={6} icon={PackageIcon} title="Belum ada item">
            Pilih barang, isi harga beli dan jumlah, lalu klik Tambah item.
          </EmptyRow>
        )}
        {rows.map((r, i) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-muted-foreground">{i + 1}</TableCell>
            <TableCell>
              <span className="grid gap-0.5">
                <span className="font-semibold">{r.barang?.nama}</span>
                <span className="font-mono text-xs text-muted-foreground">{r.barang?.barcode}</span>
              </span>
            </TableCell>
            <TableCell className="text-right font-mono">{rupiah(r.harga)}</TableCell>
            <TableCell className="text-right font-mono font-semibold">{r.qty}</TableCell>
            <TableCell className="text-right font-mono font-bold">{rupiah(r.qty * r.harga)}</TableCell>
            <TableCell className="text-right">
              <DeleteButton action={hapusBeli.bind(null, r.id)} what="item" label={r.barang?.nama} description="akan dihapus dan stoknya dikurangi lagi." />
            </TableCell>
          </TableRow>
        ))}
      </TableCard>
    </>
  )
}

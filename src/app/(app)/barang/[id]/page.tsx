import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { InfoIcon, TagIcon } from "lucide-react"
import { createClient, requireRole } from "@/lib/supabase"
import { BarcodeField } from "@/components/barcode"
import { FormCard, PageHeader } from "@/components/blocks"
import { ActionForm, Field, SubmitButton } from "@/components/form"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { simpanBarang } from "../actions"

export const metadata: Metadata = { title: "Barang" }

// /barang/baru untuk tambah, /barang/<id> untuk edit.
export default async function BarangFormPage({ params }: PageProps<"/barang/[id]">) {
  await requireRole("gudang")
  const { id } = await params
  const baru = id === "baru"
  const supabase = await createClient()
  const { data: barang } = baru ? { data: null } : await supabase.from("barang").select().eq("id", id).maybeSingle()
  if (!baru && !barang) notFound()

  return (
    <div className="flex max-w-[1040px] flex-col gap-6">
      <PageHeader
        title={baru ? "Tambah barang" : "Edit barang"}
        description={baru ? "Daftarkan barang baru ke katalog." : "Perbarui data dan harga jual barang."}
        back="/barang"
      />
      <div className="flex flex-wrap items-start gap-6">
        <ActionForm action={simpanBarang.bind(null, barang?.id ?? null)} className="min-w-0 flex-[999_1_460px]">
          <FormCard
            title="Data barang"
            description="Semua kolom wajib diisi."
            footer={
              <>
                <Link href="/barang" className={buttonVariants({ variant: "outline" })}>
                  Batal
                </Link>
                <SubmitButton pendingLabel="Menyimpan…">{baru ? "Simpan barang" : "Simpan perubahan"}</SubmitButton>
              </>
            }
          >
            <BarcodeField defaultValue={barang?.barcode} />
            <Field label="Nama barang" name="nama" defaultValue={barang?.nama} placeholder="Mis. Indomie Goreng 85 g" hint="Sertakan ukuran atau isi supaya kasir tidak salah pilih." required />
            <Field label="Harga jual" name="harga" prefix="Rp" type="number" min={0} defaultValue={barang?.harga} className="max-w-70" required />
          </FormCard>
        </ActionForm>
        <Card size="sm" className="min-w-0 flex-[1_1_260px] gap-3 px-5">
          <span className="grid size-9 place-items-center rounded-[10px] bg-secondary">
            <InfoIcon className="size-[18px]" />
          </span>
          <h3 className="text-[15px] font-bold">Stok tidak diisi di sini</h3>
          <p className="leading-relaxed text-muted-foreground">Stok bertambah otomatis dari pembelian dan berkurang dari penjualan di kasir.</p>
          {barang && (
            <div className="flex justify-between border-t pt-3">
              <span className="text-muted-foreground">Stok saat ini</span>
              <strong className="font-mono">{barang.stok}</strong>
            </div>
          )}
          {barang && (
            <Link href={`/barang/label?id=${barang.id}`} className={buttonVariants({ variant: "outline" })}>
              <TagIcon /> Cetak label barcode
            </Link>
          )}
        </Card>
      </div>
    </div>
  )
}

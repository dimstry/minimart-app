import type { Metadata } from "next"
import { createClient, requireRole } from "@/lib/supabase"
import { LabelSheet } from "@/components/barcode"
import { PageHeader } from "@/components/blocks"

export const metadata: Metadata = { title: "Cetak label" }

export default async function LabelPage({ searchParams }: PageProps<"/barang/label">) {
  await requireRole("gudang")
  const { id } = (await searchParams) as { id?: string }
  const supabase = await createClient()
  const { data: barang } = await supabase.from("barang").select("id, barcode, nama, harga").order("nama")

  return (
    <>
      <div className="print:hidden">
        <PageHeader title="Cetak label barcode" description="Tentukan jumlah label per barang, lalu cetak dan tempel di kemasan atau rak." back="/barang" />
      </div>
      <LabelSheet barang={barang ?? []} awal={id ? Number(id) : undefined} />
    </>
  )
}

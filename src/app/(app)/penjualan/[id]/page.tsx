import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient, requireRole } from "@/lib/supabase"
import { tanggalPanjang, jam } from "@/lib/utils"
import { PageHeader, type Item } from "@/components/blocks"
import { Kasir } from "./kasir"

export const metadata: Metadata = { title: "Kasir" }

export default async function KasirPage({ params }: PageProps<"/penjualan/[id]">) {
  const profile = await requireRole("kasir")
  const { id } = await params
  const supabase = await createClient()
  const [{ data: penjualan }, { data: items }, { data: katalog }] = await Promise.all([
    supabase.from("penjualan").select("id, kode, waktu").eq("id", id).maybeSingle(),
    supabase.from("jual_barang").select("id, qty, harga, barang(barcode, nama)").eq("penjualan_id", id).order("id").overrideTypes<Item[], { merge: false }>(),
    supabase.from("barang").select("barcode, nama, harga, stok").order("nama"),
  ])
  if (!penjualan) notFound()

  return (
    <>
      <PageHeader title="Layar kasir" description={`${tanggalPanjang(penjualan.waktu)} · ${jam(penjualan.waktu)}`}>
        <span className="inline-flex h-8 items-center rounded-full bg-muted px-3 font-mono text-[13px] font-semibold">{penjualan.kode}</span>
      </PageHeader>
      <Kasir id={penjualan.id} kode={penjualan.kode} kasir={profile.nama} items={items ?? []} katalog={katalog ?? []} />
    </>
  )
}

import type { Metadata } from "next"
import { createClient, requireRole } from "@/lib/supabase"
import { rupiah, tanggalPanjang } from "@/lib/utils"
import { MENIPIS, PageHeader, PrintSheet } from "@/components/blocks"
import { PrintButton } from "@/components/form"

export const metadata: Metadata = { title: "Laporan stok" }

export default async function StokPage() {
  const profile = await requireRole("gudang", "pemilik")
  const supabase = await createClient()
  const { data: rows } = await supabase.from("barang").select().order("nama")

  return (
    <>
      <PageHeader title="Laporan stok" description="Stok semua barang saat ini, siap dicetak." back={profile.role === "gudang" ? "/barang" : "/beranda"}>
        <PrintButton />
      </PageHeader>
      <PrintSheet
        judul="Laporan stok barang"
        periode={`Per ${tanggalPanjang(undefined, false)}`}
        jabatan={profile.role === "gudang" ? "Bagian Gudang" : "Pemilik"}
        nama={profile.nama}
        catatan={`Keterangan: Habis = stok 0, Menipis = stok ${MENIPIS} atau kurang.`}
        head={
          <>
            <th className="w-11">No</th>
            <th>Barcode</th>
            <th>Nama barang</th>
            <th className="text-right!">Harga</th>
            <th className="text-right!">Stok</th>
            <th>Ket.</th>
          </>
        }
      >
        <tbody>
          {rows?.map((b, i) => (
            <tr key={b.id}>
              <td className="font-mono text-[#4a4a52]">{i + 1}</td>
              <td className="font-mono text-[13.5px]">{b.barcode}</td>
              <td>{b.nama}</td>
              <td className="text-right font-mono">{rupiah(b.harga).replace("Rp ", "")}</td>
              <td className="text-right font-mono font-bold">{b.stok}</td>
              <td className="font-semibold">{b.stok === 0 ? "Habis" : b.stok <= MENIPIS ? "Menipis" : ""}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>TOTAL STOK ({rows?.length ?? 0} jenis barang)</td>
            <td className="text-right font-mono">{rows?.reduce((s, b) => s + b.stok, 0) ?? 0}</td>
            <td />
          </tr>
        </tfoot>
      </PrintSheet>
    </>
  )
}

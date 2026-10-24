import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createClient, requireRole } from "@/lib/supabase"
import { hariIni, rupiah, tanggal, tanggalPanjang } from "@/lib/utils"
import { PageHeader, PrintSheet, Segmented, TransaksiTable } from "@/components/blocks"
import { PrintButton } from "@/components/form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = { title: "Laporan" }

const JENIS = {
  penjualan: { label: "Penjualan", view: "penjualan_list", namaLabel: "Kasir" },
  pembelian: { label: "Pembelian", view: "pembelian_list", namaLabel: "Supplier" },
}

export default async function LaporanPage({ params, searchParams }: PageProps<"/laporan/[jenis]">) {
  const profile = await requireRole("pemilik")
  const key = (await params).jenis as keyof typeof JENIS
  const jenis = JENIS[key]
  if (!jenis) notFound()
  const { dari = hariIni(), sampai = hariIni() } = (await searchParams) as { dari?: string; sampai?: string }

  const supabase = await createClient()
  const { data } = await supabase.from(jenis.view).select().gte("tanggal", dari).lte("tanggal", sampai).order("waktu")
  const rows = data ?? []
  const total = rows.reduce((s, r) => s + r.total, 0)
  const periode = dari === sampai ? tanggalPanjang(dari, false) : `${tanggalPanjang(dari, false)} – ${tanggalPanjang(sampai, false)}`

  return (
    <>
      <div className="flex flex-col gap-5 print:hidden">
        <PageHeader title="Laporan pembelian & penjualan" description="Rekap transaksi pada rentang tanggal tertentu.">
          <PrintButton />
        </PageHeader>
        <Card size="sm" className="flex-row flex-wrap items-end gap-4 px-5">
          <Segmented
            items={Object.entries(JENIS).map(([k, v]) => ({
              href: `/laporan/${k}?${new URLSearchParams({ dari, sampai })}`,
              label: v.label,
              active: k === key,
            }))}
          />
          <form className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="dari" className="text-[13px] font-semibold">
                Dari
              </Label>
              <Input id="dari" type="date" name="dari" defaultValue={dari} required className="h-10 w-44 font-mono text-sm md:text-sm" />
            </div>
            <span className="flex h-10 items-center text-muted-foreground">–</span>
            <div className="grid gap-1.5">
              <Label htmlFor="sampai" className="text-[13px] font-semibold">
                Sampai
              </Label>
              <Input id="sampai" type="date" name="sampai" defaultValue={sampai} required className="h-10 w-44 font-mono text-sm md:text-sm" />
            </div>
            <Button type="submit">Tampilkan</Button>
          </form>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card size="sm" className="gap-1.5 px-5">
            <span className="text-[13px] font-semibold text-muted-foreground">Jumlah transaksi</span>
            <strong className="font-mono text-[26px]">{rows.length}</strong>
          </Card>
          <Card size="sm" className="gap-1.5 px-5">
            <span className="text-[13px] font-semibold text-muted-foreground">Total {jenis.label.toLowerCase()}</span>
            <strong className="font-mono text-[26px]">{rupiah(total)}</strong>
          </Card>
        </div>
        {rows.length >= 1000 && (
          <p className="rounded-[20px] bg-warning-soft px-4 py-3 text-sm text-warning-soft-foreground">
            Hanya 1.000 transaksi pertama yang tampil (batas API Supabase). Persempit rentang tanggal supaya totalnya lengkap.
          </p>
        )}
        <TransaksiTable rows={rows} namaLabel={jenis.namaLabel} empty={<>Tidak ada {jenis.label.toLowerCase()} pada {periode}.</>} />
      </div>

      <div className="hidden print:block">
        <PrintSheet
          judul={`Laporan ${jenis.label}`}
          periode={`Periode ${periode}`}
          jabatan="Pemilik"
          nama={profile.nama}
          head={
            <>
              <th className="w-11">No</th>
              <th>Kode</th>
              <th>Tanggal</th>
              <th>{jenis.namaLabel}</th>
              <th className="text-right!">Total (Rp)</th>
            </>
          }
        >
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                <td className="font-mono text-[#4a4a52]">{i + 1}</td>
                <td className="font-mono text-sm">{r.kode}</td>
                <td className="font-mono text-sm">{tanggal(r.waktu)}</td>
                <td>{r.nama}</td>
                <td className="text-right font-mono">{rupiah(r.total).replace("Rp ", "")}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>TOTAL ({rows.length} transaksi)</td>
              <td className="text-right font-mono">{rupiah(total).replace("Rp ", "")}</td>
            </tr>
          </tfoot>
        </PrintSheet>
      </div>
    </>
  )
}

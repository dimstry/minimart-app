"use client"

import { useEffect, useRef, useState } from "react"
import JsBarcode from "jsbarcode"
import { PrinterIcon, WandSparklesIcon } from "lucide-react"
import { barcodeBaru, cn, isEan13, rupiah } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Gambar barcode (SVG). EAN-13 kalau angkanya valid, selain itu Code 128 (bisa huruf).
export function Barcode({ value, className, height = 48 }: { value: string; className?: string; height?: number }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (!ref.current || !value) return
    try {
      JsBarcode(ref.current, value, {
        format: isEan13(value) ? "EAN13" : "CODE128",
        height,
        margin: 0,
        fontSize: 14,
        font: "JetBrains Mono, monospace",
        background: "transparent",
      })
    } catch {
      ref.current.innerHTML = ""
    }
  }, [value, height])
  return <svg ref={ref} className={cn("max-w-full", className)} />
}

// Isian barcode di form barang: ketik/scan manual, atau buat nomor internal toko otomatis.
export function BarcodeField({ defaultValue = "" }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <div className="grid gap-2">
      <Label htmlFor="barcode" className="font-semibold">
        Barcode
      </Label>
      <div className="flex gap-2">
        <Input id="barcode" name="barcode" value={value} onChange={(e) => setValue(e.target.value.trim())} className="font-mono" required autoFocus />
        <Button type="button" variant="outline" className="h-11 shrink-0" onClick={() => setValue(barcodeBaru())}>
          <WandSparklesIcon /> Buat otomatis
        </Button>
      </div>
      <span className="text-[13px] text-muted-foreground">
        Scan barcode di kemasan atau ketik manual. Barang tanpa barcode? Klik <strong>Buat otomatis</strong>.
      </span>
      {value && (
        <div className="mt-1 w-fit rounded-2xl bg-white p-3 text-[#111113]">
          <Barcode value={value} height={40} />
        </div>
      )}
    </div>
  )
}

type BarangLabel = { id: number; barcode: string; nama: string; harga: number }

// Pilih barang + jumlah label, lalu cetak di A4 (4 kolom, label 48×25 mm, garis putus-putus untuk digunting).
export function LabelSheet({ barang, awal }: { barang: BarangLabel[]; awal?: number }) {
  const [jumlah, setJumlah] = useState<Record<number, number>>(awal ? { [awal]: 1 } : {})
  const [q, setQ] = useState("")
  const ql = q.toLowerCase()
  const tampil = barang.filter((b) => !ql || b.nama.toLowerCase().includes(ql) || b.barcode.includes(ql))
  const label = barang.flatMap((b) => Array.from({ length: jumlah[b.id] ?? 0 }, () => b))

  return (
    <>
      <style>{"@page { size: A4; margin: 8mm }"}</style>
      <div className="flex flex-wrap items-start gap-6 print:block">
        <Card className="min-w-0 flex-[1_1_420px] gap-0 py-0 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama atau barcode…" aria-label="Cari barang" className="h-10 max-w-64 rounded-full text-sm md:text-sm" />
            <Button variant="ghost" size="sm" onClick={() => setJumlah({})} disabled={!label.length}>
              Kosongkan
            </Button>
          </div>
          <ul className="max-h-[560px] overflow-y-auto">
            {tampil.map((b) => (
              <li key={b.id} className="flex items-center gap-3 border-b px-5 py-2.5 last:border-0">
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="truncate text-sm font-semibold">{b.nama}</span>
                  <span className="font-mono text-xs text-muted-foreground">{b.barcode}</span>
                </span>
                <Input
                  type="number"
                  min={0}
                  aria-label={`Jumlah label ${b.nama}`}
                  value={jumlah[b.id] ?? 0}
                  onChange={(e) => setJumlah({ ...jumlah, [b.id]: Math.max(0, Math.min(200, Number(e.target.value) || 0)) })}
                  className="h-9 w-20 text-center font-mono text-sm md:text-sm"
                />
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-3">
          <div className="flex items-center justify-between gap-3 print:hidden">
            <span className="text-sm text-muted-foreground">
              <strong className="font-mono text-foreground">{label.length}</strong> label · A4, 4 kolom
            </span>
            <Button onClick={() => window.print()} disabled={!label.length}>
              <PrinterIcon /> Cetak label
            </Button>
          </div>
          <div className="overflow-x-auto rounded-[28px] bg-white p-6 shadow-card print:overflow-visible print:rounded-none print:p-0 print:shadow-none">
            {label.length === 0 ? (
              <p className="py-20 text-center text-sm text-[#56565e]">Isi jumlah label di daftar barang untuk melihat pratinjau.</p>
            ) : (
              <div className="grid w-[194mm] grid-cols-[repeat(4,48mm)] gap-[0.6mm] text-[#111113]">
                {label.map((b, i) => (
                  <div key={i} className="flex h-[25mm] break-inside-avoid flex-col items-center justify-between overflow-hidden border border-dashed border-[#c9c9d0] px-[2mm] py-[1.5mm]">
                    <span className="w-full truncate text-center text-[8pt] leading-tight font-semibold">{b.nama}</span>
                    <Barcode value={b.barcode} height={26} className="h-auto max-h-[13mm] w-full" />
                    <span className="text-[9pt] leading-none font-extrabold">{rupiah(b.harga)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

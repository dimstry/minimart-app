"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { CheckIcon, MinusIcon, PlusIcon, ScanBarcodeIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react"
import { cn, rupiah } from "@/lib/utils"
import { EmptyState, MENIPIS, type Item } from "@/components/blocks"
import { DeleteButton } from "@/components/form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { batalkanPenjualan, buatPenjualan, hapusJual, selesaiPenjualan, tambahJual } from "../actions"

type Barang = { barcode: string; nama: string; harga: number; stok: number }

const PINTASAN = [
  ["F2", "Fokus barcode"],
  ["F4", "Ubah jumlah"],
  ["↑↓", "Pilih saran"],
  ["Del", "Hapus baris terakhir"],
  ["Esc", "Kosongkan input"],
  ["F12", "Selesai"],
]

function Kbd({ children, className }: { children: string; className?: string }) {
  return (
    <kbd className={cn("inline-flex h-6 min-w-8 items-center justify-center rounded-md border border-b-2 px-1.5 font-mono text-[11px] font-semibold text-foreground", className)}>
      {children}
    </kbd>
  )
}

// Layar kasir: scan/ketik barcode → Enter. Stok dicek di sini untuk pesan yang jelas,
// dan tetap dijaga constraint database kalau dua kasir menjual barang yang sama.
export function Kasir({ id, kode, kasir, items, katalog }: { id: number; kode: string; kasir: string; items: Item[]; katalog: Barang[] }) {
  const [q, setQ] = useState("")
  const [qty, setQty] = useState("1")
  const [sel, setSel] = useState(0)
  const [last, setLast] = useState<string>()
  const [pending, startTransition] = useTransition()
  const barcodeRef = useRef<HTMLInputElement>(null)
  const qtyRef = useRef<HTMLInputElement>(null)

  const ql = q.trim().toLowerCase()
  const matches = ql ? katalog.filter((p) => p.barcode.startsWith(ql) || p.nama.toLowerCase().includes(ql)).slice(0, 5) : []
  const total = items.reduce((s, i) => s + i.qty * i.harga, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  function run(barcode: string, n: number, after?: () => void) {
    const fd = new FormData()
    fd.set("barcode", barcode)
    fd.set("qty", String(n))
    startTransition(async () => {
      const res = await tambahJual(id, fd)
      if (res?.error) return void toast.error(res.error)
      setLast(barcode)
      after?.()
    })
  }

  function add(p: Barang) {
    const n = Math.max(1, parseInt(qty, 10) || 1)
    if (p.stok <= 0) return void toast.error("Stok habis", { description: `${p.nama} tidak bisa dijual.` })
    if (n > p.stok) return void toast.error("Stok tidak cukup", { description: `${p.nama} tinggal ${p.stok} di gudang.` })
    run(p.barcode, n, () => {
      setQ("")
      setQty("1")
      setSel(0)
      barcodeRef.current?.focus()
    })
  }

  function submitScan() {
    const exact = katalog.find((p) => p.barcode === q.trim())
    const p = exact ?? matches[Math.min(sel, matches.length - 1)]
    if (p) add(p)
    else if (ql) toast.error("Barang tidak ditemukan", { description: `Barcode ${q} belum terdaftar.` })
  }

  function ubah(it: Item, delta: number) {
    const stok = katalog.find((p) => p.barcode === it.barang?.barcode)?.stok ?? 0
    if (delta > 0 && stok < delta) return void toast.error("Stok tidak cukup", { description: `${it.barang?.nama} sudah habis di gudang.` })
    if (it.qty + delta < 1) return
    run(it.barang!.barcode, delta)
  }

  function hapus(itemId: number) {
    startTransition(async () => {
      const res = await hapusJual(itemId)
      if (res?.error) toast.error(res.error)
    })
  }

  function selesai() {
    if (!items.length) return void toast.error("Belum ada barang", { description: "Scan minimal satu barang dulu." })
    startTransition(async () => {
      const res = await selesaiPenjualan(id)
      if (res?.error) return void toast.error(res.error)
      toast.success("Transaksi tersimpan", { description: `${kode} · ${rupiah(total)}` })
      await buatPenjualan()
    })
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "F2") barcodeRef.current?.focus()
      else if (e.key === "F4") qtyRef.current?.select()
      else if (e.key === "F12") selesai()
      else return
      e.preventDefault()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  return (
    <div className="flex flex-wrap items-start gap-6">
      <section className="flex min-w-0 flex-[999_1_600px] flex-col gap-4">
        <Card size="sm" className="flex-row flex-wrap items-end gap-4 overflow-visible px-5">
          <div className="relative grid min-w-0 flex-[999_1_340px] gap-2">
            <Label htmlFor="barcode" className="text-[13px] font-semibold">
              Scan atau ketik barcode / nama barang
            </Label>
            <div className="relative">
              <ScanBarcodeIcon className="pointer-events-none absolute top-[19px] left-4.5 size-6.5" />
              <Input
                id="barcode"
                ref={barcodeRef}
                value={q}
                autoFocus
                autoComplete="off"
                spellCheck={false}
                placeholder="Arahkan scanner ke barcode…"
                role="combobox"
                aria-expanded={matches.length > 0}
                aria-controls="saran-barang"
                onChange={(e) => {
                  setQ(e.target.value)
                  setSel(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") setSel(Math.min(sel + 1, matches.length - 1))
                  else if (e.key === "ArrowUp") setSel(Math.max(sel - 1, 0))
                  else if (e.key === "Escape") setQ("")
                  else if (e.key === "Enter") submitScan()
                  else if (e.key === "Delete" && !q && items.length) hapus((items.find((i) => i.barang?.barcode === last) ?? items.at(-1)!).id)
                  else return
                  e.preventDefault()
                }}
                className="h-16 rounded-[20px] border-2 border-primary pr-28 pl-14 font-mono text-2xl font-semibold ring-4 ring-ring md:text-2xl"
              />
              <Kbd className="absolute top-[18px] right-3.5 h-7 bg-muted text-xs text-muted-foreground">Enter ↵</Kbd>
            </div>
            {matches.length > 0 && (
              <div id="saran-barang" role="listbox" aria-label="Saran barang" className="frosted absolute top-full right-0 left-0 z-20 mt-1.5 overflow-hidden rounded-[20px] border bg-popover shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <div className="border-b px-3.5 py-2 text-xs font-semibold text-muted-foreground">{matches.length} barang cocok</div>
                {matches.map((p, i) => (
                  <button
                    key={p.barcode}
                    type="button"
                    role="option"
                    aria-selected={i === sel}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => add(p)}
                    className={cn("flex w-full items-center gap-4 border-b px-3.5 py-3 text-left", i === sel && "bg-secondary", p.stok <= 0 && "opacity-60")}
                  >
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="text-[15px] font-semibold">{p.nama}</span>
                      <span className="font-mono text-xs text-muted-foreground">{p.barcode}</span>
                    </span>
                    <span className="font-mono text-[15px] font-semibold">{rupiah(p.harga)}</span>
                    <Badge variant={p.stok <= 0 ? "destructive" : p.stok <= MENIPIS ? "warning" : "muted"}>{p.stok <= 0 ? "Stok habis" : `Stok ${p.stok}`}</Badge>
                  </button>
                ))}
                <div className="flex flex-wrap gap-3.5 bg-muted px-3.5 py-2 text-xs text-muted-foreground">
                  <span>↑ ↓ pilih</span>
                  <span>Enter tambahkan</span>
                  <span>Esc tutup</span>
                </div>
              </div>
            )}
          </div>
          <div className="grid w-30 gap-2">
            <Label htmlFor="qty" className="text-[13px] font-semibold">
              Jumlah
            </Label>
            <Input
              id="qty"
              ref={qtyRef}
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), barcodeRef.current?.focus())}
              className="h-16 rounded-[20px] text-center font-mono text-2xl font-semibold md:text-2xl"
            />
          </div>
          <Button variant="outline" className="h-16 px-5.5 text-[15px] font-bold" onClick={submitScan} disabled={pending}>
            <PlusIcon /> Tambah
          </Button>
        </Card>

        <Card className="gap-0 py-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
            <h2 className="text-base font-bold">Daftar belanja</h2>
            <span className="text-[13px] text-muted-foreground">
              {items.length} jenis · {count} barang
            </span>
          </div>
          {items.length === 0 ? (
            <EmptyState icon={ShoppingCartIcon} title="Belum ada barang">
              Scan barcode untuk mulai transaksi.
            </EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="border-b text-[13px] text-muted-foreground">
                  <tr className="h-11 [&>th]:px-3 [&>th]:font-semibold">
                    <th className="w-12 pl-5! text-left">No</th>
                    <th className="text-left">Barcode</th>
                    <th className="text-left">Nama barang</th>
                    <th className="text-right">Harga</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Subtotal</th>
                    <th className="w-14" />
                  </tr>
                </thead>
                <tbody aria-busy={pending}>
                  {items.map((it, i) => {
                    const baru = it.barang?.barcode === last
                    return (
                      <tr key={it.id} className={cn("h-14 border-b last:border-0 [&>td]:px-3", baru && "bg-secondary")}>
                        <td className="pl-5! font-mono text-[13px] text-muted-foreground">{i + 1}</td>
                        <td className="font-mono text-[13px] text-muted-foreground">{it.barang?.barcode}</td>
                        <td className="font-semibold">
                          {it.barang?.nama} {baru && <Badge className="ml-1.5 h-5">Baru</Badge>}
                        </td>
                        <td className="text-right font-mono">{rupiah(it.harga)}</td>
                        <td>
                          <span className="mx-auto flex w-fit items-center overflow-hidden rounded-full border border-input bg-card">
                            <Button variant="ghost" size="icon-sm" aria-label="Kurangi jumlah" disabled={pending || it.qty <= 1} onClick={() => ubah(it, -1)}>
                              <MinusIcon />
                            </Button>
                            <span className="min-w-10 text-center font-mono font-bold">{it.qty}</span>
                            <Button variant="ghost" size="icon-sm" aria-label="Tambah jumlah" disabled={pending} onClick={() => ubah(it, 1)}>
                              <PlusIcon />
                            </Button>
                          </span>
                        </td>
                        <td className="text-right font-mono font-bold">{rupiah(it.qty * it.harga)}</td>
                        <td className="pr-5! text-right">
                          <Button variant="ghost" size="icon" aria-label="Hapus barang" className="text-destructive hover:text-destructive" disabled={pending} onClick={() => hapus(it.id)}>
                            <Trash2Icon />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>

      <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4 lg:sticky lg:top-4">
        <Card className="gap-5">
          <div className="flex items-center justify-between gap-2 px-6">
            <span className="text-sm font-semibold text-muted-foreground">Total belanja</span>
            <Badge variant="secondary">{count} barang</Badge>
          </div>
          <div className="px-6 font-mono text-[46px] leading-[1.05] font-bold tracking-tight [overflow-wrap:anywhere]">{rupiah(total)}</div>
          <dl className="mx-6 grid gap-2.5 border-t border-dashed pt-4 text-sm [&>div]:flex [&>div]:justify-between [&>div]:gap-3 [&_dt]:text-muted-foreground [&_dd]:font-semibold">
            <div>
              <dt>Jumlah barang</dt>
              <dd className="font-mono">
                {count} item · {items.length} jenis
              </dd>
            </div>
            <div>
              <dt>Kasir</dt>
              <dd>{kasir}</dd>
            </div>
            <div>
              <dt>Kode</dt>
              <dd className="font-mono">{kode}</dd>
            </div>
          </dl>
          <div className="grid gap-2 px-6">
            <Button className="h-15 text-[17px] font-extrabold" onClick={selesai} disabled={pending}>
              <CheckIcon className="size-5" /> Selesai
              <Kbd className="border-0 bg-white/20 text-current dark:bg-black/10">F12</Kbd>
            </Button>
            <DeleteButton
              action={batalkanPenjualan.bind(null, id)}
              what="transaksi"
              label={kode}
              description="akan dibatalkan dan semua barangnya dikembalikan ke stok."
              trigger={
                <Button variant="outline" className="h-11 text-destructive hover:text-destructive">
                  Batalkan transaksi
                </Button>
              }
            />
          </div>
        </Card>
        <Card size="sm" className="gap-3 px-5">
          <h3 className="text-sm font-bold">Pintasan keyboard</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px] text-muted-foreground">
            {PINTASAN.map(([k, label]) => (
              <span key={k} className="flex items-center gap-2">
                <Kbd>{k}</Kbd>
                {label}
              </span>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  )
}

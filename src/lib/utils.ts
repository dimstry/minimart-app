import type { Role } from "@/lib/supabase"

export { cn } from "cn"

export const TOKO = { nama: "mutherhelp", kota: "Subang" }

export const ROLE_LABEL: Record<Role, string> = { pemilik: "Pemilik", gudang: "Gudang", kasir: "Kasir" }

export const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID")

const fmt = (iso: string | Date, opt: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", ...opt })

export const jam = (iso: string) => fmt(iso, { timeStyle: "short" })
export const tanggal = (iso: string) => fmt(iso, { day: "2-digit", month: "2-digit", year: "numeric" })
export const waktu = (iso: string) => `${tanggal(iso)} · ${jam(iso)}`
// "Sabtu, 24 Oktober 2026", atau "24 Oktober 2026" tanpa nama hari.
export const tanggalPanjang = (d: string | Date = new Date(), hari = true) => fmt(d, { dateStyle: hari ? "full" : "long" })

export const inisial = (nama: string) =>
  nama.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase()

// Tanggal hari ini (YYYY-MM-DD) di zona toko.
export const hariIni = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })

// Pola ilike untuk filter .or() PostgREST; buang karakter yang bisa mengubah sintaks filter.
export const cari = (q: string) => `%${q.replace(/[,()%*\\]/g, "")}%`

// Password awal/reset: 8 karakter mudah dibaca, mis. "kSx7-29qa" (tanpa 0/O/1/l/I).
export function passwordAcak() {
  const abc = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const r = crypto.getRandomValues(new Uint32Array(8))
  const s = Array.from(r, (n) => abc[n % abc.length]).join("")
  return `${s.slice(0, 4)}-${s.slice(4)}`
}

// EAN-13: 12 digit + 1 digit cek (bobot 1,3,1,3,… dari kiri).
export const ean13 = (base12: string) =>
  base12 + ((10 - ([...base12].reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0) % 10)) % 10)

export const isEan13 = (v: string) => /^\d{13}$/.test(v) && ean13(v.slice(0, 12)) === v

// Barcode internal toko: awalan "2" memang disediakan GS1 untuk pemakaian di dalam toko.
// ponytail: acak 11 digit, tabrakan dicegah constraint unique (peluangnya ~1 banding 10^11).
export const barcodeBaru = () => ean13("2" + Array.from(crypto.getRandomValues(new Uint8Array(11)), (n) => n % 10).join(""))

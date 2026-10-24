import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { APP } from "@/lib/utils"
import { LogoMark } from "@/components/logo"

export const alt = `${APP}: aplikasi kasir & stok minimarket berbasis web`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const font = (w: number) => readFile(join(process.cwd(), `node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-${w}-normal.woff`))

// Gambar pratinjau saat link dibagikan (WhatsApp, LinkedIn, X, dll.), gaya sama dengan landing page.
export default async function OgImage() {
  const tile = (n: string, label: string, bg: string) => (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 2, padding: "18px 20px", borderRadius: 24, background: bg, color: "#111113" }}>
      <span style={{ fontSize: 40, fontWeight: 800 }}>{n}</span>
      <span style={{ fontSize: 18 }}>{label}</span>
    </div>
  )
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 64,
          gap: 56,
          alignItems: "center",
          color: "#111113",
          fontFamily: "Jakarta",
          background: "radial-gradient(900px 600px at 0% 0%, #ffffff, #e4e4e7 60%, #cfcfd3)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1.15, gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <LogoMark size={52} />
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>{APP}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 64, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2.5 }}>
            <span>Kasir cepat.</span>
            <span>Stok selalu ketahuan.</span>
          </div>
          <span style={{ fontSize: 24, color: "#56565e", lineHeight: 1.4 }}>Aplikasi kasir &amp; stok minimarket: scan barcode, catat pembelian, cetak laporan.</span>
          <div style={{ display: "flex" }}>
            <span style={{ display: "flex", padding: "14px 26px", borderRadius: 999, background: "#18181b", color: "#fff", fontSize: 22, fontWeight: 800 }}>Coba demo gratis →</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 22, padding: 36, borderRadius: 40, background: "#18181b", color: "#f4f4f6", boxShadow: "0 30px 60px rgba(17,17,19,.25)" }}>
          <span style={{ fontSize: 26, fontWeight: 800 }}>Ringkasan hari ini</span>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
            <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>Rp 562.000</span>
            <span style={{ fontSize: 20, color: "#a9a9b2", paddingBottom: 10 }}>8 transaksi</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {tile("38", "Barang", "#c4c4c9")}
            {tile("3", "Menipis", "#ffffff")}
            {tile("2", "Habis", "#ffffff")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: await font(500), weight: 500 },
        { name: "Jakarta", data: await font(800), weight: 800 },
      ],
    },
  )
}

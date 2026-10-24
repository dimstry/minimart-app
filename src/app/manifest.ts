import type { MetadataRoute } from "next"
import { APP } from "@/lib/utils"

// Supaya bisa "Tambahkan ke layar utama" di HP/tablet kasir dan tampil seperti aplikasi.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP} · Kasir & Stok`,
    short_name: APP,
    description: "Aplikasi kasir & stok minimarket berbasis web.",
    start_url: "/beranda",
    display: "standalone",
    background_color: "#dedee1",
    theme_color: "#18181b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  }
}

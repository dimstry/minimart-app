import type { MetadataRoute } from "next"
import { SITE } from "@/lib/utils"

// Yang boleh diindeks hanya landing & login; sisanya di balik login.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: ["/", "/login"], disallow: ["/beranda", "/barang", "/supplier", "/pembelian", "/penjualan", "/pengguna", "/laporan"] },
    sitemap: `${SITE}/sitemap.xml`,
  }
}

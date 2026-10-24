import type { Metadata, Viewport } from "next"
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { APP, SITE } from "@/lib/utils"
import "./globals.css"

const sans = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"] })
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] })

const description =
  "Aplikasi kasir & stok minimarket berbasis web: scan barcode di kasir, stok otomatis dari pembelian & penjualan, laporan siap cetak, dan akses per peran. Coba demonya gratis tanpa daftar."

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${APP} · Aplikasi Kasir & Stok Minimarket`, template: `%s · ${APP}` },
  description,
  applicationName: APP,
  keywords: ["aplikasi kasir", "point of sale", "POS", "stok barang", "minimarket", "toko kelontong", "barcode", "laporan penjualan", "Next.js", "Supabase"],
  authors: [{ name: "Dimas Triana", url: "https://dims-dev.vercel.app" }],
  creator: "Dimas Triana",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "id_ID", siteName: APP, title: `${APP} · Aplikasi Kasir & Stok Minimarket`, description, url: "/" },
  twitter: { card: "summary_large_image", title: `${APP} · Aplikasi Kasir & Stok Minimarket`, description },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dedee1" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}

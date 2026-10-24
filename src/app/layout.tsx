import type { Metadata } from "next"
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const sans = Plus_Jakarta_Sans({ variable: "--font-sans", subsets: ["latin"] })
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "mutherhelp", template: "%s · mutherhelp" },
  description: "Aplikasi kasir & stok minimart",
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

import Link from "next/link"
import { ScanBarcodeIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <ScanBarcodeIcon className="size-14 text-muted-foreground" />
      <div className="font-mono text-8xl leading-none font-bold tracking-tighter">404</div>
      <div className="grid max-w-[440px] gap-2">
        <h1 className="text-2xl font-extrabold">Halaman tidak ditemukan</h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Seperti barcode yang tidak terdaftar, alamat ini tidak ada di sistem. Mungkin tautannya salah atau datanya sudah dihapus.
        </p>
      </div>
      <Link href="/beranda" className={buttonVariants({ size: "lg" })}>
        Kembali ke beranda
      </Link>
    </main>
  )
}

import type { Metadata } from "next"
import { ScanBarcodeIcon, StoreIcon } from "lucide-react"
import { DEMO, DEMO_AKUN, type Role } from "@/lib/supabase"
import { ROLE_LABEL, TOKO } from "@/lib/utils"
import { ThemeToggle } from "@/components/app-sidebar"
import { ActionForm, Field, PasswordField, SubmitButton } from "@/components/form"
import { Card } from "@/components/ui/card"
import { login, masukDemo } from "../actions"

export const metadata: Metadata = { title: "Masuk" }

export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-wrap">
      <section className="hero relative m-3 flex min-h-70 flex-[1_1_480px] flex-col justify-between gap-8 overflow-hidden rounded-[32px] p-8 sm:m-5 sm:p-12">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-(--hero-tile-strong) text-(--hero-tile-strong-fg)">
            <StoreIcon className="size-5" />
          </span>
          <span className="grid">
            <strong className="text-xl font-extrabold">{TOKO.nama}</strong>
            <span className="text-[13px] text-(--hero-muted)">Minimart · {TOKO.kota}</span>
          </span>
        </div>
        <div className="grid max-w-[460px] gap-4">
          <ScanBarcodeIcon className="size-10" />
          <h2 className="text-4xl leading-tight font-extrabold tracking-tight">Kasir dan stok toko, dalam satu tempat.</h2>
          <p className="text-base leading-relaxed text-(--hero-muted)">
            Scan barang di kasir, catat pembelian dari supplier, dan cetak laporan harian tanpa pindah aplikasi.
          </p>
        </div>
        <span className="text-[13px] text-(--hero-muted)">© {new Date().getFullYear()} {TOKO.nama}</span>
      </section>
      <section className="relative flex flex-[1_1_480px] flex-col items-center justify-center px-6 py-12">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-[400px] rounded-[28px] p-8">
          <div className="grid gap-1.5">
            <h1 className="text-2xl font-extrabold tracking-tight">Masuk</h1>
            <p className="text-sm text-muted-foreground">Gunakan akun yang diberikan pemilik toko.</p>
          </div>
          <ActionForm action={login} inlineError className="grid gap-5">
            <Field label="Username" name="username" autoComplete="username" required autoFocus />
            <PasswordField label="Password" name="password" autoComplete="current-password" required />
            <SubmitButton size="lg" pendingLabel="Masuk…">
              Masuk
            </SubmitButton>
            <p className="text-center text-[13px] text-muted-foreground">Lupa password? Minta pemilik toko untuk meresetnya.</p>
          </ActionForm>
        </Card>
        {DEMO && (
          <Card id="demo" className="mt-4 w-full max-w-[400px] gap-3 rounded-[28px] p-6">
            <div className="grid gap-1">
              <h2 className="text-base font-bold">Coba tanpa akun</h2>
              <p className="text-[13px] text-muted-foreground">Masuk ke akun demo. Datanya dibuat ulang setiap malam, jadi bebas dicoba.</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(DEMO_AKUN) as Role[]).map((role) => (
                <ActionForm key={role} action={masukDemo.bind(null, role)} className="grid">
                  <SubmitButton variant="outline" pendingLabel="…">
                    {ROLE_LABEL[role]}
                  </SubmitButton>
                </ActionForm>
              ))}
            </div>
          </Card>
        )}
      </section>
    </main>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient, requireRole, type Profile } from "@/lib/supabase"
import { passwordAcak, ROLE_LABEL } from "@/lib/utils"
import { FormCard, PageHeader } from "@/components/blocks"
import { ActionForm, Field, SubmitButton } from "@/components/form"
import { buttonVariants } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { resetPassword, simpanPengguna } from "../actions"
import { PasswordAwal, ResetPassword } from "./password"

export const metadata: Metadata = { title: "Pengguna" }

const PERAN_DESC = {
  pemilik: "Semua laporan & kelola akun.",
  gudang: "Barang, supplier, pembelian, laporan stok.",
  kasir: "Layar kasir & daftar penjualan.",
}

// /pengguna/baru untuk tambah, /pengguna/<uuid> untuk edit + reset password.
export default async function PenggunaFormPage({ params }: PageProps<"/pengguna/[id]">) {
  await requireRole("pemilik")
  const { id } = await params
  const baru = id === "baru"
  const supabase = await createClient()
  const { data: user } = baru ? { data: null } : await supabase.from("profiles").select().eq("id", id).maybeSingle<Profile>()
  if (!baru && !user) notFound()

  return (
    <div className="flex max-w-[1120px] flex-col gap-6">
      <PageHeader
        title={baru ? "Tambah pengguna" : "Edit pengguna"}
        description={baru ? "Buat akun baru untuk karyawan toko." : "Ubah data, peran, atau status akun."}
        back="/pengguna"
      />
      <div className="flex flex-wrap items-start gap-6">
        <ActionForm action={simpanPengguna.bind(null, user?.id ?? null)} className="min-w-0 flex-[999_1_480px]">
          <FormCard
            title="Data pengguna"
            description="Username dipakai untuk masuk dan tidak bisa sama."
            footer={
              <>
                <Link href="/pengguna" className={buttonVariants({ variant: "outline" })}>
                  Batal
                </Link>
                <SubmitButton pendingLabel="Menyimpan…">{baru ? "Simpan pengguna" : "Simpan perubahan"}</SubmitButton>
              </>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Username" name="username" className="[&_input]:font-mono" defaultValue={user?.username} pattern="[a-zA-Z0-9._\-]+" required autoFocus />
              <Field label="Nama lengkap" name="nama" defaultValue={user?.nama} required />
            </div>
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-semibold">Peran</legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {Object.entries(ROLE_LABEL).map(([value, label]) => (
                  <label
                    key={value}
                    className="grid cursor-pointer gap-1.5 rounded-[20px] border border-input p-3.5 has-checked:border-primary has-checked:bg-secondary has-focus-visible:ring-4 has-focus-visible:ring-ring"
                  >
                    <span className="flex items-center gap-2">
                      <input type="radio" name="role" value={value} defaultChecked={(user?.role ?? "kasir") === value} className="size-4 accent-primary" />
                      <strong className="text-sm">{label}</strong>
                    </span>
                    <span className="text-[13px] leading-snug text-muted-foreground">{PERAN_DESC[value as keyof typeof PERAN_DESC]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {baru ? (
              <PasswordAwal awal={passwordAcak()} />
            ) : (
              <label className="flex items-center justify-between gap-4 rounded-[20px] border p-4">
                <span className="grid gap-0.5">
                  <strong className="text-sm">Status aktif</strong>
                  <span className="text-[13px] text-muted-foreground">Pengguna tidak aktif tidak bisa masuk, tapi riwayat transaksinya tetap tersimpan.</span>
                </span>
                <Switch name="aktif" defaultChecked={user?.aktif} />
              </label>
            )}
          </FormCard>
        </ActionForm>
        {user && <ResetPassword nama={user.nama} action={resetPassword.bind(null, user.id)} />}
      </div>
    </div>
  )
}

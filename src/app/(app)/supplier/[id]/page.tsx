import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient, requireRole } from "@/lib/supabase"
import { FormCard, PageHeader } from "@/components/blocks"
import { ActionForm, Field, SubmitButton, TextareaField } from "@/components/form"
import { buttonVariants } from "@/components/ui/button"
import { simpanSupplier } from "../actions"

export const metadata: Metadata = { title: "Supplier" }

// /supplier/baru untuk tambah, /supplier/<id> untuk edit.
export default async function SupplierFormPage({ params }: PageProps<"/supplier/[id]">) {
  await requireRole("gudang")
  const { id } = await params
  const baru = id === "baru"
  const supabase = await createClient()
  const { data: supplier } = baru ? { data: null } : await supabase.from("supplier").select().eq("id", id).maybeSingle()
  if (!baru && !supplier) notFound()

  return (
    <div className="flex max-w-[760px] flex-col gap-6">
      <PageHeader
        title={baru ? "Tambah supplier" : "Edit supplier"}
        description={baru ? "Daftarkan pemasok baru." : "Perbarui data kontak pemasok."}
        back="/supplier"
      />
      <ActionForm action={simpanSupplier.bind(null, supplier?.id ?? null)}>
        <FormCard
          title="Data supplier"
          description="Semua kolom wajib diisi."
          footer={
            <>
              <Link href="/supplier" className={buttonVariants({ variant: "outline" })}>
                Batal
              </Link>
              <SubmitButton pendingLabel="Menyimpan…">{baru ? "Simpan supplier" : "Simpan perubahan"}</SubmitButton>
            </>
          }
        >
          <Field label="Nama supplier" name="nama" defaultValue={supplier?.nama} required autoFocus />
          <TextareaField label="Alamat" name="alamat" defaultValue={supplier?.alamat} required />
          <Field
            label="Telp"
            name="telp"
            type="tel"
            className="max-w-80 [&_input]:font-mono"
            defaultValue={supplier?.telp}
            hint="Nomor HP atau telepon kantor."
            required
          />
        </FormCard>
      </ActionForm>
    </div>
  )
}

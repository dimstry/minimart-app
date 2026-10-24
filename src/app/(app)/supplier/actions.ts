"use server"

import { redirect } from "next/navigation"
import { refresh } from "next/cache"
import { createClient, dbError, requireRole, type ActionResult } from "@/lib/supabase"

export async function simpanSupplier(id: number | null, formData: FormData): Promise<ActionResult> {
  await requireRole("gudang")
  const supplier = {
    nama: String(formData.get("nama")).trim(),
    alamat: String(formData.get("alamat")).trim(),
    telp: String(formData.get("telp")).trim(),
  }
  if (!supplier.nama || !supplier.alamat || !supplier.telp) return { error: "Periksa kembali inputan" }

  const supabase = await createClient()
  const { error } = id
    ? await supabase.from("supplier").update(supplier).eq("id", id)
    : await supabase.from("supplier").insert(supplier)
  if (error) return { error: dbError(error) }
  redirect("/supplier")
}

export async function hapusSupplier(id: number): Promise<ActionResult> {
  await requireRole("gudang")
  const supabase = await createClient()
  const { error } = await supabase.from("supplier").delete().eq("id", id)
  if (error) return { error: dbError(error) }
  refresh()
  return { ok: "Supplier dihapus" }
}

"use server"

import { redirect } from "next/navigation"
import { refresh } from "next/cache"
import { createClient, dbError, requireRole, type ActionResult } from "@/lib/supabase"

export async function simpanBarang(id: number | null, formData: FormData): Promise<ActionResult> {
  await requireRole("gudang")
  const barang = {
    barcode: String(formData.get("barcode")).trim(),
    nama: String(formData.get("nama")).trim(),
    harga: Number(formData.get("harga")),
  }
  if (!barang.barcode || !barang.nama) return { error: "Periksa kembali inputan" }
  if (!Number.isInteger(barang.harga) || barang.harga < 0) return { error: "Harga tidak valid" }

  const supabase = await createClient()
  const { error } = id
    ? await supabase.from("barang").update(barang).eq("id", id)
    : await supabase.from("barang").insert(barang)
  if (error) return { error: error.code === "23505" ? "Barcode ini sudah dipakai barang lain" : dbError(error) }
  redirect("/barang")
}

export async function hapusBarang(id: number): Promise<ActionResult> {
  await requireRole("gudang")
  const supabase = await createClient()
  const { error } = await supabase.from("barang").delete().eq("id", id)
  if (error) return { error: dbError(error) }
  refresh()
  return { ok: "Barang dihapus" }
}

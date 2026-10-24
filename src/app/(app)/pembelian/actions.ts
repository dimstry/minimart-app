"use server"

import { redirect } from "next/navigation"
import { refresh } from "next/cache"
import { createClient, dbError, requireRole, type ActionResult } from "@/lib/supabase"

export async function buatPembelian(formData: FormData): Promise<ActionResult> {
  await requireRole("gudang")
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pembelian")
    .insert({ supplier_id: Number(formData.get("supplier_id")) })
    .select("id")
    .single()
  if (error) return { error: dbError(error) }
  redirect(`/pembelian/${data.id}`)
}

export async function tambahBeli(pembelianId: number, formData: FormData): Promise<ActionResult> {
  await requireRole("gudang")
  const item = {
    pembelian_id: pembelianId,
    barang_id: Number(formData.get("barang_id")),
    harga: Number(formData.get("harga")),
    qty: Number(formData.get("qty")),
  }
  if (!Number.isInteger(item.harga) || item.harga < 0 || !Number.isInteger(item.qty) || item.qty < 1) {
    return { error: "Periksa kembali harga dan jumlah" }
  }
  const supabase = await createClient()
  const { error } = await supabase.from("beli_barang").insert(item)
  if (error) return { error: dbError(error) }
  refresh()
  return null
}

export async function hapusBeli(id: number): Promise<ActionResult> {
  await requireRole("gudang")
  const supabase = await createClient()
  const { error } = await supabase.from("beli_barang").delete().eq("id", id)
  if (error) return { error: dbError(error) }
  refresh()
  return null
}

export async function hapusPembelian(id: number): Promise<ActionResult> {
  await requireRole("gudang")
  const supabase = await createClient()
  const { error } = await supabase.from("pembelian").delete().eq("id", id)
  if (error) return { error: dbError(error) }
  redirect("/pembelian")
}

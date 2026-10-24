"use server"

import { redirect } from "next/navigation"
import { refresh } from "next/cache"
import { createClient, dbError, requireRole, type ActionResult } from "@/lib/supabase"

export async function buatPenjualan(): Promise<ActionResult> {
  await requireRole("kasir")
  const supabase = await createClient()
  const { data, error } = await supabase.from("penjualan").insert({}).select("id").single()
  if (error) return { error: dbError(error) }
  redirect(`/penjualan/${data.id}`)
}

// Scan barcode: harga dan cek stok ditangani fungsi tambah_jual di database.
// qty negatif = kurangi jumlah (tombol −); qty > 0 dijaga constraint tabel.
export async function tambahJual(penjualanId: number, formData: FormData): Promise<ActionResult> {
  await requireRole("kasir")
  const qty = Number(formData.get("qty") || 1)
  if (!Number.isInteger(qty) || qty === 0) return { error: "Jumlah tidak valid" }
  const supabase = await createClient()
  const { error } = await supabase.rpc("tambah_jual", {
    p_penjualan: penjualanId,
    p_barcode: String(formData.get("barcode")).trim(),
    p_qty: qty,
  })
  if (error) return { error: dbError(error) }
  refresh()
  return null
}

export async function hapusJual(id: number): Promise<ActionResult> {
  await requireRole("kasir")
  const supabase = await createClient()
  const { error } = await supabase.from("jual_barang").delete().eq("id", id)
  if (error) return { error: dbError(error) }
  refresh()
  return null
}

// Transaksi tanpa barang tidak perlu disimpan: dihapus lalu kembali ke daftar.
export async function selesaiPenjualan(id: number): Promise<ActionResult> {
  await requireRole("kasir")
  const supabase = await createClient()
  const { count } = await supabase.from("jual_barang").select("*", { count: "exact", head: true }).eq("penjualan_id", id)
  if (count) return { ok: "Transaksi tersimpan" }
  await supabase.from("penjualan").delete().eq("id", id)
  redirect("/penjualan")
}

export async function hapusPenjualan(id: number): Promise<ActionResult> {
  await requireRole("kasir")
  const supabase = await createClient()
  const { error } = await supabase.from("penjualan").delete().eq("id", id)
  if (error) return { error: dbError(error) }
  refresh()
  return { ok: "Penjualan dihapus" }
}

// Batalkan dari layar kasir: hapus transaksi lalu langsung buka transaksi baru.
export async function batalkanPenjualan(id: number): Promise<ActionResult> {
  await requireRole("kasir")
  const supabase = await createClient()
  const { error } = await supabase.from("penjualan").delete().eq("id", id)
  if (error) return { error: dbError(error) }
  return buatPenjualan()
}

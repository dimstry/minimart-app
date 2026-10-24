"use server"

import { redirect } from "next/navigation"
import { refresh } from "next/cache"
import { createAdminClient, dbError, requireRole, toEmail, type ActionResult, type Role } from "@/lib/supabase"
import { passwordAcak, ROLE_LABEL } from "@/lib/utils"

// Akun Supabase Auth hanya bisa dibuat/diubah dengan secret key, jadi semua aksi di sini wajib cek role pemilik.

export async function simpanPengguna(id: string | null, formData: FormData): Promise<ActionResult> {
  const me = await requireRole("pemilik")
  const username = String(formData.get("username")).trim().toLowerCase()
  const nama = String(formData.get("nama")).trim()
  const role = String(formData.get("role")) as Role
  if (!/^[a-z0-9._-]+$/.test(username) || !nama || !(role in ROLE_LABEL)) return { error: "Periksa kembali inputan" }

  const admin = createAdminClient()
  if (!id) {
    const { error } = await admin.auth.admin.createUser({
      email: toEmail(username),
      password: String(formData.get("password")),
      email_confirm: true,
      user_metadata: { username, nama, role },
    })
    if (error) return { error: error.code === "email_exists" ? "Username sudah dipakai" : error.message }
  } else {
    const aktif = formData.get("aktif") === "on"
    if (id === me.id && (role !== "pemilik" || !aktif)) {
      return { error: "Tidak bisa mengubah role atau menonaktifkan akun sendiri" }
    }
    const { error: authError } = await admin.auth.admin.updateUserById(id, { email: toEmail(username) })
    if (authError) return { error: authError.code === "email_exists" ? "Username sudah dipakai" : authError.message }
    const { error } = await admin.from("profiles").update({ username, nama, role, aktif }).eq("id", id)
    if (error) return { error: dbError(error) }
  }
  redirect("/pengguna")
}

// Password baru dibuat di server dan dikembalikan sebagai `ok` untuk ditampilkan ke pemilik.
export async function resetPassword(id: string): Promise<ActionResult> {
  await requireRole("pemilik")
  const password = passwordAcak()
  const { error } = await createAdminClient().auth.admin.updateUserById(id, { password })
  if (error) return { error: error.message }
  return { ok: password }
}

export async function hapusPengguna(id: string): Promise<ActionResult> {
  const me = await requireRole("pemilik")
  if (id === me.id) return { error: "Tidak bisa menghapus akun sendiri" }
  const { error } = await createAdminClient().auth.admin.deleteUser(id)
  if (error) return { error: "Pengguna sudah punya transaksi, nonaktifkan saja" }
  refresh()
  return { ok: "Pengguna dihapus" }
}

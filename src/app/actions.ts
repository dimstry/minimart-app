"use server"

import { redirect } from "next/navigation"
import { createAdminClient, createClient, DEMO_AKUN, toEmail, type ActionResult, type Role } from "@/lib/supabase"

export async function login(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: toEmail(String(formData.get("username"))),
    password: String(formData.get("password")),
  })
  if (error) return { error: "Username atau password salah" }

  const { data: profile } = await supabase.from("profiles").select("aktif").eq("id", data.user.id).single()
  if (!profile?.aktif) {
    await supabase.auth.signOut()
    return { error: "Akun Anda sudah dinonaktifkan" }
  }
  redirect("/beranda")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

// Tombol "Coba sebagai …": akun demo dibuat sendiri saat pertama kali dipakai,
// dan passwordnya disamakan lagi kalau DEMO_PASSWORD diganti.
export async function masukDemo(role: Role): Promise<ActionResult> {
  const password = process.env.DEMO_PASSWORD
  if (!password) return { error: "Mode demo tidak aktif" }
  const { username, nama } = DEMO_AKUN[role]
  const email = toEmail(username)
  const supabase = await createClient()
  let { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    const admin = createAdminClient()
    const { error: buatError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, nama, role },
    })
    if (buatError?.code === "email_exists") {
      const { data } = await admin.from("profiles").select("id").eq("username", username).single()
      if (data) await admin.auth.admin.updateUserById(data.id, { password })
    } else if (buatError) return { error: buatError.message }
    ;({ error } = await supabase.auth.signInWithPassword({ email, password }))
    if (error) return { error: error.message }
  }
  redirect("/beranda")
}

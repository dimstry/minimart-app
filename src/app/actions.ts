"use server"

import { redirect } from "next/navigation"
import { createClient, toEmail, type ActionResult } from "@/lib/supabase"

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

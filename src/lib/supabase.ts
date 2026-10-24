import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export type Role = "pemilik" | "gudang" | "kasir"
export type Profile = { id: string; username: string; nama: string; role: Role; aktif: boolean }
export type ActionResult = { error?: string; ok?: string } | null

// Supabase Auth butuh email, jadi username dipetakan ke domain palsu.
export const toEmail = (username: string) => `${username.trim().toLowerCase()}@minimart.local`

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          // Server Component tidak boleh set cookie; proxy.ts yang me-refresh sesi.
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    },
  )
}

// Hanya untuk kelola akun (pemilik). Selalu panggil requireRole("pemilik") dulu.
export function createAdminClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false },
  })
}

export const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data) return null
  const { data: profile } = await supabase.from("profiles").select().eq("id", data.claims.sub).single()
  return profile?.aktif ? profile : null
})

export async function requireRole(...roles: Role[]) {
  const profile = await getProfile()
  if (!profile) redirect("/login")
  if (roles.length && !roles.includes(profile.role)) redirect("/beranda")
  return profile
}

// Pesan error Postgres → bahasa manusia.
export function dbError(error: { message: string; code?: string }) {
  if (error.message.includes("barang_stok_check")) return "Stok tidak cukup"
  if (error.code === "23503") return "Data tidak dapat dihapus karena sudah dipakai transaksi"
  if (error.code === "23505") return "Data sudah ada"
  return error.message
}

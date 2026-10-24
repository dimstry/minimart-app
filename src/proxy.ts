import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Refresh sesi Supabase di setiap request dan arahkan tamu ke /login (kecuali landing page).
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
        },
      },
    },
  )

  // User yang sudah login tetap boleh buka /login: akun nonaktif diarahkan ke sana oleh requireRole().
  const { data } = await supabase.auth.getClaims()
  if (!data && !["/", "/login"].includes(request.nextUrl.pathname)) return NextResponse.redirect(new URL("/login", request.url))
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)"],
}

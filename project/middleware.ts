import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  console.log("[Middleware Debug] ==========================================")
  console.log("[Middleware Debug] Request path:", request.nextUrl.pathname)
  console.log("[Middleware Debug] Cookies no request:", request.cookies.getAll().map(c => c.name))
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          console.log("[Middleware Debug] Setando cookies:", cookiesToSet.map(c => c.name))
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Refresh session if expired - this must be called for auth to work
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  console.log("[Middleware Debug] Sessão detectada:", session ? "✅ Ativa" : "❌ Inativa")
  if (session) {
    console.log("[Middleware Debug] Usuário da sessão:", session.user.email)
  }

  const isLoginPage = request.nextUrl.pathname === "/login"
  const isAuthCallback = request.nextUrl.pathname.startsWith("/auth/callback")
  const isAuthError = request.nextUrl.pathname.startsWith("/auth/error")
  const isPublicPage = request.nextUrl.pathname === "/"

  // Allow public pages and auth routes
  if (isPublicPage || isAuthCallback || isAuthError) {
    return supabaseResponse
  }

  // Redirect to login if no session and trying to access protected route
  if (!session && !isLoginPage) {
    console.log("[Middleware Debug] ❌ Bloqueando acesso não autenticado a:", request.nextUrl.pathname)
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if logged in and trying to access login page
  if (session && isLoginPage) {
    console.log("[Middleware Debug] ✅ Usuário já autenticado, redirecionando de /login para /dashboard")
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  console.log("[Middleware Debug] ✅ Permitindo acesso a:", request.nextUrl.pathname)
  console.log("[Middleware Debug] ==========================================")
  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

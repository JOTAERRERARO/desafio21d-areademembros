import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const pathname = request.nextUrl.pathname

  console.log("[Middleware Debug] ==========================================")
  console.log("[Middleware Debug] Path:", pathname)
  console.log("[Middleware Debug] Session cookie:", session ? "✅ Ativo" : "❌ Inativo")

  // Rotas públicas
  const publicPaths = ["/login", "/login-simple", "/api/auth/login", "/api/lead-webhook", "/"]
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Permitir acesso a rotas públicas
  if (isPublicPath) {
    console.log("[Middleware Debug] ✅ Rota pública, permitindo acesso")
    console.log("[Middleware Debug] ==========================================")
    return NextResponse.next()
  }

  // Verificar autenticação para rotas protegidas
  if (!session || session.value !== "active") {
    console.log("[Middleware Debug] ❌ Acesso negado, redirecionando para /login")
    console.log("[Middleware Debug] ==========================================")
    return NextResponse.redirect(new URL("/login-simple", request.url))
  }

  console.log("[Middleware Debug] ✅ Sessão válida, permitindo acesso")
  console.log("[Middleware Debug] ==========================================")
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}


import { NextResponse } from "next/server"

export async function middleware() {
  // Let the request through - auth checks are handled at the page level
  // This avoids Edge runtime compatibility issues with Supabase
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

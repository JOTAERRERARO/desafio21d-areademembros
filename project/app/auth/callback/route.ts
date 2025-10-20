import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  console.log("[AUTH_CALLBACK] Processing auth callback")

  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const origin = requestUrl.origin

    if (!code) {
      console.error("[AUTH_CALLBACK] No code provided in callback")
      return NextResponse.redirect(`${origin}/login?error=no_code`)
    }

    console.log("[AUTH_CALLBACK] Creating Supabase client")
    let supabase
    try {
      supabase = await createServerSupabaseClient()
    } catch (clientError) {
      console.error("[AUTH_CALLBACK] Failed to create Supabase client:", clientError)
      return NextResponse.redirect(`${origin}/login?error=database_connection`)
    }

    console.log("[AUTH_CALLBACK] Exchanging code for session")
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[AUTH_CALLBACK] Error exchanging code:", exchangeError)
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`)
    }

    console.log("[AUTH_CALLBACK] Session exchange successful, redirecting to dashboard")
    return NextResponse.redirect(`${origin}/dashboard`)
  } catch (error) {
    console.error("[AUTH_CALLBACK] Unexpected error:", error)
    const requestUrl = new URL(request.url)
    const origin = requestUrl.origin
    return NextResponse.redirect(`${origin}/login?error=unexpected`)
  }
}

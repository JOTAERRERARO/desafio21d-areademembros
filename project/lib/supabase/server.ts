"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function supabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, { path: "/", ...options })
          } catch (e) {
            console.error("Error setting cookie:", e)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", { path: "/", maxAge: 0, ...options })
          } catch {}
        },
      },
    }
  )
}

// Alias para compatibilidade com código existente
export async function createServerSupabaseClient() {
  return supabaseServer()
}

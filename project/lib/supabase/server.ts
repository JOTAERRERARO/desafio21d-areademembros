"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function supabaseServer() {
  console.log("[Cookie Debug] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("[Cookie Debug] Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ OK" : "❌ MISSING")
  
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  console.log("[Cookie Debug] Cookies recebidos no SSR:", allCookies.map(c => c.name))
  console.log("[Cookie Debug] Total de cookies:", allCookies.length)

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value
          console.log(`[Cookie Debug] GET ${name}:`, value ? "✅ Encontrado" : "❌ Não encontrado")
          return value
        },
        set(name: string, value: string, options: any) {
          try {
            console.log(`[Cookie Debug] SET ${name}:`, value.substring(0, 20) + "...")
            cookieStore.set(name, value, { path: "/", ...options })
          } catch (e) {
            console.log(`[Cookie Debug] ERRO ao setar ${name}:`, e)
          }
        },
        remove(name: string, options: any) {
          try {
            console.log(`[Cookie Debug] REMOVE ${name}`)
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

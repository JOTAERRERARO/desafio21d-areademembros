"use client"

import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client
  
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: "sb-21d-auth",
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )
  
  return client
}

// Alias para compatibilidade
export const supabaseClient = createClient()

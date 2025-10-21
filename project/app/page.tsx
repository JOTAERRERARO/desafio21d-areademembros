import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function Home() {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/login")
    }

    redirect("/dashboard")
  } catch (error) {
    if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
      console.error("[v0] Unexpected error in home:", error)
    }
    redirect("/login")
  }
}

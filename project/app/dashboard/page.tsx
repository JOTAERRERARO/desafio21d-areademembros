import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  try {
    const supabase = await createServerSupabaseClient()

    console.log("[v0] Dashboard: Checking auth...")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("[v0] Dashboard auth error:", authError.message)
      redirect("/login")
    }

    if (!user) {
      console.log("[v0] Dashboard: No user found, redirecting to login")
      redirect("/login")
    }

    console.log("[v0] Dashboard: User authenticated:", user.email)

    // Fetch user data from database
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (userError) {
      console.error("[v0] Error fetching user data:", userError.message)
    }

    // Fetch user progress
    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)
      .order("day_number", { ascending: true })

    if (progressError) {
      console.error("[v0] Error fetching progress data:", progressError.message)
    }

    const completedDays = progressData?.map((p) => p.day_number) || []

    console.log("[v0] Dashboard: Rendering with", completedDays.length, "completed days")

    return <DashboardClient user={userData} completedDays={completedDays} />
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    console.error("[v0] Unexpected error in dashboard:", error)
    redirect("/login")
  }
}

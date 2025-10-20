import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
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

  const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userError) {
    console.error("[v0] Error fetching user data:", userError.message)
  }

  const { data: exerciseProgressData, error: progressError } = await supabase
    .from("exercise_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: true })

  if (progressError) {
    console.error("[v0] Error fetching exercise progress data:", progressError.message)
  }

  const completedExercises = exerciseProgressData || []
  const completedDays = Array.from(new Set(completedExercises.map((ex) => ex.day_number)))

  console.log("[v0] Dashboard: Rendering with", completedDays.length, "completed days and", completedExercises.length, "completed exercises")

  return <DashboardClient user={userData} completedDays={completedDays} />
}

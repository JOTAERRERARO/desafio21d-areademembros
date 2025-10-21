import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { VideoPlayer } from "@/components/video-player"
import { week1Days, week2Days, week3Days } from "@/lib/data/workout-data"

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Auth error in video page:", authError)
      redirect("/login")
    }

    const dayNumber = Number.parseInt(id)

    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 21) {
      redirect("/dashboard")
    }

    // Get user progress
    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)
      .order("day_number", { ascending: true })

    if (progressError) {
      console.error("[v0] Error fetching progress:", progressError)
    }

    const completedDays = progressData?.map((p) => p.day_number) || []

    // Find the workout day
    const allDays = [...week1Days, ...week2Days, ...week3Days]
    const workoutDay = allDays.find((d) => d.day === dayNumber)

    if (!workoutDay) {
      redirect("/dashboard")
    }

    // Check if day is locked
    const isLocked = dayNumber > 1 && !completedDays.includes(dayNumber - 1)

    if (isLocked) {
      redirect("/dashboard")
    }

    const isCompleted = completedDays.includes(dayNumber)

    // Find next day
    const nextDay = allDays.find((d) => d.day === dayNumber + 1)

    return (
      <VideoPlayer
        workoutDay={workoutDay}
        userId={user.id}
        isCompleted={isCompleted}
        nextDay={nextDay}
        completedDays={completedDays}
      />
    )
  } catch (error) {
    console.error("[v0] Unexpected error in video page:", error)
    redirect("/login")
  }
}

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { VideoPlayer } from "@/components/video-player"
import { week1Days, week2Days, week3Days } from "@/lib/data/workout-data"
import { calculateUserProgress } from "@/lib/utils/progress"
import type { ExerciseProgress } from "@/lib/types/database"

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

    // Buscar progresso de EXERCÍCIOS (nova lógica)
    const { data: exerciseProgressData, error: progressError } = await supabase
      .from("exercise_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: true })

    if (progressError) {
      console.error("[v0] Error fetching exercise progress:", progressError)
    }

    const completedExercises: ExerciseProgress[] = exerciseProgressData || []
    
    // Calcular progresso usando a nova lógica
    const userProgress = calculateUserProgress(completedExercises)
    const completedDays = Array.from(new Set(completedExercises.map((ex) => ex.day_number)))

    // Find the workout day
    const allDays = [...week1Days, ...week2Days, ...week3Days]
    const workoutDay = allDays.find((d) => d.day === dayNumber)

    if (!workoutDay) {
      redirect("/dashboard")
    }

    // Verificar se o dia está bloqueado baseado na lógica de semanas
    const weekIndex = dayNumber <= 7 ? 0 : dayNumber <= 14 ? 1 : 2
    const isLocked = userProgress.weeks[weekIndex]?.isLocked || false

    if (isLocked) {
      console.log(`[v0] Dia ${dayNumber} está bloqueado. Redirecionando...`)
      redirect("/dashboard")
    }

    // Verificar se o dia está completo (TODOS os exercícios)
    const completedExerciseIds = new Set(completedExercises.map((ex) => ex.exercise_id))
    const isCompleted = workoutDay.exercises.every((ex) => completedExerciseIds.has(ex.id))

    // Find next day
    const nextDay = allDays.find((d) => d.day === dayNumber + 1)

    return (
      <VideoPlayer
        workoutDay={workoutDay}
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

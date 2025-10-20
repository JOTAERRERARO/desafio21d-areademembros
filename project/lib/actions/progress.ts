"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Marca todos os exercícios de um dia como completos
 * Esta é a ação principal usada pelo VideoPlayer
 */
export async function completeDayAction(dayNumber: number) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Não autenticado" }
  }

  // Importar os dados dos treinos para obter os exercise_ids
  const { week1Days, week2Days, week3Days } = await import("@/lib/data/workout-data")
  const allDays = [...week1Days, ...week2Days, ...week3Days]
  const dayData = allDays.find((d) => d.day === dayNumber)

  if (!dayData) {
    return { error: "Dia de treino não encontrado" }
  }

  // Salvar TODOS os exercícios do dia na tabela exercise_progress
  const exerciseInserts = dayData.exercises.map((exercise) => ({
    user_id: user.id,
    exercise_id: exercise.id,
    day_number: dayNumber,
    completed_at: new Date().toISOString(),
  }))

  const { error: progressError } = await supabase.from("exercise_progress").upsert(exerciseInserts, {
    onConflict: "user_id,exercise_id",
    ignoreDuplicates: false,
  })

  if (progressError) {
    console.error("Erro ao salvar progresso:", progressError)
    return { error: progressError.message }
  }

  // Atualizar estatísticas do usuário
  const { data: allProgress } = await supabase
    .from("exercise_progress")
    .select("day_number, exercise_id")
    .eq("user_id", user.id)

  // Contar dias únicos completos
  const uniqueDays = new Set(allProgress?.map((p) => p.day_number) || [])
  const completedDaysCount = uniqueDays.size
  const nextDay = dayNumber + 1

  await supabase
    .from("users")
    .update({
      current_day: Math.min(nextDay, 22),
      videos_watched: completedDaysCount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  revalidatePath("/dashboard")
  revalidatePath("/video/[id]", "page")

  return { success: true }
}

export async function completeExerciseAction(exerciseId: string, dayNumber: number) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Não autenticado" }
  }

  const { error } = await supabase.from("exercise_progress").upsert(
    {
      user_id: user.id,
      exercise_id: exerciseId,
      day_number: dayNumber,
    },
    {
      onConflict: "user_id,exercise_id",
    },
  )

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")

  return { success: true }
}

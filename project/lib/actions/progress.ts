"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function completeDayAction(dayNumber: number) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Não autenticado" }
  }

  // Insert or update progress
  const { error: progressError } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      day_number: dayNumber,
    },
    {
      onConflict: "user_id,day_number",
    },
  )

  if (progressError) {
    return { error: progressError.message }
  }

  // Get total completed days
  const { data: allProgress } = await supabase.from("user_progress").select("day_number").eq("user_id", user.id)

  const completedDays = allProgress?.length || 0
  const nextDay = Math.max(...(allProgress?.map((p) => p.day_number) || [0])) + 1

  // Update user stats
  await supabase
    .from("users")
    .update({
      current_day: Math.min(nextDay, 22),
      videos_watched: completedDays,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  revalidatePath("/dashboard")

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

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { day_number } = body

    if (!day_number || day_number < 1 || day_number > 21) {
      return NextResponse.json({ error: "Número do dia inválido" }, { status: 400 })
    }

    // Insert or update progress
    const { error: progressError } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        day_number,
      },
      {
        onConflict: "user_id,day_number",
      },
    )

    if (progressError) {
      console.error("[v0] Error updating progress:", progressError)
      return NextResponse.json({ error: progressError.message }, { status: 500 })
    }

    // Get total completed days to update user stats
    const { data: allProgress, error: countError } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)

    if (countError) {
      console.error("[v0] Error counting progress:", countError)
    }

    const completedDays = allProgress?.length || 0
    const nextDay = Math.max(...(allProgress?.map((p) => p.day_number) || [0])) + 1

    // Update user stats
    const { error: updateError } = await supabase
      .from("users")
      .update({
        current_day: Math.min(nextDay, 22),
        videos_watched: completedDays,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[v0] Error updating user stats:", updateError)
    }

    return NextResponse.json(
      {
        success: true,
        message: "Progresso atualizado",
        completed_days: completedDays,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Progress tracking error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

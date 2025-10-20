import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("[COMPLETE_DAY] Received request")

  try {
    // Create Supabase client
    let supabase
    try {
      supabase = await createServerSupabaseClient()
    } catch (clientError) {
      console.error("[COMPLETE_DAY] Failed to create Supabase client:", clientError)
      return NextResponse.json(
        { error: "Database connection failed", details: clientError instanceof Error ? clientError.message : "Unknown error" },
        { status: 503 }
      )
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("[COMPLETE_DAY] Auth error:", authError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    if (!user) {
      console.error("[COMPLETE_DAY] No user found")
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[COMPLETE_DAY] Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { day_number } = body

    if (!day_number || day_number < 1 || day_number > 21) {
      console.error("[COMPLETE_DAY] Invalid day number:", day_number)
      return NextResponse.json({ error: "Número do dia inválido" }, { status: 400 })
    }

    console.log("[COMPLETE_DAY] Updating progress for user:", user.id, "day:", day_number)

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
      console.error("[COMPLETE_DAY] Error updating progress:", progressError)
      return NextResponse.json({ error: progressError.message }, { status: 500 })
    }

    // Get total completed days to update user stats
    const { data: allProgress, error: countError } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)

    if (countError) {
      console.error("[COMPLETE_DAY] Error counting progress:", countError)
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
      console.error("[COMPLETE_DAY] Error updating user stats:", updateError)
    }

    console.log("[COMPLETE_DAY] Progress updated successfully")

    return NextResponse.json(
      {
        success: true,
        message: "Progresso atualizado",
        completed_days: completedDays,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[COMPLETE_DAY] Unexpected error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Erro interno do servidor", details: errorMessage },
      { status: 500 }
    )
  }
}

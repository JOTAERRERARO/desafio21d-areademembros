import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("[COMPLETE_EXERCISE] Received request")

  try {
    // Create Supabase client
    let supabase
    try {
      supabase = await createServerSupabaseClient()
    } catch (clientError) {
      console.error("[COMPLETE_EXERCISE] Failed to create Supabase client:", clientError)
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
      console.error("[COMPLETE_EXERCISE] Auth error:", authError)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    if (!user) {
      console.error("[COMPLETE_EXERCISE] No user found")
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[COMPLETE_EXERCISE] Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { exercise_id, day_number } = body

    if (!exercise_id || !day_number) {
      console.error("[COMPLETE_EXERCISE] Missing required fields:", { exercise_id: !!exercise_id, day_number: !!day_number })
      return NextResponse.json({ error: "exercise_id e day_number são obrigatórios" }, { status: 400 })
    }

    console.log("[COMPLETE_EXERCISE] Updating exercise for user:", user.id, "exercise:", exercise_id)

    // Insert or update exercise progress
    const { error: exerciseError } = await supabase.from("exercise_progress").upsert(
      {
        user_id: user.id,
        exercise_id,
        day_number,
      },
      {
        onConflict: "user_id,exercise_id",
      },
    )

    if (exerciseError) {
      console.error("[COMPLETE_EXERCISE] Error updating exercise progress:", exerciseError)
      return NextResponse.json({ error: exerciseError.message }, { status: 500 })
    }

    console.log("[COMPLETE_EXERCISE] Exercise progress updated successfully")

    return NextResponse.json(
      {
        success: true,
        message: "Exercício marcado como completo",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[COMPLETE_EXERCISE] Unexpected error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Erro interno do servidor", details: errorMessage },
      { status: 500 }
    )
  }
}

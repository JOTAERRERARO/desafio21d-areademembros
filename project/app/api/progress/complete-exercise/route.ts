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
    const { exercise_id, day_number } = body

    if (!exercise_id || !day_number) {
      return NextResponse.json({ error: "exercise_id e day_number são obrigatórios" }, { status: 400 })
    }

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
      console.error("[v0] Error updating exercise progress:", exerciseError)
      return NextResponse.json({ error: exerciseError.message }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Exercício marcado como completo",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Exercise progress error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

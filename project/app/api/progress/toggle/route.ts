import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { day, completed } = await req.json()
    const supabase = await createServerSupabaseClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    if (!day || day < 1 || day > 21) {
      return NextResponse.json({ error: "Dia inválido" }, { status: 400 })
    }

    // Upsert no progresso
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        day_number: day,
      },
      {
        onConflict: "user_id,day_number",
      },
    )

    if (error) {
      console.error("[v0] Error toggling progress:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Atualizar estatísticas do usuário
    const { data: allProgress } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)

    const completedDays = allProgress?.length || 0
    const nextDay = Math.max(...(allProgress?.map((p) => p.day_number) || [0])) + 1

    await supabase
      .from("users")
      .update({
        current_day: Math.min(nextDay, 22),
        videos_watched: completedDays,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    return NextResponse.json({ success: true, completed_days: completedDays })
  } catch (error) {
    console.error("[v0] Toggle progress error:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}


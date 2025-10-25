import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Buscar progresso do usuário
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)
      .order("day_number", { ascending: true })

    const completedDays = progressData?.map((p) => p.day_number) || []

    // Calcular semanas completas
    const week1Days = completedDays.filter((d) => d >= 1 && d <= 7)
    const week2Days = completedDays.filter((d) => d >= 8 && d <= 14)
    const week3Days = completedDays.filter((d) => d >= 15 && d <= 21)

    const week1Completed = week1Days.length === 7
    const week2Completed = week2Days.length === 7
    const week3Completed = week3Days.length === 7

    // Semana 3 desbloqueia quando 1 e 2 estão completas
    const week3Unlocked = week1Completed && week2Completed

    return NextResponse.json({
      completedDays,
      totalCompleted: completedDays.length,
      week1: {
        completed: week1Completed,
        count: week1Days.length,
        total: 7,
      },
      week2: {
        completed: week2Completed,
        count: week2Days.length,
        total: 7,
      },
      week3: {
        completed: week3Completed,
        count: week3Days.length,
        total: 7,
        unlocked: week3Unlocked,
      },
      week1Completed,
      week2Completed,
      week3Unlocked,
    })
  } catch (error) {
    console.error("[v0] Progress summary error:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}


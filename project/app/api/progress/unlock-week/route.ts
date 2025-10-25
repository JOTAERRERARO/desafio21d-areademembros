import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { week } = await req.json()

    if (!week || !["week1", "week2", "week3"].includes(week)) {
      return NextResponse.json({ error: "Semana inválida" }, { status: 400 })
    }

    // Buscar progresso atual do usuário
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)

    const completedDays = progressData?.map((p) => p.day_number) || []

    // Verificar se pode desbloquear
    const week1Complete = completedDays.filter((d) => d >= 1 && d <= 7).length === 7
    const week2Complete = completedDays.filter((d) => d >= 8 && d <= 14).length === 7

    let canUnlock = false
    let updateData: any = {}

    if (week === "week1") {
      canUnlock = true
      updateData.week1_unlocked = true
    } else if (week === "week2") {
      canUnlock = week1Complete
      updateData.week2_unlocked = true
    } else if (week === "week3") {
      canUnlock = week1Complete && week2Complete
      updateData.week3_unlocked = true
    }

    if (!canUnlock) {
      return NextResponse.json(
        { error: "Pré-requisitos não cumpridos para desbloquear esta semana" },
        { status: 400 },
      )
    }

    // Criar ou atualizar registro de progresso
    const { error } = await supabase
      .from("user_week_progress")
      .upsert(
        {
          user_id: user.id,
          ...updateData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )

    if (error) {
      console.error("[v0] Error unlocking week:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `${week} desbloqueada com sucesso`,
      week1Complete,
      week2Complete,
    })
  } catch (error) {
    console.error("[v0] Unlock week error:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Buscar progresso das semanas
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)

    const completedDays = progressData?.map((p) => p.day_number) || []

    const week1Complete = completedDays.filter((d) => d >= 1 && d <= 7).length === 7
    const week2Complete = completedDays.filter((d) => d >= 8 && d <= 14).length === 7
    const week3Unlocked = week1Complete && week2Complete

    return NextResponse.json({
      week1_complete: week1Complete,
      week2_complete: week2Complete,
      week3_unlocked: week3Unlocked,
      completed_days: completedDays,
    })
  } catch (error) {
    console.error("[v0] Get week status error:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}


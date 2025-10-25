import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  try {
    console.log("[Dashboard Debug] ==========================================")
    console.log("[Dashboard Debug] Render SSR iniciado")
    
    const supabase = await createServerSupabaseClient()

    console.log("[Dashboard Debug] Supabase client criado no SSR")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("[Dashboard Debug] ❌ Erro de autenticação:", authError.message)
      redirect("/login")
    }

    if (!user) {
      console.log("[Dashboard Debug] ❌ Nenhum usuário detectado, redirecionando para login")
      redirect("/login")
    }

    console.log("[Dashboard Debug] ✅ Usuário autenticado:", user.email)
    console.log("[Dashboard Debug] User ID:", user.id)

    // Fetch user data from database
    console.log("[Dashboard Debug] Buscando dados do usuário da tabela users...")
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (userError) {
      console.error("[Dashboard Debug] ❌ Erro ao buscar dados do usuário:", userError.message)
    } else {
      console.log("[Dashboard Debug] ✅ Dados do usuário carregados:", userData?.name)
    }

    // Fetch user progress
    console.log("[Dashboard Debug] Buscando progresso do usuário...")
    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)
      .order("day_number", { ascending: true })

    if (progressError) {
      console.error("[Dashboard Debug] ❌ Erro ao buscar progresso:", progressError.message)
    }

    const completedDays = progressData?.map((p) => p.day_number) || []

    console.log("[Dashboard Debug] ✅ Renderizando dashboard com", completedDays.length, "dias completos")
    console.log("[Dashboard Debug] Dias completos:", completedDays)
    console.log("[Dashboard Debug] ==========================================")

    return <DashboardClient user={userData} completedDays={completedDays} />
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error
    }
    console.error("[v0] Unexpected error in dashboard:", error)
    redirect("/login")
  }
}

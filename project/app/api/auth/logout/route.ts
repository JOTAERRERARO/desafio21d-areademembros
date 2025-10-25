import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    console.log("[Auth API] Fazendo logout...")

    const cookieStore = await cookies()
    
    // Remover cookies de sessão
    cookieStore.delete("session")
    cookieStore.delete("username")

    console.log("[Auth API] ✅ Sessão encerrada")

    return NextResponse.json({
      success: true,
      message: "Logout realizado com sucesso",
    })
  } catch (error) {
    console.error("[Auth API] Erro no logout:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao fazer logout" },
      { status: 500 }
    )
  }
}


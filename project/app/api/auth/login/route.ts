import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log("[Auth API] Tentativa de login:", username)

    // Validar credenciais
    const validUsername = process.env.USER_LOGIN || "admin"
    const validPassword = process.env.USER_PASSWORD || "12345"

    if (username !== validUsername || password !== validPassword) {
      console.log("[Auth API] ❌ Credenciais inválidas")
      return NextResponse.json(
        { success: false, message: "Usuário ou senha incorretos" },
        { status: 401 }
      )
    }

    console.log("[Auth API] ✅ Credenciais válidas, criando sessão")

    // Criar cookie de sessão
    const cookieStore = await cookies()
    cookieStore.set("session", "active", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    })

    cookieStore.set("username", username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    console.log("[Auth API] ✅ Cookies de sessão criados")

    return NextResponse.json({
      success: true,
      message: "Login realizado com sucesso",
    })
  } catch (error) {
    console.error("[Auth API] Erro:", error)
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}


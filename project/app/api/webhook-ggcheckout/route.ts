import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, nome } = body

    if (!email || !nome) {
      return NextResponse.json({ error: "Email e nome são obrigatórios" }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Create user in Supabase Auth with default password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: "123456",
      email_confirm: true,
      user_metadata: {
        name: nome,
      },
    })

    if (authError) {
      console.error("[v0] Error creating user:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Log payment in payments table
    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: authData.user.id,
      email,
      name: nome,
      status: "completed",
      metadata: body,
    })

    if (paymentError) {
      console.error("[v0] Error logging payment:", paymentError)
    }

    console.log("[v0] User created successfully:", email)

    return NextResponse.json(
      {
        success: true,
        message: "Usuário criado com sucesso",
        user_id: authData.user.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

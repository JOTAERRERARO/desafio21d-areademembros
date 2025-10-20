import { createAdminSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("[WEBHOOK] Received webhook request")

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[WEBHOOK] Failed to parse request body:", parseError)
      return NextResponse.json(
        { error: "Invalid JSON in request body" }, 
        { status: 400 }
      )
    }

    const { email, nome } = body

    if (!email || !nome) {
      console.error("[WEBHOOK] Missing required fields:", { email: !!email, nome: !!nome })
      return NextResponse.json(
        { error: "Email e nome são obrigatórios" }, 
        { status: 400 }
      )
    }

    console.log("[WEBHOOK] Creating admin Supabase client")
    const supabase = await createAdminSupabaseClient()

    console.log("[WEBHOOK] Creating user:", email)
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
      console.error("[WEBHOOK] Error creating user:", authError)
      return NextResponse.json(
        { error: authError.message }, 
        { status: 500 }
      )
    }

    if (!authData || !authData.user) {
      console.error("[WEBHOOK] User creation returned no data")
      return NextResponse.json(
        { error: "Failed to create user - no data returned" }, 
        { status: 500 }
      )
    }

    console.log("[WEBHOOK] User created successfully, ID:", authData.user.id)

    // Log payment in payments table
    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: authData.user.id,
      email,
      name: nome,
      status: "completed",
      metadata: body,
    })

    if (paymentError) {
      console.error("[WEBHOOK] Error logging payment:", paymentError)
      // Don't fail the webhook if payment logging fails
    }

    console.log("[WEBHOOK] Webhook completed successfully for:", email)

    return NextResponse.json(
      {
        success: true,
        message: "Usuário criado com sucesso",
        user_id: authData.user.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[WEBHOOK] Unexpected error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Erro interno do servidor", details: errorMessage }, 
      { status: 500 }
    )
  }
}

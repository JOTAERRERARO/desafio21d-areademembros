import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user, timestamp } = body

    // Detectar IP do usuário
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown"

    const leadData = {
      user,
      ip,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    console.log("[Webhook Lead] ==========================================")
    console.log("[Webhook Lead] Novo acesso detectado:")
    console.log("[Webhook Lead] Usuário:", leadData.user)
    console.log("[Webhook Lead] IP:", leadData.ip)
    console.log("[Webhook Lead] Data:", leadData.timestamp)
    console.log("[Webhook Lead] User Agent:", leadData.userAgent)
    console.log("[Webhook Lead] ==========================================")

    // Enviar para webhook externo (se configurado)
    const webhookUrl = process.env.WEBHOOK_URL

    if (webhookUrl) {
      try {
        console.log("[Webhook Lead] Enviando para webhook externo:", webhookUrl)
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(leadData),
        })

        if (response.ok) {
          console.log("[Webhook Lead] ✅ Enviado com sucesso para webhook externo")
        } else {
          console.error("[Webhook Lead] ❌ Erro ao enviar para webhook:", response.statusText)
        }
      } catch (webhookError) {
        console.error("[Webhook Lead] ❌ Erro ao enviar webhook:", webhookError)
      }
    } else {
      console.log("[Webhook Lead] ⚠️ WEBHOOK_URL não configurado - lead apenas logado")
    }

    return NextResponse.json({
      success: true,
      message: "Lead registrado com sucesso",
      data: leadData,
    })
  } catch (error) {
    console.error("[Webhook Lead] Erro:", error)
    return NextResponse.json(
      { success: false, message: "Erro ao processar lead" },
      { status: 500 }
    )
  }
}


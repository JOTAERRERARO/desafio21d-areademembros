import { createClient } from "@supabase/supabase-js"

/**
 * 🚀 Webhook GGCheckout → Supabase
 * Cria automaticamente o usuário quando o pagamento for aprovado.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // ✅ Permitir apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  try {
    const payload = req.body

    // ⚠️ Verifica se o corpo é válido
    if (!payload || !payload.event) {
      console.error("❌ Payload inválido:", payload)
      return res.status(400).json({ error: "Payload inválido" })
    }

    // 🧾 Aceita apenas eventos de pagamento aprovado
    const validEvents = ["pix.paid", "card.paid"]
    if (!validEvents.includes(payload.event)) {
      console.log(`ℹ️ Evento ignorado: ${payload.event}`)
      return res.status(200).json({ ignored: true })
    }

    // 📧 Extrai informações do comprador
    const email = payload?.customer?.email
    const name = payload?.customer?.name || "Novo Usuário"

    if (!email) {
      console.error("❌ Email ausente no payload:", payload)
      return res.status(400).json({ error: "Email não encontrado" })
    }

    // 🧠 Cria o usuário no Supabase Auth
    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password: "123456",
      email_confirm: true,
      user_metadata: { name, origin: "ggcheckout" }
    })

    if (createError && !createError.message.includes("already registered")) {
      console.error("❌ Erro ao criar usuário:", createError)
      throw createError
    }

    // 💾 Atualiza ou insere na tabela "users" (opcional)
    await supabase.from("users").upsert({
      email,
      name,
      origin: "ggcheckout",
      created_at: new Date().toISOString(),
    })

    console.log(`✅ Usuário ${email} criado com sucesso via GGCheckout.`)
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error("❌ Erro no webhook:", err)
    return res.status(500).json({ error: "Erro interno ao processar webhook" })
  }
}

// ⚙️ Configuração para interpretar JSON corretamente no Vercel
export const config = {
  api: {
    bodyParser: true, // Garante que o req.body venha como objeto JSON
  },
}

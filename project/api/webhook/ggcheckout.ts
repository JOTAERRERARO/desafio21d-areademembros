import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

// ✅ Inicializa cliente Supabase com Service Role Key (importante para criar usuários)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 🚀 Webhook GGCheckout
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apenas POST é permitido
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  try {
    const payload = req.body

    // 🔍 Valida o evento
    if (!payload || !payload.event) {
      return res.status(400).json({ error: "Payload inválido" })
    }

    // ⚙️ Aceita apenas eventos de pagamento aprovado
    const validEvents = ["pix.paid", "card.paid"]
    if (!validEvents.includes(payload.event)) {
      return res.status(200).json({ ignored: true })
    }

    // 🧾 Extrai dados do cliente
    const email = payload?.customer?.email
    const name = payload?.customer?.name || "Novo Usuário"

    if (!email) {
      return res.status(400).json({ error: "Email não encontrado no payload" })
    }

    // 🔑 Cria usuário no Supabase Auth
    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password: "123456",
      email_confirm: true,
      user_metadata: { name, origin: "ggcheckout" }
    })

    if (createError && !createError.message.includes("already registered")) {
      console.error("Erro ao criar usuário:", createError)
      throw createError
    }

    // 💾 Adiciona na tabela users (caso exista)
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

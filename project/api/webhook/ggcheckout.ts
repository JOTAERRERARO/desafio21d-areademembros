import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Método não permitido")

  const payload = req.body

  // Captura apenas eventos de pagamento confirmado
  if (!["pix.paid", "card.paid"].includes(payload.event)) {
    return res.status(200).json({ ignored: true })
  }

  const email = payload?.customer?.email
  const name = payload?.customer?.name || "Novo Usuário"

  if (!email) {
    return res.status(400).json({ error: "Email não encontrado no payload" })
  }

  try {
    // 🔑 Cria usuário no Supabase Auth
    const { error: createError } = await supabase.auth.admin.createUser({
      email,
      password: "123456",
      email_confirm: true,
      user_metadata: { name }
    })

    if (createError && !createError.message.includes("already registered")) {
      console.error("Erro ao criar usuário:", createError)
      throw createError
    }

    // 💾 (Opcional) adiciona também na tabela 'users'
    await supabase.from("users").upsert({
      email,
      name,
      created_at: new Date().toISOString(),
      origin: "ggcheckout"
    })

    console.log(`✅ Usuário ${email} criado com sucesso!`)
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error("Erro no webhook:", err)
    return res.status(500).json({ error: "Erro interno" })
  }
}

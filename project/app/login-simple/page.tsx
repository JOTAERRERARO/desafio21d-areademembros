"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log("[Auth Debug] Tentativa de login:", username)

    try {
      // Validar credenciais via API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Usuário ou senha incorretos")
      }

      console.log("[Auth Debug] ✅ Login bem-sucedido")

      // Enviar webhook de lead
      try {
        await fetch("/api/lead-webhook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: username,
            timestamp: new Date().toISOString(),
          }),
        })
        console.log("[Webhook Debug] ✅ Lead enviado")
      } catch (webhookError) {
        console.error("[Webhook Debug] Erro ao enviar lead:", webhookError)
        // Não bloqueia o login se webhook falhar
      }

      // Redirecionar para dashboard
      console.log("[Auth Debug] Redirecionando para dashboard...")
      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("[Auth Debug] Erro no login:", error)
      setError(error.message || "Erro ao fazer login")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-dark-bg">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-2xl shadow-primary/50">
              <Flame size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">DESAFIO 21D</h1>
            <p className="text-sm text-gray-400">Área de Membros Elite</p>
          </div>

          <Card className="bg-dark-card border-dark-border">
            <CardHeader>
              <CardTitle className="text-2xl">Acesso Liberado</CardTitle>
              <CardDescription>Entre com suas credenciais para acessar todos os módulos</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="admin"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-dark-bg border-dark-border"
                      autoComplete="username"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-dark-bg border-dark-border"
                      autoComplete="current-password"
                    />
                  </div>
                  {error && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-light" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Acessar Área de Membros"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-400">
            <p>🔥 Todos os módulos já estão liberados para você!</p>
          </div>
        </div>
      </div>
    </div>
  )
}


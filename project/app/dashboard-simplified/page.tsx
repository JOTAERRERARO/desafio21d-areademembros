"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Flame, Play, Trophy, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState("Membro")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Pegar username do cookie
    const usernameCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("username="))
      ?.split("=")[1]

    if (usernameCookie) {
      setUsername(usernameCookie)
    }

    setLoading(false)
  }, [])

  const handleLogout = async () => {
    console.log("[Auth Debug] Fazendo logout...")
    
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      console.log("[Auth Debug] ✅ Logout bem-sucedido")
      window.location.href = "/login-simple"
    } catch (error) {
      console.error("[Auth Debug] Erro no logout:", error)
      // Força logout mesmo com erro
      document.cookie = "session=; path=/; max-age=0"
      document.cookie = "username=; path=/; max-age=0"
      window.location.href = "/login-simple"
    }
  }

  const modules = [
    {
      week: 1,
      title: "SEMANA 1 - BASE E REATIVAÇÃO",
      description: "Reacende músculos e crie rotina",
      icon: "🏃",
      gradient: "from-blue-500 to-cyan-500",
      days: 7,
    },
    {
      week: 2,
      title: "SEMANA 2 - QUEIMA E DEFINIÇÃO",
      description: "Intensifique e queime gordura",
      icon: "🔥",
      gradient: "from-orange-500 to-red-500",
      days: 7,
    },
    {
      week: 3,
      title: "SEMANA 3 - PERFORMANCE MÁXIMA",
      description: "Atinja seu potencial máximo",
      icon: "⚡",
      gradient: "from-yellow-500 to-amber-500",
      days: 7,
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg">
        <div className="animate-pulse text-white">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-yellow mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-yellow flex items-center justify-center shadow-xl">
              <Flame size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">DESAFIO 21D</h1>
              <p className="text-sm text-gray-400">Área de Membros</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/20 hover:bg-red-500/10 text-red-400"
          >
            <LogOut size={18} className="mr-2" />
            Sair
          </Button>
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-2xl p-8 mb-8 shadow-2xl shadow-primary/20">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-2">
            <Flame size={32} className="animate-pulse" />
            BEM-VINDO, {username.toUpperCase()}!
          </h2>
          <p className="text-lg mb-4">Todos os módulos já estão liberados para você!</p>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-3 rounded-lg">
            <p className="font-semibold">🔥 Todos os módulos foram liberados para você começar agora!</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="text-primary" size={24} />
              Progresso Geral
            </h3>
            <span className="text-2xl font-black text-primary">100%</span>
          </div>
          
          <div className="w-full bg-dark-bg rounded-full h-6 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-primary via-accent-yellow to-accent-green h-6 transition-all duration-1000 ease-out shadow-lg shadow-primary/50"
              style={{ width: "100%" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          <p className="text-sm mt-3 text-center text-gray-400">
            Todos os conteúdos liberados! Comece quando quiser 🚀
          </p>
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div
              key={module.week}
              className={`bg-gradient-to-br ${module.gradient} rounded-xl p-6 shadow-2xl cursor-pointer hover:scale-105 transition-all`}
              onClick={() => router.push(`/week/${module.week}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">{module.icon}</span>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play size={24} />
                </div>
              </div>
              
              <h3 className="text-xl font-black mb-2">{module.title}</h3>
              <p className="text-sm opacity-90 mb-4">{module.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-75">{module.days} dias de treino</span>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-bold">🔓 LIBERADO</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Transforme seu corpo em 21 dias com treinos completos e progressivos 💪
          </p>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Flame, Trophy, Target } from "lucide-react"

interface GamificationProps {
  userId: string
  userName: string
}

export function DashboardGamification({ userId, userName }: GamificationProps) {
  const supabase = createClient()
  const [progress, setProgress] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProgress() {
      try {
        console.log("[Gamification Debug] Carregando progresso para:", userId)

        // Buscar progresso das semanas
        const { data: progressData } = await supabase
          .from("user_week_progress")
          .select("*")
          .eq("user_id", userId)
          .single()

        console.log("[Gamification Debug] ✅ Progresso carregado:", progressData)
        setProgress(progressData)

        // Definir mensagem dinâmica
        if (progressData?.week3_unlocked) {
          setMessage("🎉 Semana 3 desbloqueada! Você está na reta final da transformação! 💪")
        } else if (progressData?.week2_unlocked) {
          setMessage("🔥 Semana 2 desbloqueada! A intensidade aumenta agora!")
        } else {
          setMessage("🏁 Comece forte! Cada dia é uma conquista rumo ao seu objetivo.")
        }
      } catch (err) {
        console.error("[Gamification Debug] Erro:", err)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()

    // Realtime listener para atualizações
    const subscription = supabase
      .channel("progress-gamification")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_week_progress", filter: `user_id=eq.${userId}` },
        (payload) => {
          console.log("[Realtime Debug] Progresso atualizado:", payload.new)
          setProgress(payload.new)
          
          if (payload.new?.week3_unlocked && !progress?.week3_unlocked) {
            setMessage("🎉 SEMANA 3 DESBLOQUEADA AUTOMATICAMENTE! Você completou 2 semanas! 🚀")
          } else if (payload.new?.week2_unlocked && !progress?.week2_unlocked) {
            setMessage("🔥 SEMANA 2 DESBLOQUEADA! Continue assim! 💪")
          }
        },
      )
      .subscribe((status) => {
        console.log("[Realtime Debug] Subscription status:", status)
      })

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId, supabase])

  // Calcular progresso visual
  function calculateProgressPercent(p: any) {
    if (!p) return 0
    const weeks = [p.week1_unlocked, p.week2_unlocked, p.week3_unlocked]
    const unlocked = weeks.filter(Boolean).length
    return (unlocked / 3) * 100
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="h-4 bg-dark-bg rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-dark-bg rounded"></div>
      </div>
    )
  }

  const progressPercent = calculateProgressPercent(progress)
  const firstName = userName?.split(" ")[0] || "Membro"

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mensagem de Boas-Vindas Gamificada */}
      <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-2xl p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Trophy size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Flame size={40} className="animate-pulse" />
            <h1 className="text-3xl font-black">OLÁ, {firstName.toUpperCase()}!</h1>
          </div>
          <p className="text-lg opacity-90 mb-4">Sua jornada de transformação está em progresso!</p>
          
          {message && (
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-3 rounded-lg">
              <p className="font-semibold">{message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Progresso Animada */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-[#e0e0e0] flex items-center gap-2">
            <Target className="text-primary" size={24} />
            Progresso de Desbloqueio
          </h3>
          <span className="text-2xl font-black text-primary">{progressPercent.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-dark-bg rounded-full h-6 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-primary via-accent-yellow to-accent-green h-6 transition-all duration-1000 ease-out shadow-lg shadow-primary/50 relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        
        <p className="text-xs mt-3 text-gray-400 text-center">
          Complete todas as semanas para desbloquear 100% do conteúdo!
        </p>
      </div>

      {/* Badges de Semanas com Status Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Semana 1",
            subtitle: "BASE E REATIVAÇÃO",
            unlocked: progress?.week1_unlocked,
            complete: progress?.week1_complete,
            icon: "🏃",
          },
          {
            label: "Semana 2",
            subtitle: "QUEIMA E DEFINIÇÃO",
            unlocked: progress?.week2_unlocked,
            complete: progress?.week2_complete,
            icon: "🔥",
          },
          {
            label: "Semana 3",
            subtitle: "PERFORMANCE MÁXIMA",
            unlocked: progress?.week3_unlocked,
            complete: progress?.week3_complete,
            icon: "⚡",
          },
        ].map((w, i) => (
          <div
            key={i}
            className={`relative px-5 py-6 rounded-xl border text-center font-semibold shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer ${
              w.complete
                ? "bg-gradient-to-br from-accent-green/20 to-accent-green/10 border-accent-green text-accent-green shadow-accent-green/30"
                : w.unlocked
                  ? "bg-gradient-to-br from-primary/20 to-accent-yellow/10 border-primary text-primary shadow-primary/30 animate-pulse-slow"
                  : "bg-dark-card border-dark-border text-gray-500 opacity-60"
            }`}
          >
            {/* Badge de Status */}
            {w.complete && (
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-accent-green flex items-center justify-center shadow-lg border-2 border-dark-bg">
                <span className="text-black text-2xl font-bold">✓</span>
              </div>
            )}
            {!w.unlocked && (
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shadow-lg border-2 border-dark-bg">
                <span className="text-white text-xl">🔒</span>
              </div>
            )}

            <div className="text-4xl mb-2">{w.icon}</div>
            <div className="text-lg font-black">{w.label}</div>
            <div className="text-xs mt-1 opacity-80">{w.subtitle}</div>
            <div className="text-xs mt-2 font-bold">
              {w.complete ? "✅ COMPLETA" : w.unlocked ? "🔓 ATIVA" : "🔒 BLOQUEADA"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


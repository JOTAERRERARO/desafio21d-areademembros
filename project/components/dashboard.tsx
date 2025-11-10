"use client"

import { Calendar, Flame, Play, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { calculateUserProgress, findNextUncompletedWorkout } from "@/lib/utils/progress"

interface DashboardProps {
  completedDays: number[]
  unlockedWeeks?: number[]
}

export function Dashboard({ completedDays, unlockedWeeks = [1] }: DashboardProps) {
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)

  const userProgress = calculateUserProgress(completedDays, unlockedWeeks)

  const handleTodayWorkout = () => {
    const nextWorkoutUrl = findNextUncompletedWorkout(completedDays)

    if (nextWorkoutUrl === "/dashboard") {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    router.push(nextWorkoutUrl)
  }

  const stats = [
    {
      icon: Calendar,
      value: completedDays.length || 0,
      label: "Dias Feitos",
      color: "text-primary",
      bgGradient: "from-primary/20 to-primary/5",
    },
    {
      icon: Flame,
      value: Math.min(completedDays.length, 21),
      label: "Dias Seguidos",
      color: "text-accent-yellow",
      bgGradient: "from-accent-yellow/20 to-accent-yellow/5",
    },
    {
      icon: Play,
      value: completedDays.length || 0,
      label: "Vídeos",
      color: "text-secondary",
      bgGradient: "from-secondary/20 to-secondary/5",
    },
    {
      icon: Target,
      value: `${Math.round((completedDays.length / 21) * 100)}%`,
      label: "Progresso Total",
      color: "text-accent-green",
      bgGradient: "from-accent-green/20 to-accent-green/5",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {showToast && (
        <div className="fixed top-24 right-4 bg-accent-green text-dark-bg font-bold py-3 px-6 rounded-lg shadow-xl animate-slide-up z-50">
          ✅ Parabéns! Você completou todos os treinos!
        </div>
      )}

      <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-2xl p-6 md:p-8 border border-primary/20 relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute inset-0 bg-[url('https://i.imgur.com/DoFBPr9.jpeg')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black mb-2 flex items-center gap-2 text-white">
            <Flame size={32} className="animate-pulse" />
            BEM-VINDO DE VOLTA!
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-1">
            Você está no <span className="font-bold">DIA {userProgress.currentDay}</span> de 21
          </p>
          <p className="text-sm md:text-base text-white/80 mb-6">
            Continue assim! A transformação acontece um treino de cada vez.
          </p>
          <button
            onClick={handleTodayWorkout}
            className="bg-white !text-black hover:bg-white/90 font-bold py-3 px-6 md:px-8 rounded-lg transition-all hover:scale-105 shadow-lg active:scale-95"
          >
            ▶ IR PARA O TREINO DE HOJE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.bgGradient} border border-dark-border rounded-xl p-4 md:p-6 hover:scale-105 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer`}
          >
            <stat.icon className={`${stat.color} mb-2 md:mb-3`} size={24} />
            <div className="text-3xl md:text-4xl font-black mb-1 text-[#e0e0e0]">{stat.value}</div>
            <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-6 text-[#e0e0e0]">SEU PROGRESSO SEMANAL</h2>
        <div className="space-y-4">
          {userProgress.weeks.map((week) => (
            <div key={week.weekNumber} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm md:text-base text-[#e0e0e0]">SEMANA {week.weekNumber}</span>
                  {week.isActive && <span className="text-primary text-xs md:text-sm animate-pulse">🔥 ATIVA</span>}
                  {week.isCompleted && <span className="text-accent-green text-xs md:text-sm">✅ CONCLUÍDA</span>}
                  {week.isLocked && <span className="text-gray-500 text-xs md:text-sm">🔒 BLOQUEADA</span>}
                  {!week.isLocked && !week.isCompleted && (
                    <span className="text-primary text-xs md:text-sm">{Math.round(week.progress)}% EM PROGRESSO</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    week.isCompleted
                      ? "bg-accent-green shadow-lg shadow-accent-green/50"
                      : week.isActive
                        ? "bg-gradient-to-r from-primary to-accent-yellow shadow-lg shadow-primary/50 animate-pulse"
                        : week.isLocked
                          ? "bg-gray-700"
                          : "bg-gradient-to-r from-primary to-accent-yellow"
                  }`}
                  style={{ width: `${week.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

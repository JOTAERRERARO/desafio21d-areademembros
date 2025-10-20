"use client"

import { Calendar, TrendingUp, Award, Target, Flame, CheckCircle2 } from "lucide-react"
import type { User } from "@/lib/types/database"

interface ProgressPageProps {
  user: User | null
  completedDays: number[]
}

export function ProgressPage({ user, completedDays }: ProgressPageProps) {
  const totalDays = 21
  const completedCount = completedDays.length
  const progressPercentage = (completedCount / totalDays) * 100

  const weeklyProgress = [
    {
      week: 1,
      days: [1, 2, 3, 4, 5, 6, 7],
      completed: completedDays.filter((d) => d >= 1 && d <= 7).length,
    },
    {
      week: 2,
      days: [8, 9, 10, 11, 12, 13, 14],
      completed: completedDays.filter((d) => d >= 8 && d <= 14).length,
    },
    {
      week: 3,
      days: [15, 16, 17, 18, 19, 20, 21],
      completed: completedDays.filter((d) => d >= 15 && d <= 21).length,
    },
  ]

  const achievements = [
    {
      icon: Flame,
      title: "Primeira Semana",
      description: "Complete os primeiros 7 dias",
      unlocked: completedCount >= 7,
    },
    {
      icon: Target,
      title: "Meio Caminho",
      description: "Complete 10 dias do desafio",
      unlocked: completedCount >= 10,
    },
    {
      icon: Award,
      title: "Guerreiro Elite",
      description: "Complete todos os 21 dias",
      unlocked: completedCount >= 21,
    },
    {
      icon: TrendingUp,
      title: "Sequência de Fogo",
      description: "7 dias consecutivos",
      unlocked: (user?.streak || 0) >= 7,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
          <TrendingUp size={32} />
          MEU PROGRESSO
        </h1>
        <p className="text-lg opacity-90">Acompanhe sua jornada de transformação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:scale-105 transition-transform">
          <Calendar className="text-primary mb-3" size={28} />
          <div className="text-4xl font-black mb-1">{completedCount}</div>
          <div className="text-sm text-gray-400">Dias Completos</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:scale-105 transition-transform">
          <Flame className="text-accent-yellow mb-3" size={28} />
          <div className="text-4xl font-black mb-1">{user?.streak || 0}</div>
          <div className="text-sm text-gray-400">Dias Seguidos</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:scale-105 transition-transform">
          <Target className="text-accent-green mb-3" size={28} />
          <div className="text-4xl font-black mb-1">{Math.round(progressPercentage)}%</div>
          <div className="text-sm text-gray-400">Progresso Total</div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:scale-105 transition-transform">
          <Award className="text-secondary mb-3" size={28} />
          <div className="text-4xl font-black mb-1">{user?.videos_watched || 0}</div>
          <div className="text-sm text-gray-400">Vídeos Assistidos</div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Calendar className="text-primary" />
          CALENDÁRIO DE 21 DIAS
        </h2>
        <div className="space-y-6">
          {weeklyProgress.map((week) => (
            <div key={week.week} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Semana {week.week}</h3>
                <span className="text-sm text-gray-400">
                  {week.completed}/{week.days.length} dias
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {week.days.map((day) => (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                      completedDays.includes(day)
                        ? "bg-gradient-to-br from-primary to-accent-yellow text-white scale-105 shadow-lg"
                        : "bg-dark-bg border border-dark-border text-gray-500 hover:border-primary"
                    }`}
                  >
                    {completedDays.includes(day) ? <CheckCircle2 size={20} /> : day}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Award className="text-accent-yellow" />
          CONQUISTAS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-primary/20 to-accent-yellow/20 border-primary"
                  : "bg-dark-bg border-dark-border opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-3 rounded-lg ${achievement.unlocked ? "bg-primary text-white" : "bg-dark-card text-gray-500"}`}
                >
                  <achievement.icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                  {achievement.unlocked && (
                    <span className="inline-block mt-2 text-xs font-bold text-accent-green">✓ DESBLOQUEADO</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

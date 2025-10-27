"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronUp, Play, Flame } from "lucide-react"
import { useRouter } from "next/navigation"
import { completeDayAction } from "@/lib/actions/progress"
import type { WorkoutDay } from "@/lib/types/database"
import Link from "next/link"

interface WeekModuleProps {
  weekNumber: number
  title: string
  description: string
  totalDays: number
  days: WorkoutDay[]
  userId: string
  completedDays: number[]
  isLocked: boolean
  isActive: boolean
}

export function WeekModule({
  weekNumber,
  title,
  description,
  totalDays,
  days,
  userId,
  completedDays,
  isLocked,
  isActive,
}: WeekModuleProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [dayNotes, setDayNotes] = useState<{ [key: number]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Marca o dia como completo e atualiza o progresso
  const markDayComplete = async (day: number) => {
    if (!userId || isSubmitting) return

    setIsSubmitting(true)
    const result = await completeDayAction(day)

    if (result.error) {
      alert("Erro ao marcar dia como completo: " + result.error)
    }

    setIsSubmitting(false)
    router.refresh()
  }

  const handleNoteChange = (day: number, note: string) => {
    setDayNotes((prev) => ({
      ...prev,
      [day]: note,
    }))
  }

  // 🔒 Se a semana está bloqueada, mostra tela de bloqueio
  if (isLocked) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-dark-card via-dark-card to-gray-800/10 rounded-2xl p-8 border border-gray-700 opacity-60">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-black text-xl">
              {weekNumber}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black mb-1 text-gray-400">
                SEMANA {weekNumber}: {title}
              </h1>
              <p className="text-gray-500">{description}</p>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <Lock className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2 text-gray-400">Semana Bloqueada</h3>
            <p className="text-gray-500">Complete todos os treinos da semana anterior para desbloquear esta semana.</p>
          </div>
        </div>
      </div>
    )
  }

  // 🔥 Semana ativa (desbloqueada)
  return (
    <div className="space-y-6">
      <div
        className={`bg-gradient-to-br from-dark-card via-dark-card to-primary/10 rounded-2xl p-8 border border-dark-border ${
          isActive ? "animate-pulse shadow-xl shadow-primary/20" : ""
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center font-black text-xl ${
              isActive ? "animate-pulse" : ""
            }`}
          >
            {weekNumber}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black mb-1 flex items-center gap-2">
              SEMANA {weekNumber}: {title}
              {isActive && <Flame className="text-accent-yellow animate-pulse" size={24} />}
            </h1>
            <p className="text-gray-400">{description}</p>
          </div>
        </div>

        {/* Barra de progresso da semana */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{totalDays} treinos</span>
            <span className="text-primary font-bold">
              {Math.round(
                (completedDays.filter((d) => d >= (weekNumber - 1) * 7 + 1 && d <= weekNumber * 7).length / 7) * 100
              )}
              % completo
            </span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-yellow transition-all duration-500"
              style={{
                width: `${(completedDays.filter((d) => d >= (weekNumber - 1) * 7 + 1 && d <= weekNumber * 7).length / 7) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Lista de dias */}
      <div className="space-y-4">
        {days.map((day) => {
          const isExpanded = expandedDay === day.day
          const isCompleted = completedDays.includes(day.day)

          // Calcula se o dia anterior está completo (para desbloquear o próximo)
          const previousDayCompleted =
            day.day === 1 ? true : completedDays.includes(day.day - 1)

          // Calcula se a semana anterior está concluída
          const previousWeekEnd = (weekNumber - 1) * 7
          const previousWeekDays = completedDays.filter((d) => d <= previousWeekEnd).length
          const previousWeekCompleted = previousWeekDays >= previousWeekEnd

          // 🔒 Lógica de bloqueio correta
          const isLocked =
            weekNumber > 1 && !previousWeekCompleted
              ? true // semana anterior não concluída
              : day.day > (weekNumber - 1) * 7 + 1 && !previousDayCompleted

          return (
            <div
              key={day.day}
              className={`bg-dark-card border-2 rounded-xl overflow-hidden transition-all ${
                isCompleted
                  ? "border-accent-green/50"
                  : isLocked
                  ? "border-dark-border opacity-60"
                  : "border-dark-border"
              }`}
            >
              {/* Cabeçalho do dia */}
              <button
                onClick={() => !isLocked && setExpandedDay(isExpanded ? null : day.day)}
                disabled={isLocked}
                className="w-full p-6 flex items-center gap-4 hover:bg-white/5 transition-colors disabled:cursor-not-allowed"
              >
                {isCompleted ? (
                  <CheckCircle2 className="text-accent-green flex-shrink-0" size={28} />
                ) : isLocked ? (
                  <Lock className="text-gray-500 flex-shrink-0" size={28} />
                ) : (
                  <Circle className="text-gray-500 flex-shrink-0" size={28} />
                )}

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">
                      DIA {day.day} - {day.title}
                    </span>
                  </div>
                  {isLocked && <p className="text-sm text-gray-500">Complete o dia anterior para desbloquear</p>}
                </div>

                {!isLocked && (
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                )}
              </button>

              {/* Conteúdo expandido */}
              {isExpanded && !isLocked && (
                <div className="px-6 pb-6 space-y-4">
                  {day.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-start gap-3 p-4 bg-dark-bg rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold">{exercise.title}</h4>
                          {exercise.duration && (
                            <span className="text-sm text-gray-400 whitespace-nowrap">▶ {exercise.duration}</span>
                          )}
                        </div>

                        <Link
                          href={`/video/${day.day}`}
                          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-secondary-light transition-colors font-semibold"
                        >
                          <Play size={14} />
                          Assistir vídeo
                        </Link>
                      </div>
                    </div>
                  ))}

                  {/* Notas do dia */}
                  <div className="pt-4">
                    <label className="block text-sm font-semibold mb-2">📝 Notas do Dia:</label>
                    <textarea
                      value={dayNotes[day.day] || day.notes || ""}
                      onChange={(e) => handleNoteChange(day.day, e.target.value)}
                      placeholder="Como foi o treino? Alguma observação?"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary transition-colors"
                      rows={3}
                    />
                  </div>

                  {/* Botão marcar completo */}
                  {!isCompleted && (
                    <button
                      onClick={() => markDayComplete(day.day)}
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-lg font-bold transition-all bg-accent-green hover:bg-accent-green/90 text-black hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Salvando..." : "✓ MARCAR DIA COMO COMPLETO"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

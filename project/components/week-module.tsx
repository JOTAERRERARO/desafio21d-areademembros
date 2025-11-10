"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronUp, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLocalProgress } from "@/lib/hooks/use-local-progress"
import type { WorkoutDay } from "@/lib/types/database"
import Link from "next/link"
import { WeekCompletionModal } from "@/components/week-completion-modal"

interface WeekModuleProps {
  weekNumber: number
  title: string
  description: string
  totalDays: number
  days: WorkoutDay[]
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
  completedDays,
  isLocked,
  isActive,
}: WeekModuleProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [dayNotes, setDayNotes] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { completeDay } = useLocalProgress()
  const router = useRouter()
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [wasJustCompleted, setWasJustCompleted] = useState(false)

  const markDayComplete = async (day: number) => {
    if (isSubmitting) return
    setIsSubmitting(true)

    completeDay(day)

    // Check if week is now complete
    const startOfWeek = (weekNumber - 1) * 7 + 1
    const endOfWeek = weekNumber * 7
    const newCompletedDays = [...completedDays, day]
    const completedInThisWeek = newCompletedDays.filter((d) => d >= startOfWeek && d <= endOfWeek).length

    if (completedInThisWeek === 7 && !wasJustCompleted) {
      setWasJustCompleted(true)
      setTimeout(() => setShowCompletionModal(true), 500)
    }

    setIsSubmitting(false)
    router.refresh()
  }

  const handleNoteChange = (day: number, note: string) => {
    setDayNotes((prev) => ({ ...prev, [day]: note }))
  }

  if (isLocked) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-dark-card via-dark-card to-gray-800/10 rounded-2xl p-8 border border-gray-700 opacity-60">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-black text-xl">
              {weekNumber}
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black mb-1 text-gray-400">
                  SEMANA {weekNumber}: {title}
                </h1>
                <p className="text-gray-500">{description}</p>
              </div>
              <Lock className="text-gray-500" size={32} />
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

  const startOfWeek = (weekNumber - 1) * 7 + 1
  const endOfWeek = weekNumber * 7
  const completedInThisWeek = completedDays.filter((d) => d >= startOfWeek && d <= endOfWeek).length
  const weekProgressPct = Math.round((completedInThisWeek / 7) * 100)
  const isWeekCompleted = completedInThisWeek === 7

  return (
    <div className="space-y-6">
      {showCompletionModal && (
        <WeekCompletionModal
          dayNumber={endOfWeek}
          nextWeekUnlocked={weekNumber < 3}
          onClose={() => setShowCompletionModal(false)}
        />
      )}

      <div
        className={`bg-gradient-to-br from-dark-card via-dark-card to-primary/10 rounded-2xl p-8 border border-dark-border ${
          isActive ? "animate-pulse shadow-xl shadow-primary/20" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center font-black text-xl ${
                isActive ? "animate-pulse" : ""
              }`}
            >
              {weekNumber}
            </div>
            <div>
              <h1 className="text-2xl font-black mb-1 flex items-center gap-2">
                SEMANA {weekNumber}: {title}
              </h1>
              <p className="text-gray-400">{description}</p>
            </div>
          </div>

          <div className="flex items-center">
            {isWeekCompleted ? (
              <CheckCircle2 className="text-accent-green animate-pulse" size={32} />
            ) : isActive ? (
              <div className="text-accent-yellow animate-pulse text-2xl">🔥</div>
            ) : (
              <Lock className="text-gray-600" size={32} />
            )}
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{totalDays} treinos</span>
            <span className="text-primary font-bold">{weekProgressPct}% completo</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-yellow transition-all duration-500"
              style={{ width: `${weekProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {days.map((day) => {
          const isExpanded = expandedDay === day.day
          const isCompleted = completedDays.includes(day.day)
          const isFirstDayOfThisWeek = day.day === startOfWeek
          const previousDayDone = completedDays.includes(day.day - 1)
          const dayLocked = !isFirstDayOfThisWeek && !previousDayDone

          return (
            <div
              key={day.day}
              className={`bg-dark-card border-2 rounded-xl overflow-hidden transition-all ${
                isCompleted
                  ? "border-accent-green/50"
                  : dayLocked
                    ? "border-dark-border opacity-60"
                    : "border-dark-border"
              }`}
            >
              <button
                onClick={() => !dayLocked && setExpandedDay(isExpanded ? null : day.day)}
                disabled={dayLocked}
                className="w-full p-6 flex items-center gap-4 hover:bg-white/5 transition-colors disabled:cursor-not-allowed"
              >
                {isCompleted ? (
                  <CheckCircle2 className="text-accent-green flex-shrink-0" size={28} />
                ) : dayLocked ? (
                  <Lock className="text-gray-500 flex-shrink-0" size={28} />
                ) : (
                  <Circle className="text-gray-400 flex-shrink-0" size={28} />
                )}

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">
                      DIA {day.day} - {day.title}
                    </span>
                  </div>
                  {dayLocked && <p className="text-sm text-gray-500">Complete o dia anterior para desbloquear</p>}
                </div>

                {!dayLocked && (
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                )}
              </button>

              {isExpanded && !dayLocked && (
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

                  <div className="pt-4">
                    <label className="block text-sm font-semibold mb-2">📝 Notas do Dia:</label>
                    <textarea
                      value={dayNotes[day.day] ?? ""}
                      onChange={(e) => handleNoteChange(day.day, e.target.value)}
                      placeholder="Como foi o treino? Alguma observação?"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary transition-colors"
                      rows={3}
                    />
                  </div>

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

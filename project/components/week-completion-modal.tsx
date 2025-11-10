"use client"

import { useEffect, useState } from "react"
import { Trophy, ArrowRight, Zap } from "lucide-react"

interface WeekCompletionModalProps {
  dayNumber: number
  nextWeekUnlocked: boolean
  onClose: () => void
}

export function WeekCompletionModal({ dayNumber, nextWeekUnlocked, onClose }: WeekCompletionModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  const isLastDayOfWeek = dayNumber % 7 === 0
  const weekNumber = Math.ceil(dayNumber / 7)

  const getWeekTitle = (week: number) => {
    const titles: Record<number, string> = {
      1: "BASE E REATIVAÇÃO",
      2: "QUEIMA E DEFINIÇÃO",
      3: "PERFORMANCE MÁXIMA",
    }
    return titles[week] || ""
  }

  const getNextWeekTitle = (week: number) => {
    const titles: Record<number, string> = {
      1: "QUEIMA E DEFINIÇÃO",
      2: "PERFORMANCE MÁXIMA",
      3: "PROGRAMA COMPLETO",
    }
    return titles[week] || ""
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-500 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl shadow-primary/40 border border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://i.imgur.com/DoFBPr9.jpeg')] opacity-5 bg-cover" />
          <div className="relative z-10">
            <div className="flex justify-center mb-6 animate-bounce">
              <Trophy size={64} className="text-white drop-shadow-lg" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-center mb-4 text-white drop-shadow-lg">
              DIA {dayNumber} COMPLETO!
            </h1>

            <p className="text-center text-white/90 mb-6 text-lg font-semibold drop-shadow-lg">
              Parabéns! Você completou o treino de hoje 💪
            </p>

            {isLastDayOfWeek && (
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Zap className="text-accent-yellow animate-pulse" size={24} />
                  <p className="text-white text-center font-bold">SEMANA {weekNumber} CONCLUÍDA!</p>
                  <Zap className="text-accent-yellow animate-pulse" size={24} />
                </div>
                <p className="text-white text-center font-semibold">
                  Semana {weekNumber}: {getWeekTitle(weekNumber)}
                </p>
              </div>
            )}

            {nextWeekUnlocked && isLastDayOfWeek && (
              <div className="bg-accent-green/20 border border-accent-green/50 rounded-2xl p-6 mb-8 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <ArrowRight className="text-accent-green" size={24} />
                  <h3 className="font-black text-white">PRÓXIMA SEMANA DESBLOQUEADA!</h3>
                </div>
                <p className="text-white/90 font-semibold">
                  Semana {weekNumber + 1}:{" "}
                  <span className="text-accent-green font-black">{getNextWeekTitle(weekNumber + 1)}</span>
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-white text-black hover:bg-white/90 font-black py-4 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 text-lg shadow-lg"
            >
              CONTINUAR
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

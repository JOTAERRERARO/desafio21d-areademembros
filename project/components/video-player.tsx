"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, ChevronRight, Clock, Lock, AlertCircle } from "lucide-react"
import { useLocalProgress } from "@/lib/hooks/use-local-progress"
import type { WorkoutDay } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { WeekCompletionModal } from "@/components/week-completion-modal"
import { convertToEmbedUrl } from "@/lib/data/workout-data"

interface VideoPlayerProps {
  workoutDay: WorkoutDay
  isCompleted: boolean
  nextDay: WorkoutDay | undefined
  completedDays: number[]
}

export function VideoPlayer({ workoutDay, isCompleted, nextDay, completedDays }: VideoPlayerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(isCompleted)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [weekUnlocked, setWeekUnlocked] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const { completeDay, unlockedWeeks } = useLocalProgress()
  const router = useRouter()

  const handleIframeLoad = () => {
    setVideoLoaded(true)
  }

  const handleComplete = async () => {
    if (isSubmitting || localCompleted) return
    setIsSubmitting(true)

    const weekNumber = Math.ceil(workoutDay.day / 7)
    const isLastDayOfWeek = workoutDay.day % 7 === 0
    const nextWeekNumber = weekNumber + 1

    completeDay(workoutDay.day)
    setLocalCompleted(true)

    // Check if next week should be unlocked
    if (isLastDayOfWeek && nextWeekNumber <= 3 && !unlockedWeeks.includes(nextWeekNumber)) {
      setWeekUnlocked(true)
    }

    setIsSubmitting(false)
    setShowCompletionModal(true)
  }

  const handleNextDay = () => {
    if (nextDay) {
      router.push(`/video/${nextDay.day}`)
    } else {
      router.push("/dashboard")
    }
  }

  const handleCloseModal = () => {
    setShowCompletionModal(false)
    router.refresh()
  }

  const videoUrl = workoutDay.exercises[0]?.url || ""
  const embedUrl = videoUrl ? convertToEmbedUrl(videoUrl) : ""

  const isNextDayLocked = nextDay && !completedDays.includes(workoutDay.day)

  const isLastDay = workoutDay.day === 21
  const isLastDayOfWeek = workoutDay.day % 7 === 0

  return (
    <>
      <div className="min-h-screen bg-dark-bg">
        <div className="max-w-6xl mx-auto p-6">
          {/* Back button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </button>

          {/* Video player card */}
          <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
            <div className="aspect-video bg-black w-full relative">
              {!videoLoaded && embedUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-300 text-sm">Carregando vídeo...</p>
                  </div>
                </div>
              )}

              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                  className="w-full h-full"
                  title={workoutDay.title}
                  onLoad={handleIframeLoad}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <AlertCircle size={40} className="text-yellow-500" />
                  <p>Vídeo não disponível</p>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-light underline"
                  >
                    Abrir no YouTube
                  </a>
                </div>
              )}
            </div>

            {/* Content section */}
            <div className="p-6 space-y-6">
              {/* Title and badges */}
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    DIA {workoutDay.day}
                  </span>
                  {localCompleted && (
                    <span className="bg-accent-green text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      COMPLETO
                    </span>
                  )}
                  {isLastDay && (
                    <span className="bg-accent-yellow text-black text-xs font-bold px-3 py-1 rounded-full">
                      DESAFIO FINAL
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-2">{workoutDay.title}</h1>
                <p className="text-gray-400 text-lg">{workoutDay.description}</p>
              </div>

              {/* Duration info */}
              {workoutDay.exercises[0] && (
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span className="font-medium">{workoutDay.exercises[0].duration}</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!localCompleted && (
                  <Button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="flex-1 bg-accent-green hover:bg-accent-green/90 text-black font-bold py-6 text-lg rounded-lg transition-all hover:scale-105 active:scale-95"
                  >
                    {isSubmitting ? "Salvando..." : "✓ Marcar como Completo"}
                  </Button>
                )}

                {localCompleted && nextDay && (
                  <Button
                    onClick={handleNextDay}
                    className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-6 text-lg rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    Próximo Treino
                    <ChevronRight size={20} />
                  </Button>
                )}

                {localCompleted && !nextDay && (
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-6 text-lg rounded-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Voltar ao Dashboard
                  </Button>
                )}

                {isNextDayLocked && nextDay && (
                  <div className="flex-1 bg-gray-800/50 text-gray-400 font-bold py-6 text-lg rounded-lg flex items-center justify-center gap-2 cursor-not-allowed border border-gray-700">
                    <Lock size={20} />
                    Conclua este treino primeiro
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCompletionModal && (
        <WeekCompletionModal dayNumber={workoutDay.day} nextWeekUnlocked={weekUnlocked} onClose={handleCloseModal} />
      )}
    </>
  )
}

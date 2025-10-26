"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, ChevronRight, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import { completeDayAction } from "@/lib/actions/progress"
import type { WorkoutDay } from "@/lib/types/database"
import { Button } from "@/components/ui/button"

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false })

interface VideoPlayerProps {
  workoutDay: WorkoutDay
  isCompleted: boolean
  nextDay: WorkoutDay | undefined
  completedDays: number[]
}

export function VideoPlayer({
  workoutDay,
  isCompleted,
  nextDay,
  completedDays,
}: VideoPlayerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(isCompleted)
  const router = useRouter()

  const handleComplete = async () => {
    if (isSubmitting || localCompleted) return
    setIsSubmitting(true)

    const result = await completeDayAction(workoutDay.day)
    if (result.error) {
      alert("Erro ao marcar dia como completo: " + result.error)
      setIsSubmitting(false)
      return
    }

    setLocalCompleted(true)
    setIsSubmitting(false)
    router.refresh()
  }

  const handleNextDay = () => {
    if (nextDay) router.push(`/video/${nextDay.day}`)
    else router.push("/dashboard")
  }

  const videoUrl = workoutDay.exercises[0]?.url || ""

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Voltar ao Dashboard
        </button>

        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="aspect-video bg-black relative">
            {videoUrl ? (
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
                config={{
                  youtube: {
                    playerVars: {
                      origin: typeof window !== "undefined" ? window.location.origin : undefined,
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                    },
                  },
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Vídeo não disponível
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  DIA {workoutDay.day}
                </span>
                {localCompleted && (
                  <span className="bg-accent-green text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    COMPLETO
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black mb-2">{workoutDay.title}</h1>
              <p className="text-gray-400">{workoutDay.description}</p>
            </div>

            {workoutDay.exercises[0] && (
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{workoutDay.exercises[0].duration}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {!localCompleted && (
                <Button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex-1 bg-accent-green hover:bg-accent-green/90 text-black font-bold py-6 text-lg"
                >
                  {isSubmitting ? "Salvando..." : "✓ Marcar como Completo"}
                </Button>
              )}

              {nextDay && (
                <Button
                  onClick={handleNextDay}
                  disabled={!localCompleted && !completedDays.includes(workoutDay.day)}
                  className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-6 text-lg"
                >
                  Próximo Treino
                  <ChevronRight size={20} />
                </Button>
              )}

              {!nextDay && localCompleted && (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-6 text-lg"
                >
                  Voltar ao Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

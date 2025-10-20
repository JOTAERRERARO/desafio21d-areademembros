"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, ChevronRight, Clock } from "lucide-react"
import dynamic from "next/dynamic"
import { completeDayAction } from "@/lib/actions/progress"
import type { WorkoutDay } from "@/lib/types/database"
import { Button } from "@/components/ui/button"

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white">Carregando player...</div>
    </div>
  ),
})

interface VideoPlayerProps {
  workoutDay: WorkoutDay
  isCompleted: boolean
  nextDay: WorkoutDay | undefined
  completedDays: number[]
}

export function VideoPlayer({ workoutDay, isCompleted, nextDay, completedDays }: VideoPlayerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(isCompleted)
  const [playerError, setPlayerError] = useState<string | null>(null)
  const router = useRouter()

  const handleComplete = async () => {
    if (isSubmitting || localCompleted) return

    setIsSubmitting(true)
    
    try {
      const result = await completeDayAction(workoutDay.day)

      if (result.error) {
        alert("Erro ao marcar dia como completo: " + result.error)
        setIsSubmitting(false)
        return
      }

      setLocalCompleted(true)
      
      // Aguardar um pouco antes de atualizar para dar tempo do realtime sincronizar
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("Erro ao completar treino:", error)
      alert("Erro inesperado ao marcar treino como completo")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextDay = () => {
    if (nextDay) {
      router.push(`/video/${nextDay.day}`)
    } else {
      router.push("/dashboard")
    }
  }

  const videoUrl = workoutDay.exercises[0]?.url || ""
  
  // Verificar se a URL é válida
  const isValidUrl = videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"))

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
            {playerError ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                <p className="text-red-400 mb-2">Erro ao carregar o vídeo</p>
                <p className="text-sm">{playerError}</p>
                <button
                  onClick={() => {
                    setPlayerError(null)
                    router.refresh()
                  }}
                  className="mt-4 px-4 py-2 bg-primary rounded text-white hover:bg-primary-light"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : !isValidUrl ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <p>Vídeo não disponível ou URL inválida</p>
              </div>
            ) : (
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={false}
                light={false}
                onError={(error) => {
                  console.error("Erro no player:", error)
                  setPlayerError("Não foi possível carregar o vídeo. Verifique sua conexão.")
                }}
                config={{
                  youtube: {
                    playerVars: {
                      cc_lang_pref: "pt-BR", // Idioma preferencial da legenda
                      cc_load_policy: 1, // Forçar exibição da legenda
                      hl: "pt-BR", // Idioma da interface do player
                      rel: 0, // Não mostrar vídeos relacionados
                      modestbranding: 1, // Logo do YouTube menos visível
                    },
                  },
                }}
              />
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

            {workoutDay.exercises.length > 0 && (
              <div className="border-t border-dark-border pt-6">
                <h3 className="font-bold text-lg mb-4">Sobre este treino</h3>
                <div className="space-y-3">
                  {workoutDay.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-start gap-3 p-4 bg-dark-bg rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{exercise.title}</h4>
                        {exercise.duration && <p className="text-sm text-gray-400">Duração: {exercise.duration}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

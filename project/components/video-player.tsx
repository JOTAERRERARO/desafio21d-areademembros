/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, ChevronRight, Clock } from "lucide-react"
import { completeDayAction } from "@/lib/actions/progress"
import type { WorkoutDay } from "@/lib/types/database"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  workoutDay: WorkoutDay
  userId?: string
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
  const iframeRef = useRef<HTMLIFrameElement>(null)

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

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return ""
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
    const match = url.match(regex)
    return match
      ? `https://www.youtube.com/embed/${match[1]}?enablejsapi=1&modestbranding=1&rel=0&showinfo=0&cc_load_policy=1&cc_lang_pref=pt-BR&hl=pt-BR`
      : url
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  useEffect(() => {
    const onYouTubeIframeAPIReady = () => {
      const player = new (window as any).YT.Player(iframeRef.current, {
        events: {
          onReady: (event: any) => {
            try {
              event.target.setOption("captions", "track", { languageCode: "pt" })
              event.target.setOption("cc", "track", { languageCode: "pt" })
            } catch (e) {
              console.warn("⚠️ Legendas automáticas não disponíveis para este vídeo.")
            }
          },
        },
      })
    }

    if (!(window as any).YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
      ;(window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady
    } else {
      onYouTubeIframeAPIReady()
    }
  }, [embedUrl])

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
            {embedUrl ? (
              <iframe
                ref={iframeRef}
                src={embedUrl}
                width="100%"
                height="100%"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
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

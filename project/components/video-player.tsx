"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, ChevronRight, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useLocalProgress } from "@/lib/hooks/use-local-progress"
import type { WorkoutDay } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { WeekCompletionModal } from "@/components/week-completion-modal"
import { convertToEmbedUrl, addPortugueseParameters } from "@/lib/data/workout-data"

export function VideoPlayer({
  workoutDay,
  isCompleted,
  nextDay,
  completedDays,
}: {
  workoutDay: WorkoutDay
  isCompleted: boolean
  nextDay: WorkoutDay | undefined
  completedDays: number[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(isCompleted)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [weekUnlocked, setWeekUnlocked] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [dayNotes, setDayNotes] = useState("")
  const [isNotesExpanded, setIsNotesExpanded] = useState(false)
  const router = useRouter()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { completeDay, unlockedWeeks } = useLocalProgress()

  useEffect(() => setLocalCompleted(isCompleted), [isCompleted])

  const rawUrl = workoutDay.exercises[0]?.url || ""
  const embedBase = convertToEmbedUrl(rawUrl)
  const embedUrl = addPortugueseParameters(embedBase)

  // ✅ parâmetros máximos permitidos para forçar legendas e português
  const finalUrl = embedUrl.includes("?")
    ? `${embedUrl}&enablejsapi=1&modestbranding=1&rel=0&autoplay=1&mute=0`
    : `${embedUrl}?enablejsapi=1&modestbranding=1&rel=0&autoplay=1&mute=0`

  // ✅ tenta inicializar player e ativar legendas se disponíveis
  useEffect(() => {
    const initYT = () => {
      const player = new (window as any).YT.Player("video-frame", {
        events: {
          onReady: (event: any) => {
            try {
              event.target.unMute()
              event.target.playVideo()
              event.target.loadModule("captions")
              event.target.setOption("captions", "track", { languageCode: "pt" })
            } catch (err) {
              console.warn("⚠️ Legendas automáticas não disponíveis:", err)
            }
          },
        },
      })
    }

    if (!(window as any).YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(tag)
      ;(window as any).onYouTubeIframeAPIReady = initYT
    } else {
      initYT()
    }
  }, [finalUrl])

  const handleComplete = () => {
    if (isSubmitting || localCompleted) return
    setIsSubmitting(true)

    try {
      completeDay(workoutDay.day)
      setLocalCompleted(true)

      const weekNumber = Math.ceil(workoutDay.day / 7)
      const isLastDayOfWeek = workoutDay.day % 7 === 0
      const nextWeek = weekNumber + 1
      if (isLastDayOfWeek && nextWeek <= 3 && !unlockedWeeks.includes(nextWeek)) setWeekUnlocked(true)

      setShowCompletionModal(true)
      setTimeout(() => {
        if (nextDay) router.push(`/video/${nextDay.day}`)
        else router.push("/dashboard")
      }, 1500)
    } catch (e) {
      console.error(e)
      alert("Erro ao marcar dia como completo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextDay = () => (nextDay ? router.push(`/video/${nextDay.day}`) : router.push("/dashboard"))

  return (
    <>
      <div className="min-h-screen bg-dark-bg">
        <div className="max-w-6xl mx-auto p-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </button>

          <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
            <div className="aspect-video bg-black relative">
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-300 text-sm">Carregando vídeo...</p>
                  </div>
                </div>
              )}

              <iframe
                id="video-frame"
                ref={iframeRef}
                src={finalUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                width="100%"
                height="100%"
                className="w-full h-full"
                onLoad={() => setVideoLoaded(true)}
              />
            </div>

            <div className="p-6 space-y-6">
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
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-2">{workoutDay.title}</h1>
                <p className="text-gray-400 text-lg">{workoutDay.description}</p>
              </div>

              {workoutDay.exercises[0] && (
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <Clock size={16} />
                  <span>{workoutDay.exercises[0].duration}</span>
                </div>
              )}

              {/* Notas */}
              {!localCompleted && (
                <div className="bg-dark-bg border border-dark-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <label className="text-sm font-semibold cursor-pointer">📝 Notas do Dia:</label>
                    {isNotesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {isNotesExpanded && (
                    <div className="px-4 pb-4 border-t border-dark-border space-y-4">
                      <textarea
                        value={dayNotes}
                        onChange={(e) => setDayNotes(e.target.value)}
                        placeholder="Como foi o treino?"
                        className="w-full bg-dark-card border border-dark-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-primary"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {!localCompleted && (
                  <Button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="flex-1 bg-accent-green hover:bg-accent-green/90 text-black font-bold py-6 text-lg rounded-lg"
                  >
                    {isSubmitting ? "Salvando..." : "✓ Marcar como completo"}
                  </Button>
                )}
                {localCompleted && nextDay && (
                  <Button
                    onClick={handleNextDay}
                    className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-6 text-lg rounded-lg flex items-center justify-center gap-2"
                  >
                    Próximo Treino
                    <ChevronRight size={20} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCompletionModal && (
        <WeekCompletionModal dayNumber={workoutDay.day} nextWeekUnlocked={weekUnlocked} onClose={() => setShowCompletionModal(false)} />
      )}
    </>
  )
}

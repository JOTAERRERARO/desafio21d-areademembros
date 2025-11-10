"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/video-player"
import { useLocalProgress } from "@/lib/hooks/use-local-progress"
import { week1Days, week2Days, week3Days } from "@/lib/data/workout-data"

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("")
  const [dayNumber, setDayNumber] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const { completedDays, unlockedWeeks, isLoaded } = useLocalProgress()
  const router = useRouter()

  useEffect(() => {
    const handleInit = async () => {
      const { id: paramId } = await params
      setId(paramId)

      const num = Number.parseInt(paramId)
      if (isNaN(num) || num < 1 || num > 21) {
        router.push("/dashboard")
        return
      }

      setDayNumber(num)
      setLoaded(true)
    }

    handleInit()
  }, [params, router])

  if (!loaded || !isLoaded) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando treino...</p>
        </div>
      </div>
    )
  }

  const allDays = [...week1Days, ...week2Days, ...week3Days]
  const workoutDay = allDays.find((d) => d.day === dayNumber)

  if (!workoutDay) {
    router.push("/dashboard")
    return null
  }

  const weekNumber = Math.ceil(dayNumber / 7)
  const isWeekUnlocked = unlockedWeeks.includes(weekNumber)
  const isDayCompleted = completedDays.includes(dayNumber)

  const isFirstDayOfWeek = dayNumber % 7 === 1
  const isPreviousDayCompleted = dayNumber === 1 || completedDays.includes(dayNumber - 1)
  const isDayAccessible = isFirstDayOfWeek || isPreviousDayCompleted

  const isLocked = !isWeekUnlocked || !isDayAccessible

  if (isLocked) {
    router.push("/dashboard")
    return null
  }

  const isCompleted = completedDays.includes(dayNumber)
  const nextDay = allDays.find((d) => d.day === dayNumber + 1)

  return (
    <VideoPlayer workoutDay={workoutDay} isCompleted={isCompleted} nextDay={nextDay} completedDays={completedDays} />
  )
}

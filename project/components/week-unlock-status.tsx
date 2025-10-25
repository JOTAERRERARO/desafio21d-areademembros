"use client"

import { useEffect, useState } from "react"
import { Lock, CheckCircle } from "lucide-react"

interface WeekProgress {
  week1Completed: boolean
  week2Completed: boolean
  week3Unlocked: boolean
  totalCompleted: number
}

export function WeekUnlockStatus() {
  const [progress, setProgress] = useState<WeekProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch("/api/progress/summary")
        if (response.ok) {
          const data = await response.json()
          setProgress(data)
        }
      } catch (error) {
        console.error("Erro ao buscar progresso:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (loading) {
    return <div className="text-gray-400">Carregando progresso...</div>
  }

  if (!progress) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Status das Semanas</h3>
      
      <div className="space-y-3">
        {/* Semana 1 */}
        <div className="flex items-center gap-3 p-3 bg-dark-card rounded-lg border border-dark-border">
          {progress.week1Completed ? (
            <CheckCircle className="text-accent-green" size={24} />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-primary" />
          )}
          <div className="flex-1">
            <div className="font-bold">Semana 1</div>
            <div className="text-sm text-gray-400">
              {progress.week1Completed ? "Completa" : "Em andamento"}
            </div>
          </div>
        </div>

        {/* Semana 2 */}
        <div className="flex items-center gap-3 p-3 bg-dark-card rounded-lg border border-dark-border">
          {progress.week2Completed ? (
            <CheckCircle className="text-accent-green" size={24} />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-primary" />
          )}
          <div className="flex-1">
            <div className="font-bold">Semana 2</div>
            <div className="text-sm text-gray-400">
              {progress.week2Completed ? "Completa" : "Em andamento"}
            </div>
          </div>
        </div>

        {/* Semana 3 */}
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${
          progress.week3Unlocked 
            ? "bg-gradient-to-r from-primary/20 to-accent-yellow/20 border-primary" 
            : "bg-dark-card border-dark-border opacity-50"
        }`}>
          {progress.week3Unlocked ? (
            <CheckCircle className="text-primary" size={24} />
          ) : (
            <Lock className="text-gray-500" size={24} />
          )}
          <div className="flex-1">
            <div className="font-bold">Semana 3</div>
            <div className="text-sm text-gray-400">
              {progress.week3Unlocked 
                ? "Desbloqueada! 🎉" 
                : "Complete as semanas 1 e 2 para desbloquear"}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary">
        <div className="text-2xl font-black text-primary">
          {progress.totalCompleted}/21
        </div>
        <div className="text-sm text-gray-400">Dias Completos</div>
      </div>
    </div>
  )
}


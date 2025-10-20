"use client"

import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { calculateUserProgress, type UserProgress as CalculatedProgress } from "@/lib/utils/progress"
import type { ExerciseProgress } from "@/lib/types/database"

interface ProgressContextValue {
  completedExercises: ExerciseProgress[]
  completedDays: number[]
  progress: CalculatedProgress
  loading: boolean
  refresh: () => Promise<void>
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined)

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider")
  return ctx
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [completedExercises, setCompletedExercises] = useState<ExerciseProgress[]>([])
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estado inicial SEGURO - sempre com valores definidos
  const [progress, setProgress] = useState<CalculatedProgress>({
    currentDay: 1,
    activeWeek: 1,
    nextUncompletedDay: 1,
    weeks: [
      { weekNumber: 1, isLocked: false, isActive: true, isCompleted: false, completedDays: 0, totalDays: 7, progress: 0 },
      { weekNumber: 2, isLocked: true, isActive: false, isCompleted: false, completedDays: 0, totalDays: 7, progress: 0 },
      { weekNumber: 3, isLocked: true, isActive: false, isCompleted: false, completedDays: 0, totalDays: 7, progress: 0 },
    ],
    totalProgress: 0,
    streak: 0,
  })

  const compute = useCallback((exercises: ExerciseProgress[]) => {
    const calculated = calculateUserProgress(exercises)
    setProgress(calculated)
    
    // Extrair dias únicos completos para compatibilidade com código existente
    const uniqueDays = Array.from(
      new Set(exercises.map((ex) => ex.day_number))
    ).sort((a, b) => a - b)
    setCompletedDays(uniqueDays)
  }, [])

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      // Buscar da tabela exercise_progress em vez de user_progress
      const { data, error } = await supabase
        .from("exercise_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: true })

      if (error) {
        console.error("Erro ao buscar progresso:", error)
        // Manter estado inicial seguro mesmo em caso de erro
        setCompletedExercises([])
        compute([])
      } else {
        // Garantir que data seja um array, mesmo que seja null
        const exercises = data || []
        setCompletedExercises(exercises)
        compute(exercises)
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar progresso:", error)
      setCompletedExercises([])
      compute([])
    } finally {
      setLoading(false)
    }
  }, [compute, supabase])

  useEffect(() => {
    // initial load - call refresh once on mount
    let mounted = true
    const loadInitialData = async () => {
      if (mounted) {
        await refresh()
      }
    }
    loadInitialData()
    
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run on mount

  useEffect(() => {
    // realtime subscription para exercise_progress
    const channel = supabase
      .channel("exercise_progress_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "exercise_progress" },
        () => {
          refresh()
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "exercise_progress" },
        () => {
          refresh()
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "exercise_progress" },
        () => {
          refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, refresh])

  const value: ProgressContextValue = {
    completedExercises,
    completedDays,
    progress,
    loading,
    refresh,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}


"use client"

import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { calculateUserProgress, type UserProgress as CalculatedProgress } from "@/lib/utils/progress"
import type { ExerciseProgress } from "@/lib/types/database"

interface ProgressContextValue {
  completedExercises: ExerciseProgress[]
  completedDays: number[]
  progress: CalculatedProgress | null
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
  const [progress, setProgress] = useState<CalculatedProgress | null>(null)

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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Buscar da tabela exercise_progress em vez de user_progress
    const { data, error } = await supabase
      .from("exercise_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: true })

    if (!error && data) {
      setCompletedExercises(data)
      compute(data)
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
    refresh,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}


"use client"

import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { calculateUserProgress, type UserProgress as CalculatedProgress } from "@/lib/utils/progress"

interface ProgressContextValue {
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
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [progress, setProgress] = useState<CalculatedProgress | null>(null)

  const compute = useCallback((days: number[]) => {
    setProgress(calculateUserProgress(days))
  }, [])

  const refresh = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("user_progress")
      .select("day_number")
      .eq("user_id", user.id)
      .order("day_number", { ascending: true })

    if (!error && data) {
      const days = data.map((d) => d.day_number)
      setCompletedDays(days)
      compute(days)
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
    // realtime subscription
    const channel = supabase
      .channel("user_progress_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_progress" },
        () => {
          refresh()
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "user_progress" },
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
    completedDays,
    progress,
    refresh,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}


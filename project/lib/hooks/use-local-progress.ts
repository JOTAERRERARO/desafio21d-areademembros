"use client"

import { useEffect, useState, useCallback } from "react"

export interface LocalProgress {
  completedDays: number[]
  unlockedWeeks: number[] // 1, 2, 3
  updatedAt: string
}

const STORAGE_KEY = "desafio21d_progress"
const DEFAULT_PROGRESS: LocalProgress = {
  completedDays: [],
  unlockedWeeks: [1], // Week 1 starts unlocked
  updatedAt: new Date().toISOString(),
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<LocalProgress>(DEFAULT_PROGRESS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setProgress(JSON.parse(stored))
      }
    } catch (error) {
      console.error("[v0] Failed to load progress from localStorage:", error)
    }
    setIsLoaded(true)
  }, [])

  // Save progress to localStorage whenever it changes
  const saveProgress = useCallback((completedDays: number[], unlockedWeeks: number[]) => {
    const newProgress: LocalProgress = {
      completedDays: Array.from(new Set(completedDays)).sort((a, b) => a - b),
      unlockedWeeks: Array.from(new Set(unlockedWeeks)).sort((a, b) => a - b),
      updatedAt: new Date().toISOString(),
    }
    setProgress(newProgress)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
    } catch (error) {
      console.error("[v0] Failed to save progress to localStorage:", error)
    }
  }, [])

  const completeDay = useCallback((day: number) => {
    setProgress((prev) => {
      const updated = Array.from(new Set([...prev.completedDays, day])).sort((a, b) => a - b)
      const newUnlockedWeeks = [...prev.unlockedWeeks]

      if (day === 7 && !newUnlockedWeeks.includes(2)) {
        newUnlockedWeeks.push(2)
      } else if (day === 14 && !newUnlockedWeeks.includes(3)) {
        newUnlockedWeeks.push(3)
      }

      const newProgress: LocalProgress = {
        completedDays: updated,
        unlockedWeeks: newUnlockedWeeks.sort((a, b) => a - b),
        updatedAt: new Date().toISOString(),
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
      } catch (error) {
        console.error("[v0] Failed to save day completion:", error)
      }
      return newProgress
    })
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("[v0] Failed to reset progress:", error)
    }
  }, [])

  return {
    progress,
    isLoaded,
    saveProgress,
    completeDay,
    resetProgress,
    completedDays: progress.completedDays,
    unlockedWeeks: progress.unlockedWeeks,
  }
}

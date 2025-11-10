import { week1Days, week2Days, week3Days } from "@/lib/data/workout-data"
import type { WorkoutDay } from "@/lib/types/database"

export interface WeekProgress {
  weekNumber: number
  isLocked: boolean
  isActive: boolean
  isCompleted: boolean
  completedDays: number
  totalDays: number
  progress: number
}

export interface UserProgress {
  currentDay: number
  activeWeek: number
  nextUncompletedDay: number | null
  weeks: WeekProgress[]
  totalProgress: number
}

export function calculateUserProgress(completedDays: number[], unlockedWeeks: number[] = [1]): UserProgress {
  // Define 3 semanas fixas
  const weeks: WeekProgress[] = [
    {
      weekNumber: 1,
      isLocked: false,
      isActive: false,
      isCompleted: false,
      completedDays: 0,
      totalDays: 7,
      progress: 0,
    },
    {
      weekNumber: 2,
      isLocked: !unlockedWeeks.includes(2),
      isActive: false,
      isCompleted: false,
      completedDays: 0,
      totalDays: 7,
      progress: 0,
    },
    {
      weekNumber: 3,
      isLocked: !unlockedWeeks.includes(3),
      isActive: false,
      isCompleted: false,
      completedDays: 0,
      totalDays: 7,
      progress: 0,
    },
  ]

  // Conta quantos dias completos por semana
  weeks[0].completedDays = completedDays.filter((d) => d >= 1 && d <= 7).length
  weeks[1].completedDays = completedDays.filter((d) => d >= 8 && d <= 14).length
  weeks[2].completedDays = completedDays.filter((d) => d >= 15 && d <= 21).length

  // Calcula progresso e status de cada semana
  weeks.forEach((week) => {
    week.progress = (week.completedDays / week.totalDays) * 100
    week.isCompleted = week.completedDays === week.totalDays
  })

  // Define qual semana está ativa
  let activeWeek = 1
  for (let i = 0; i < weeks.length; i++) {
    const w = weeks[i]
    if (!w.isLocked && !w.isCompleted) {
      w.isActive = true
      activeWeek = w.weekNumber
      break
    }
  }

  // Caso todas estejam completas
  if (weeks.every((w) => w.isCompleted)) {
    weeks[2].isActive = true
    activeWeek = 3
  }

  // Próximo dia não concluído
  let nextUncompletedDay: number | null = null
  for (let day = 1; day <= 21; day++) {
    if (!completedDays.includes(day)) {
      nextUncompletedDay = day
      break
    }
  }

  const currentDay = nextUncompletedDay || 21
  const totalProgress = Math.round((completedDays.length / 21) * 100)

  return { currentDay, activeWeek, nextUncompletedDay, weeks, totalProgress }
}

export function findNextUncompletedWorkout(completedDays: number[]): string {
  const progress = calculateUserProgress(completedDays)
  if (progress.nextUncompletedDay === null) return "/dashboard"
  return `/video/${progress.nextUncompletedDay}`
}

export function getWorkoutDay(dayNumber: number): WorkoutDay | undefined {
  const allDays = [...week1Days, ...week2Days, ...week3Days]
  return allDays.find((d) => d.day === dayNumber)
}

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

export function calculateUserProgress(completedDays: number[]): UserProgress {
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
      isLocked: true,
      isActive: false,
      isCompleted: false,
      completedDays: 0,
      totalDays: 7,
      progress: 0,
    },
    {
      weekNumber: 3,
      isLocked: true,
      isActive: false,
      isCompleted: false,
      completedDays: 0,
      totalDays: 7,
      progress: 0,
    },
  ]

  // Contagem de dias completos
  weeks[0].completedDays = completedDays.filter((d) => d >= 1 && d <= 7).length
  weeks[1].completedDays = completedDays.filter((d) => d >= 8 && d <= 14).length
  weeks[2].completedDays = completedDays.filter((d) => d >= 15 && d <= 21).length

  // Progresso e status
  weeks.forEach((week) => {
    week.progress = (week.completedDays / week.totalDays) * 100
    week.isCompleted = week.completedDays === week.totalDays
  })

  // 🔓 Lógica de desbloqueio forçada e à prova de erro
  weeks[1].isLocked = !weeks[0].isCompleted
  weeks[2].isLocked = !(weeks[0].isCompleted && weeks[1].isCompleted)

  // Reforço absoluto (força desbloqueio da 3 se 1 e 2 completas)
  if (weeks[0].isCompleted && weeks[1].isCompleted) {
    weeks[2].isLocked = false
  }

  // Define a semana ativa
  let activeWeek = 1
  for (let i = 0; i < weeks.length; i++) {
    if (!weeks[i].isCompleted && !weeks[i].isLocked) {
      activeWeek = weeks[i].weekNumber
      weeks[i].isActive = true
      break
    }
  }

  // Se todas concluídas
  if (weeks.every((w) => w.isCompleted)) {
    activeWeek = 3
    weeks[2].isActive = true
  }

  // Garante que nenhuma ativa esteja bloqueada
  weeks.forEach((w) => {
    if (w.isLocked && w.isActive) w.isActive = false
  })

  // Próximo dia
  let nextUncompletedDay: number | null = null
  for (let day = 1; day <= 21; day++) {
    if (!completedDays.includes(day)) {
      nextUncompletedDay = day
      break
    }
  }

  const currentDay = nextUncompletedDay || Math.min(completedDays.length + 1, 21)
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

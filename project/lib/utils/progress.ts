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

/**
 * Calcula o progresso completo do usuário com base nos dias concluídos.
 * Esta função é a fonte de verdade de toda a lógica de progresso.
 */
export function calculateUserProgress(completedDays: number[]): UserProgress {
  // Configuração inicial das semanas
  const weeks: WeekProgress[] = [
    {
      weekNumber: 1,
      isLocked: false, // Semana 1 sempre liberada
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

  // Calcula dias completos por semana
  weeks[0].completedDays = completedDays.filter((d) => d >= 1 && d <= 7).length
  weeks[1].completedDays = completedDays.filter((d) => d >= 8 && d <= 14).length
  weeks[2].completedDays = completedDays.filter((d) => d >= 15 && d <= 21).length

  // Calcula porcentagem e status de conclusão
  weeks.forEach((week) => {
    week.progress = (week.completedDays / week.totalDays) * 100
    week.isCompleted = week.completedDays === week.totalDays
  })

  // 🔒 Corrige desbloqueio das semanas
  // Semana 2 só libera quando a 1 estiver concluída
  weeks[1].isLocked = !weeks[0].isCompleted
  // Semana 3 só libera quando a 1 e 2 estiverem concluídas
  weeks[2].isLocked = !(weeks[0].isCompleted && weeks[1].isCompleted)

  // Define semana ativa (primeira não concluída e não bloqueada)
  let activeWeek = 1
  for (let i = 0; i < weeks.length; i++) {
    if (!weeks[i].isCompleted && !weeks[i].isLocked) {
      activeWeek = weeks[i].weekNumber
      weeks[i].isActive = true
      break
    }
  }

  // Se todas concluídas, mantém a última ativa
  if (weeks.every((w) => w.isCompleted)) {
    activeWeek = 3
    weeks[2].isActive = true
  }

  // Garante que nenhuma semana ativa esteja bloqueada
  weeks.forEach((w) => {
    if (w.isLocked && w.isActive) w.isActive = false
  })

  // Encontra próximo treino não concluído
  let nextUncompletedDay: number | null = null
  for (let day = 1; day <= 21; day++) {
    if (!completedDays.includes(day)) {
      nextUncompletedDay = day
      break
    }
  }

  // Dia atual
  const currentDay = nextUncompletedDay || Math.min(completedDays.length + 1, 21)

  // Progresso total
  const totalProgress = Math.round((completedDays.length / 21) * 100)

  return {
    currentDay,
    activeWeek,
    nextUncompletedDay,
    weeks,
    totalProgress,
  }
}

/**
 * Retorna o link do próximo treino não concluído
 */
export function findNextUncompletedWorkout(completedDays: number[]): string {
  const progress = calculateUserProgress(completedDays)

  if (progress.nextUncompletedDay === null) {
    // Todos concluídos → volta ao painel
    return "/dashboard"
  }

  return `/video/${progress.nextUncompletedDay}`
}

/**
 * Retorna o treino correspondente a um dia específico
 */
export function getWorkoutDay(dayNumber: number): WorkoutDay | undefined {
  const allDays = [...week1Days, ...week2Days, ...week3Days]
  return allDays.find((d) => d.day === dayNumber)
}

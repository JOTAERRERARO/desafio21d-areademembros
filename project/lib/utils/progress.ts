import { week1Days, week2Days, week3Days } from "@/lib/data/workout-data"
import type { WorkoutDay, ExerciseProgress } from "@/lib/types/database"

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
  streak: number
}

/**
 * Calcula a streak (dias consecutivos) baseado nas datas de conclusão
 * Esta é a "fonte da verdade" para o cálculo de streak
 */
export function calculateStreak(completedExercises: ExerciseProgress[]): number {
  if (completedExercises.length === 0) return 0

  // Extrair apenas as datas (sem horas) e remover duplicatas
  const uniqueDates = Array.from(
    new Set(
      completedExercises.map((ex) => {
        const date = new Date(ex.completed_at)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
      })
    )
  ).sort((a, b) => b - a) // Ordenar da mais recente para a mais antiga

  if (uniqueDates.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const mostRecentDate = new Date(uniqueDates[0])
  
  // Se a data mais recente não é hoje nem ontem, a streak foi quebrada
  if (mostRecentDate.getTime() !== today.getTime() && mostRecentDate.getTime() !== yesterday.getTime()) {
    return 0
  }

  let streak = 1
  let currentDate = mostRecentDate

  // Verificar dias consecutivos
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i])
    const expectedPrevDate = new Date(currentDate)
    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1)

    if (prevDate.getTime() === expectedPrevDate.getTime()) {
      streak++
      currentDate = prevDate
    } else {
      break // Streak quebrada
    }
  }

  return streak
}

/**
 * Verifica se um dia está completo baseado nos exercícios concluídos
 * Um dia só está completo se TODOS os seus exercícios foram concluídos
 */
function isDayCompleted(dayData: WorkoutDay, completedExerciseIds: Set<string>): boolean {
  return dayData.exercises.every((ex) => completedExerciseIds.has(ex.id))
}

/**
 * Calcula o estado completo de progresso baseado nos exercícios concluídos do Supabase
 * Esta é a "fonte da verdade" única para todo o progresso do sistema
 * 
 * LÓGICA:
 * 1. Um DIA é completo somente se TODOS os exercícios foram concluídos
 * 2. Uma SEMANA é completa somente se TODOS os dias foram concluídos
 * 3. Semana 2 desbloqueia quando Semana 1 está COMPLETA
 * 4. Semana 3 desbloqueia quando Semana 2 está COMPLETA
 * 5. A semana ativa é a primeira não completa e não bloqueada
 */
export function calculateUserProgress(completedExercises: ExerciseProgress[]): UserProgress {
  const completedExerciseIds = new Set(completedExercises.map((ex) => ex.exercise_id))
  
  // Calcular dias completos por semana baseado em EXERCÍCIOS concluídos
  const week1CompletedDays = week1Days.filter((day) => isDayCompleted(day, completedExerciseIds))
  const week2CompletedDays = week2Days.filter((day) => isDayCompleted(day, completedExerciseIds))
  const week3CompletedDays = week3Days.filter((day) => isDayCompleted(day, completedExerciseIds))

  // Calcular progresso de cada semana
  const weeks: WeekProgress[] = [
    {
      weekNumber: 1,
      isLocked: false, // Semana 1 sempre desbloqueada
      isActive: false,
      isCompleted: week1CompletedDays.length === week1Days.length,
      completedDays: week1CompletedDays.length,
      totalDays: week1Days.length,
      progress: Math.round((week1CompletedDays.length / week1Days.length) * 100),
    },
    {
      weekNumber: 2,
      isLocked: true, // Será atualizado abaixo
      isActive: false,
      isCompleted: week2CompletedDays.length === week2Days.length,
      completedDays: week2CompletedDays.length,
      totalDays: week2Days.length,
      progress: Math.round((week2CompletedDays.length / week2Days.length) * 100),
    },
    {
      weekNumber: 3,
      isLocked: true, // Será atualizado abaixo
      isActive: false,
      isCompleted: week3CompletedDays.length === week3Days.length,
      completedDays: week3CompletedDays.length,
      totalDays: week3Days.length,
      progress: Math.round((week3CompletedDays.length / week3Days.length) * 100),
    },
  ]

  // Determinar status de bloqueio
  // Semana 2 desbloqueia quando Semana 1 está COMPLETA
  weeks[1].isLocked = !weeks[0].isCompleted
  // Semana 3 desbloqueia quando Semana 2 está COMPLETA
  weeks[2].isLocked = !weeks[1].isCompleted

  // Determinar semana ativa (primeira semana não completa e não bloqueada)
  let activeWeek = 1
  for (let i = 0; i < weeks.length; i++) {
    if (!weeks[i].isCompleted && !weeks[i].isLocked) {
      activeWeek = weeks[i].weekNumber
      weeks[i].isActive = true
      break
    }
  }

  // Se todas as semanas estiverem completas, a última é ativa
  if (weeks.every((w) => w.isCompleted)) {
    activeWeek = 3
    weeks[2].isActive = true
  }

  // Encontrar próximo dia não completo
  const allDays = [...week1Days, ...week2Days, ...week3Days]
  let nextUncompletedDay: number | null = null
  for (const day of allDays) {
    if (!isDayCompleted(day, completedExerciseIds)) {
      nextUncompletedDay = day.day
      break
    }
  }

  // Calcular dia atual
  const totalCompletedDays = week1CompletedDays.length + week2CompletedDays.length + week3CompletedDays.length
  const currentDay = nextUncompletedDay || Math.min(totalCompletedDays + 1, 21)

  // Calcular progresso total
  const totalProgress = Math.round((totalCompletedDays / 21) * 100)

  // Calcular streak
  const streak = calculateStreak(completedExercises)

  return {
    currentDay,
    activeWeek,
    nextUncompletedDay,
    weeks,
    totalProgress,
    streak,
  }
}

/**
 * Encontra o próximo treino não concluído e retorna sua URL
 */
export function findNextUncompletedWorkout(completedExercises: ExerciseProgress[]): string {
  const progress = calculateUserProgress(completedExercises)

  if (progress.nextUncompletedDay === null) {
    // Todos os treinos concluídos, retornar ao dashboard
    return "/dashboard"
  }

  return `/video/${progress.nextUncompletedDay}`
}

/**
 * Obtém os dados do dia de treino para um número de dia específico
 */
export function getWorkoutDay(dayNumber: number): WorkoutDay | undefined {
  const allDays = [...week1Days, ...week2Days, ...week3Days]
  return allDays.find((d) => d.day === dayNumber)
}

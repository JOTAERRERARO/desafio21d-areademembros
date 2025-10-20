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
 * Calculates the complete user progress state from completed days array
 * This is the single source of truth for all progress-related logic
 */
export function calculateUserProgress(completedDays: number[]): UserProgress {
  const allDays = [...week1Days, ...week2Days, ...week3Days]

  // Calculate progress for each week
  const weeks: WeekProgress[] = [
    {
      weekNumber: 1,
      isLocked: false, // Week 1 is always unlocked
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

  // Calculate completed days for each week
  weeks[0].completedDays = completedDays.filter((d) => d >= 1 && d <= 7).length
  weeks[1].completedDays = completedDays.filter((d) => d >= 8 && d <= 14).length
  weeks[2].completedDays = completedDays.filter((d) => d >= 15 && d <= 21).length

  // Calculate progress percentage
  weeks.forEach((week) => {
    week.progress = (week.completedDays / week.totalDays) * 100
    week.isCompleted = week.completedDays === week.totalDays
  })

  // Determine unlock status
  // Week 2 unlocks when Week 1 is completed
  weeks[1].isLocked = !weeks[0].isCompleted
  // Week 3 unlocks when Week 2 is completed
  weeks[2].isLocked = !weeks[1].isCompleted

  // Determine active week (first week that is not completed and not locked)
  let activeWeek = 1
  for (let i = 0; i < weeks.length; i++) {
    if (!weeks[i].isCompleted && !weeks[i].isLocked) {
      activeWeek = weeks[i].weekNumber
      weeks[i].isActive = true
      break
    }
  }

  // If all weeks are completed, the last week is active
  if (weeks.every((w) => w.isCompleted)) {
    activeWeek = 3
    weeks[2].isActive = true
  }

  // Find next uncompleted workout
  let nextUncompletedDay: number | null = null
  for (let day = 1; day <= 21; day++) {
    if (!completedDays.includes(day)) {
      nextUncompletedDay = day
      break
    }
  }

  // Calculate current day (next day to complete or last completed + 1)
  const currentDay = nextUncompletedDay || Math.min(completedDays.length + 1, 21)

  // Calculate total progress
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
 * Finds the next uncompleted workout and returns its URL
 */
export function findNextUncompletedWorkout(completedDays: number[]): string {
  const progress = calculateUserProgress(completedDays)

  if (progress.nextUncompletedDay === null) {
    // All workouts completed, return to dashboard
    return "/dashboard"
  }

  return `/video/${progress.nextUncompletedDay}`
}

/**
 * Gets the workout day data for a specific day number
 */
export function getWorkoutDay(dayNumber: number): WorkoutDay | undefined {
  const allDays = [...week1Days, ...week2Days, ...week3Days]
  return allDays.find((d) => d.day === dayNumber)
}

export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  current_day: number
  streak: number
  videos_watched: number
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  day_number: number
  completed_at: string
}

export interface ExerciseProgress {
  id: string
  user_id: string
  exercise_id: string
  day_number: number
  completed_at: string
}

export interface Payment {
  id: string
  user_id?: string
  email: string
  name?: string
  status: string
  amount?: number
  transaction_id?: string
  payment_method?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface WorkoutDay {
  day: number
  title: string
  description: string
  exercises: Exercise[]
  completed: boolean
  isToday: boolean
  isLocked: boolean
  notes?: string
}

export interface Exercise {
  id: string
  title: string
  type: "video" | "pdf" | "audio"
  duration?: string
  url: string
  completed: boolean
}

export interface Module {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  totalItems: number
  completedItems: number
  isLocked: boolean
}

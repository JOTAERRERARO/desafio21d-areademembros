export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentDay: number;
  streak: number;
  videosWatched: number;
  completedDays: number[];
}

export interface WorkoutDay {
  day: number;
  title: string;
  description: string;
  exercises: Exercise[];
  completed: boolean;
  isToday: boolean;
  isLocked: boolean;
  notes?: string;
}

export interface Exercise {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'audio';
  duration?: string;
  url: string;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  isLocked: boolean;
}

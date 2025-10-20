-- Migration: Add exercise_progress table for exercise-based progress tracking
-- This table stores individual exercise completions, replacing day-based tracking

-- Create exercise_progress table
CREATE TABLE IF NOT EXISTS public.exercise_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL, -- e.g., 'w1d1e1', 'w2d3e1'
  day_number INTEGER NOT NULL, -- Day 1-21 for easier queries
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_id ON public.exercise_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_exercise_id ON public.exercise_progress(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_completed_at ON public.exercise_progress(completed_at);
CREATE INDEX IF NOT EXISTS idx_exercise_progress_day_number ON public.exercise_progress(day_number);

-- Create a composite unique constraint to prevent duplicate exercise completions
CREATE UNIQUE INDEX IF NOT EXISTS idx_exercise_progress_user_exercise 
ON public.exercise_progress(user_id, exercise_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only view their own exercise progress
CREATE POLICY "Users can view their own exercise progress"
ON public.exercise_progress FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own exercise progress
CREATE POLICY "Users can insert their own exercise progress"
ON public.exercise_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own exercise progress (for undo functionality)
CREATE POLICY "Users can delete their own exercise progress"
ON public.exercise_progress FOR DELETE
USING (auth.uid() = user_id);

-- Create function to automatically populate day_number from exercise_id
CREATE OR REPLACE FUNCTION extract_day_number_from_exercise_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract day number from exercise_id format: 'w1d1e1' -> day 1, 'w2d3e1' -> day 10
  -- Week 1: days 1-7, Week 2: days 8-14, Week 3: days 15-21
  NEW.day_number := 
    CASE 
      WHEN NEW.exercise_id ~ '^w1d[1-7]' THEN 
        CAST(substring(NEW.exercise_id from 'w1d([1-7])') AS INTEGER)
      WHEN NEW.exercise_id ~ '^w2d[1-7]' THEN 
        CAST(substring(NEW.exercise_id from 'w2d([1-7])') AS INTEGER) + 7
      WHEN NEW.exercise_id ~ '^w3d[1-7]' THEN 
        CAST(substring(NEW.exercise_id from 'w3d([1-7])') AS INTEGER) + 14
      ELSE 0
    END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-populate day_number
CREATE TRIGGER set_day_number_trigger
BEFORE INSERT ON public.exercise_progress
FOR EACH ROW
EXECUTE FUNCTION extract_day_number_from_exercise_id();

-- Optional: Migrate existing data from user_progress to exercise_progress
-- This assumes each day had only one exercise
-- Uncomment if you have existing data to migrate:
/*
INSERT INTO public.exercise_progress (user_id, exercise_id, day_number, completed_at)
SELECT 
  user_id,
  CASE 
    WHEN day_number BETWEEN 1 AND 7 THEN 'w1d' || day_number || 'e1'
    WHEN day_number BETWEEN 8 AND 14 THEN 'w2d' || (day_number - 7) || 'e1'
    WHEN day_number BETWEEN 15 AND 21 THEN 'w3d' || (day_number - 14) || 'e1'
  END as exercise_id,
  day_number,
  completed_at
FROM public.user_progress
ON CONFLICT (user_id, exercise_id) DO NOTHING;
*/

-- Add comment to table
COMMENT ON TABLE public.exercise_progress IS 'Stores individual exercise completions for granular progress tracking';
COMMENT ON COLUMN public.exercise_progress.exercise_id IS 'Exercise identifier in format: w{week}d{day}e{exercise}, e.g., w1d1e1 for Week 1, Day 1, Exercise 1';
COMMENT ON COLUMN public.exercise_progress.day_number IS 'Day number from 1-21 for easier queries and calculations';


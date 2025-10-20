-- VERSÃO SIMPLIFICADA - Execute no Supabase SQL Editor
-- Passo 1 de 3: Criar a tabela básica

CREATE TABLE IF NOT EXISTS public.exercise_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_exercise_progress_user_id 
ON public.exercise_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_exercise_progress_exercise_id 
ON public.exercise_progress(exercise_id);

-- Constraint único
CREATE UNIQUE INDEX IF NOT EXISTS idx_exercise_progress_user_exercise 
ON public.exercise_progress(user_id, exercise_id);


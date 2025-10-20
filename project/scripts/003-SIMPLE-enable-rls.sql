-- VERSÃO SIMPLIFICADA - Execute no Supabase SQL Editor
-- Passo 2 de 3: Configurar RLS (Row Level Security)

-- Habilitar RLS
ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;

-- Policy para SELECT
DROP POLICY IF EXISTS "Users can view their own exercise progress" ON public.exercise_progress;
CREATE POLICY "Users can view their own exercise progress"
ON public.exercise_progress FOR SELECT
USING (auth.uid() = user_id);

-- Policy para INSERT
DROP POLICY IF EXISTS "Users can insert their own exercise progress" ON public.exercise_progress;
CREATE POLICY "Users can insert their own exercise progress"
ON public.exercise_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy para DELETE
DROP POLICY IF EXISTS "Users can delete their own exercise progress" ON public.exercise_progress;
CREATE POLICY "Users can delete their own exercise progress"
ON public.exercise_progress FOR DELETE
USING (auth.uid() = user_id);


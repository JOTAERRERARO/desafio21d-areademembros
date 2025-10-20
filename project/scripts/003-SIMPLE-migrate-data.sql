-- VERSÃO SIMPLIFICADA - Execute no Supabase SQL Editor
-- Passo 3 de 3 (OPCIONAL): Migrar dados existentes de user_progress

-- Execute SOMENTE se você tiver dados na tabela user_progress que deseja preservar

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

-- Verificar que os dados foram migrados
SELECT 
  COUNT(*) as total_exercises,
  COUNT(DISTINCT day_number) as unique_days,
  MIN(completed_at) as first_workout,
  MAX(completed_at) as last_workout
FROM public.exercise_progress;


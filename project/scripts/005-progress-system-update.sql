-- Script para garantir que o sistema de progresso está correto
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar estrutura da tabela user_progress
DO $$ 
BEGIN
  -- Garantir que a constraint UNIQUE existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_progress_user_id_day_number_key'
  ) THEN
    ALTER TABLE user_progress 
    ADD CONSTRAINT user_progress_user_id_day_number_key 
    UNIQUE (user_id, day_number);
  END IF;
END $$;

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_day 
ON user_progress(user_id, day_number);

CREATE INDEX IF NOT EXISTS idx_user_progress_user 
ON user_progress(user_id);

-- 3. Garantir políticas RLS
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

CREATE POLICY "Users can view own progress"
ON user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Função para calcular progresso de um usuário
CREATE OR REPLACE FUNCTION get_user_progress_summary(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result json;
  v_completed_days integer[];
  v_week1_count integer;
  v_week2_count integer;
  v_week3_count integer;
  v_week1_completed boolean;
  v_week2_completed boolean;
  v_week3_unlocked boolean;
BEGIN
  -- Buscar dias completos
  SELECT array_agg(day_number ORDER BY day_number)
  INTO v_completed_days
  FROM user_progress
  WHERE user_id = p_user_id;

  -- Calcular contagens por semana
  SELECT 
    COUNT(*) FILTER (WHERE day_number BETWEEN 1 AND 7),
    COUNT(*) FILTER (WHERE day_number BETWEEN 8 AND 14),
    COUNT(*) FILTER (WHERE day_number BETWEEN 15 AND 21)
  INTO v_week1_count, v_week2_count, v_week3_count
  FROM user_progress
  WHERE user_id = p_user_id;

  -- Determinar status
  v_week1_completed := v_week1_count = 7;
  v_week2_completed := v_week2_count = 7;
  v_week3_unlocked := v_week1_completed AND v_week2_completed;

  -- Montar resultado
  v_result := json_build_object(
    'completed_days', COALESCE(v_completed_days, ARRAY[]::integer[]),
    'total_completed', COALESCE(array_length(v_completed_days, 1), 0),
    'week1_completed', v_week1_completed,
    'week2_completed', v_week2_completed,
    'week3_unlocked', v_week3_unlocked,
    'week1_count', v_week1_count,
    'week2_count', v_week2_count,
    'week3_count', v_week3_count
  );

  RETURN v_result;
END;
$$;

-- 5. Garantir que a tabela comunidade tem políticas corretas
ALTER TABLE comunidade ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comunidade_select" ON comunidade;
DROP POLICY IF EXISTS "comunidade_insert" ON comunidade;
DROP POLICY IF EXISTS "comunidade_delete" ON comunidade;

CREATE POLICY "comunidade_select" 
ON comunidade FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "comunidade_insert" 
ON comunidade FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comunidade_delete" 
ON comunidade FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 6. Garantir que realtime está ativo
-- NOTA: Você ainda precisa habilitar manualmente em Database > Replication
ALTER PUBLICATION supabase_realtime ADD TABLE comunidade;
ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;

-- 7. Verificação final
SELECT 
  'user_progress' as tabela,
  COUNT(*) as total_registros
FROM user_progress
UNION ALL
SELECT 
  'comunidade' as tabela,
  COUNT(*) as total_registros
FROM comunidade;

-- 8. Testar função de progresso (substitua o UUID por um real)
-- SELECT get_user_progress_summary('seu-user-id-aqui');

COMMENT ON FUNCTION get_user_progress_summary IS 'Retorna um resumo completo do progresso do usuário incluindo status de desbloqueio da Semana 3';


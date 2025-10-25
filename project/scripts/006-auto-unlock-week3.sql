-- Script para desbloqueio automático da Semana 3
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela para controle de semanas desbloqueadas (se não existir)
CREATE TABLE IF NOT EXISTS user_week_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  week1_unlocked boolean DEFAULT TRUE,
  week2_unlocked boolean DEFAULT FALSE,
  week3_unlocked boolean DEFAULT FALSE,
  week1_complete boolean DEFAULT FALSE,
  week2_complete boolean DEFAULT FALSE,
  week3_complete boolean DEFAULT FALSE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE user_week_progress ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas
DROP POLICY IF EXISTS "Users can view own week progress" ON user_week_progress;
DROP POLICY IF EXISTS "Users can insert own week progress" ON user_week_progress;
DROP POLICY IF EXISTS "Users can update own week progress" ON user_week_progress;

CREATE POLICY "Users can view own week progress"
ON user_week_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own week progress"
ON user_week_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own week progress"
ON user_week_progress FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Criar função para verificar e atualizar progresso das semanas
CREATE OR REPLACE FUNCTION update_week_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_completed_days integer[];
  v_week1_count integer;
  v_week2_count integer;
  v_week3_count integer;
  v_week1_complete boolean;
  v_week2_complete boolean;
  v_week3_unlocked boolean;
BEGIN
  v_user_id := NEW.user_id;
  
  -- Buscar todos os dias completos do usuário
  SELECT array_agg(day_number ORDER BY day_number)
  INTO v_completed_days
  FROM user_progress
  WHERE user_id = v_user_id;
  
  -- Contar dias completos por semana
  SELECT 
    COUNT(*) FILTER (WHERE day_number BETWEEN 1 AND 7),
    COUNT(*) FILTER (WHERE day_number BETWEEN 8 AND 14),
    COUNT(*) FILTER (WHERE day_number BETWEEN 15 AND 21)
  INTO v_week1_count, v_week2_count, v_week3_count
  FROM user_progress
  WHERE user_id = v_user_id;
  
  -- Determinar status
  v_week1_complete := v_week1_count = 7;
  v_week2_complete := v_week2_count = 7;
  v_week3_unlocked := v_week1_complete AND v_week2_complete;
  
  -- Atualizar ou criar registro
  INSERT INTO user_week_progress (
    user_id,
    week1_unlocked,
    week2_unlocked,
    week3_unlocked,
    week1_complete,
    week2_complete,
    week3_complete,
    updated_at
  ) VALUES (
    v_user_id,
    TRUE,
    v_week1_complete,
    v_week3_unlocked,
    v_week1_complete,
    v_week2_complete,
    v_week3_count = 7,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    week1_complete = v_week1_complete,
    week2_complete = v_week2_complete,
    week2_unlocked = v_week1_complete,
    week3_unlocked = v_week3_unlocked,
    week3_complete = v_week3_count = 7,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar trigger para atualizar automaticamente
DROP TRIGGER IF EXISTS auto_update_week_progress ON user_progress;

CREATE TRIGGER auto_update_week_progress
AFTER INSERT OR UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_week_progress();

-- 6. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_week_progress_user_id 
ON user_week_progress(user_id);

-- 7. Inicializar progresso para usuários existentes
INSERT INTO user_week_progress (user_id, week1_unlocked)
SELECT DISTINCT id, TRUE
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_week_progress)
ON CONFLICT (user_id) DO NOTHING;

-- 8. Atualizar progresso de todos os usuários com base nos dias completos
DO $$
DECLARE
  v_user record;
  v_week1_count integer;
  v_week2_count integer;
  v_week3_count integer;
BEGIN
  FOR v_user IN SELECT DISTINCT user_id FROM user_progress LOOP
    -- Contar dias por semana
    SELECT 
      COUNT(*) FILTER (WHERE day_number BETWEEN 1 AND 7),
      COUNT(*) FILTER (WHERE day_number BETWEEN 8 AND 14),
      COUNT(*) FILTER (WHERE day_number BETWEEN 15 AND 21)
    INTO v_week1_count, v_week2_count, v_week3_count
    FROM user_progress
    WHERE user_id = v_user.user_id;
    
    -- Atualizar
    UPDATE user_week_progress
    SET
      week1_complete = (v_week1_count = 7),
      week2_complete = (v_week2_count = 7),
      week3_complete = (v_week3_count = 7),
      week2_unlocked = (v_week1_count = 7),
      week3_unlocked = (v_week1_count = 7 AND v_week2_count = 7),
      updated_at = now()
    WHERE user_id = v_user.user_id;
  END LOOP;
END $$;

-- 9. Verificar resultado
SELECT 
  u.email,
  uwp.week1_complete,
  uwp.week2_complete,
  uwp.week3_unlocked,
  (SELECT COUNT(*) FROM user_progress WHERE user_id = u.id) as total_days_complete
FROM users u
LEFT JOIN user_week_progress uwp ON u.id = uwp.user_id
ORDER BY u.created_at DESC
LIMIT 10;

COMMENT ON TABLE user_week_progress IS 'Controla o desbloqueio e conclusão das semanas do desafio';
COMMENT ON FUNCTION update_week_progress IS 'Atualiza automaticamente o status das semanas quando um dia é marcado como completo';
COMMENT ON TRIGGER auto_update_week_progress ON user_progress IS 'Trigger que executa update_week_progress() após inserção/atualização em user_progress';

-- 10. Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de desbloqueio automático da Semana 3 configurado com sucesso!';
  RAISE NOTICE '📊 Trigger ativo: Semana 3 será desbloqueada automaticamente quando Semanas 1 e 2 estiverem completas';
  RAISE NOTICE '🔄 Progresso de usuários existentes atualizado';
END $$;


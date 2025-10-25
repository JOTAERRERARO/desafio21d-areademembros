-- ==========================================
-- SCRIPT DE RESET COMPLETO (USE COM CUIDADO!)
-- ==========================================
-- ⚠️ ATENÇÃO: Este script APAGA TODOS OS DADOS
-- Use apenas em desenvolvimento/testes
-- ==========================================

-- Confirmação de segurança (descomente para executar)
-- DO $$
-- BEGIN
--   RAISE EXCEPTION 'PARE! Descomente este bloco apenas se tiver certeza!';
-- END $$;

-- 1. DESABILITAR TRIGGERS
ALTER TABLE IF EXISTS user_progress DISABLE TRIGGER ALL;
ALTER TABLE IF EXISTS user_week_progress DISABLE TRIGGER ALL;

-- 2. REMOVER PUBLICAÇÕES REALTIME
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS comunidade;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS user_progress;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS user_week_progress;

-- 3. DROPAR TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS auto_update_week_progress ON user_progress;

-- 4. DROPAR FUNÇÕES
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_week_progress();
DROP FUNCTION IF EXISTS public.get_user_progress_summary(uuid);

-- 5. DROPAR TABELAS (ordem inversa das dependências)
DROP TABLE IF EXISTS curtidas CASCADE;
DROP TABLE IF EXISTS comunidade CASCADE;
DROP TABLE IF EXISTS diario CASCADE;
DROP TABLE IF EXISTS user_week_progress CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS exercise_progress CASCADE;
DROP TABLE IF EXISTS audios_motivacionais CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 6. LIMPAR USUÁRIOS (CUIDADO!)
-- DELETE FROM auth.users WHERE email LIKE '%test%';

-- 7. MENSAGEM FINAL
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE '  ✅ RESET COMPLETO EXECUTADO COM SUCESSO  ';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE 'Próximos passos:';
  RAISE NOTICE '1. Execute: 001-create-tables.sql';
  RAISE NOTICE '2. Execute: 002-add-new-tables.sql';
  RAISE NOTICE '3. Execute: 003-enable-realtime.sql';
  RAISE NOTICE '4. Execute: 005-progress-system-update.sql';
  RAISE NOTICE '5. Execute: 006-auto-unlock-week3.sql';
  RAISE NOTICE '';
END $$;


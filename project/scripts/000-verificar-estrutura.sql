-- ==========================================
-- SCRIPT DE VERIFICAÇÃO DA ESTRUTURA
-- Execute este script PRIMEIRO para diagnosticar
-- ==========================================

-- 1. LISTAR TODAS AS TABELAS
SELECT 
  table_name,
  CASE 
    WHEN table_name = 'users' THEN '✅ Tabela principal de usuários'
    WHEN table_name = 'user_progress' THEN '✅ Progresso dos dias'
    WHEN table_name = 'user_week_progress' THEN '✅ Controle de semanas'
    WHEN table_name = 'exercise_progress' THEN '✅ Progresso de exercícios'
    WHEN table_name = 'diario' THEN '✅ Diário 21D'
    WHEN table_name = 'comunidade' THEN '✅ Posts da comunidade'
    WHEN table_name = 'curtidas' THEN '✅ Likes nos posts'
    WHEN table_name = 'payments' THEN '✅ Pagamentos'
    WHEN table_name = 'audios_motivacionais' THEN '✅ Áudios motivacionais'
    ELSE '⚠️ Tabela adicional'
  END as descricao
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. VERIFICAR RLS (ROW LEVEL SECURITY)
SELECT 
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅ ATIVO' ELSE '❌ DESATIVADO' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3. CONTAR POLÍTICAS POR TABELA
SELECT 
  schemaname,
  tablename,
  COUNT(*) as total_policies,
  string_agg(policyname, ', ' ORDER BY policyname) as policy_names
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- 4. VERIFICAR REALTIME
SELECT 
  schemaname,
  tablename,
  string_agg(pubname, ', ') as publications
FROM pg_publication_tables
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- 5. VERIFICAR TRIGGERS
SELECT 
  trigger_schema,
  trigger_name,
  event_object_table as table_name,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 6. VERIFICAR FOREIGN KEYS
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 7. VERIFICAR ÍNDICES
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 8. CONTAR REGISTROS POR TABELA
DO $$
DECLARE
  r RECORD;
  v_count INTEGER;
BEGIN
  RAISE NOTICE '=== CONTAGEM DE REGISTROS ===';
  
  FOR r IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  LOOP
    EXECUTE 'SELECT COUNT(*) FROM ' || quote_ident(r.table_name) INTO v_count;
    RAISE NOTICE '% : % registros', RPAD(r.table_name, 30), v_count;
  END LOOP;
END $$;

-- 9. VERIFICAR FUNÇÕES
SELECT 
  routine_schema,
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 10. RESUMO FINAL
DO $$
DECLARE
  v_tables INTEGER;
  v_policies INTEGER;
  v_triggers INTEGER;
  v_functions INTEGER;
  v_realtime_tables INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_tables 
  FROM information_schema.tables 
  WHERE table_schema = 'public';
  
  SELECT COUNT(*) INTO v_policies 
  FROM pg_policies 
  WHERE schemaname = 'public';
  
  SELECT COUNT(*) INTO v_triggers 
  FROM information_schema.triggers 
  WHERE trigger_schema = 'public';
  
  SELECT COUNT(*) INTO v_functions 
  FROM information_schema.routines 
  WHERE routine_schema = 'public';
  
  SELECT COUNT(DISTINCT tablename) INTO v_realtime_tables
  FROM pg_publication_tables
  WHERE schemaname = 'public';
  
  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════╗';
  RAISE NOTICE '║   RESUMO DA ESTRUTURA DO SUPABASE      ║';
  RAISE NOTICE '╠════════════════════════════════════════╣';
  RAISE NOTICE '║ Total de Tabelas:         %           ║', LPAD(v_tables::TEXT, 10);
  RAISE NOTICE '║ Total de Políticas RLS:   %           ║', LPAD(v_policies::TEXT, 10);
  RAISE NOTICE '║ Total de Triggers:        %           ║', LPAD(v_triggers::TEXT, 10);
  RAISE NOTICE '║ Total de Funções:         %           ║', LPAD(v_functions::TEXT, 10);
  RAISE NOTICE '║ Tabelas com Realtime:     %           ║', LPAD(v_realtime_tables::TEXT, 10);
  RAISE NOTICE '╚════════════════════════════════════════╝';
  RAISE NOTICE '';
  
  IF v_tables >= 9 THEN
    RAISE NOTICE '✅ Estrutura completa! Todas as tabelas principais criadas.';
  ELSE
    RAISE NOTICE '⚠️ ATENÇÃO: Faltam tabelas! Execute os scripts na ordem.';
  END IF;
  
  IF v_realtime_tables >= 2 THEN
    RAISE NOTICE '✅ Realtime configurado corretamente.';
  ELSE
    RAISE NOTICE '⚠️ Configure Realtime em: Database > Replication';
  END IF;
END $$;


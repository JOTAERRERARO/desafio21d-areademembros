-- Script para habilitar Realtime nas tabelas necessárias
-- Execute este script no SQL Editor do Supabase

-- IMPORTANTE: Após executar este script, você também precisa:
-- 1. Ir em Database > Replication no dashboard do Supabase
-- 2. Habilitar realtime manualmente para a tabela "comunidade"

-- Adicionar permissões para realtime na tabela comunidade
ALTER PUBLICATION supabase_realtime ADD TABLE comunidade;

-- Verificar se foi adicionado corretamente
SELECT 
  schemaname, 
  tablename, 
  pubname 
FROM 
  pg_publication_tables 
WHERE 
  tablename = 'comunidade';

-- Nota: Se você receber erro "publication supabase_realtime does not exist"
-- É porque você precisa habilitar realtime primeiro no dashboard:
-- Database > Replication > Habilitar para tabela "comunidade"


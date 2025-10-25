-- Script para corrigir dados de usuários existentes
-- Use com CUIDADO em produção!

-- 1. Ver todos os usuários cadastrados
SELECT 
  u.id,
  u.name,
  u.email,
  u.current_day,
  u.streak,
  COUNT(up.day_number) as dias_completos
FROM 
  users u
  LEFT JOIN user_progress up ON u.id = up.user_id
GROUP BY 
  u.id, u.name, u.email, u.current_day, u.streak
ORDER BY 
  u.created_at DESC;

-- 2. Atualizar nome de um usuário específico
-- SUBSTITUA 'user_id_aqui' pelo ID real do usuário
-- SUBSTITUA 'Nome Completo Aqui' pelo nome desejado
/*
UPDATE users 
SET name = 'Nome Completo Aqui'
WHERE id = 'user_id_aqui';
*/

-- 3. Sincronizar current_day com o progresso real
-- Este comando atualiza o current_day baseado no último dia completo
/*
UPDATE users u
SET current_day = COALESCE(
  (SELECT MAX(day_number) + 1 FROM user_progress WHERE user_id = u.id),
  1
)
WHERE u.id = 'user_id_aqui';
*/

-- 4. Calcular e atualizar streak (dias seguidos)
-- NOTA: Esta é uma versão simplificada. Para streak real, você precisaria
-- considerar se os dias foram feitos consecutivamente
/*
UPDATE users u
SET streak = (
  SELECT COUNT(*) 
  FROM user_progress 
  WHERE user_id = u.id
)
WHERE u.id = 'user_id_aqui';
*/

-- 5. Ver progresso detalhado de um usuário
-- SUBSTITUA 'user_id_aqui' pelo ID real do usuário
/*
SELECT 
  day_number,
  completed_at,
  DATE(completed_at) as data
FROM 
  user_progress
WHERE 
  user_id = 'user_id_aqui'
ORDER BY 
  day_number ASC;
*/

-- 6. Resetar progresso de um usuário (USE COM CUIDADO!)
-- SUBSTITUA 'user_id_aqui' pelo ID real do usuário
/*
DELETE FROM user_progress 
WHERE user_id = 'user_id_aqui';

UPDATE users 
SET current_day = 1, streak = 0 
WHERE id = 'user_id_aqui';
*/

-- 7. Ver estatísticas gerais da plataforma
SELECT 
  COUNT(DISTINCT u.id) as total_usuarios,
  COUNT(DISTINCT up.user_id) as usuarios_ativos,
  COUNT(up.id) as total_dias_completos,
  ROUND(AVG(dias_por_usuario), 2) as media_dias_por_usuario
FROM 
  users u
  LEFT JOIN user_progress up ON u.id = up.user_id
  CROSS JOIN (
    SELECT 
      user_id, 
      COUNT(*) as dias_por_usuario 
    FROM 
      user_progress 
    GROUP BY 
      user_id
  ) sub;

-- 8. Ver usuários que completaram o desafio (21 dias)
SELECT 
  u.name,
  u.email,
  COUNT(up.day_number) as dias_completos
FROM 
  users u
  JOIN user_progress up ON u.id = up.user_id
GROUP BY 
  u.id, u.name, u.email
HAVING 
  COUNT(up.day_number) = 21
ORDER BY 
  MAX(up.completed_at) DESC;

-- 9. Ver posts da comunidade com autores
SELECT 
  c.id,
  u.name as autor,
  c.conteudo,
  c.data_postagem,
  COUNT(cu.id) as curtidas
FROM 
  comunidade c
  JOIN users u ON c.user_id = u.id
  LEFT JOIN curtidas cu ON c.id = cu.post_id
GROUP BY 
  c.id, u.name, c.conteudo, c.data_postagem
ORDER BY 
  c.data_postagem DESC
LIMIT 20;

-- 10. Criar usuário manualmente (caso o trigger não funcione)
-- SUBSTITUA os valores conforme necessário
/*
INSERT INTO users (id, name, email)
VALUES (
  'user_id_do_auth_users',
  'Nome Completo',
  'email@example.com'
);
*/


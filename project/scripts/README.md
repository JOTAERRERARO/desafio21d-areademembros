# 📚 Scripts SQL - Desafio 21D

## 🎯 Ordem de Execução

Execute os scripts **EXATAMENTE NESTA ORDEM** no SQL Editor do Supabase:

### 1️⃣ **Verificação Inicial** (Recomendado)
```sql
-- Execute primeiro para ver o estado atual
000-verificar-estrutura.sql
```

### 2️⃣ **Setup Inicial** (Obrigatório)
```sql
-- Tabelas principais
001-create-tables.sql

-- Tabelas adicionais (comunidade, diário, etc)
002-add-new-tables.sql

-- Habilitar realtime
003-enable-realtime.sql
```

### 3️⃣ **Features Avançadas** (Recomendado)
```sql
-- Sistema de progresso otimizado
005-progress-system-update.sql

-- Desbloqueio automático Semana 3
006-auto-unlock-week3.sql
```

### 4️⃣ **Manutenção** (Opcional)
```sql
-- Queries úteis para debug
004-fix-user-data.sql
```

### 5️⃣ **Reset** (⚠️ CUIDADO! Apenas dev/teste)
```sql
-- Apaga TUDO e reinicia
999-reset-database.sql
```

---

## 📋 Descrição Detalhada

### `000-verificar-estrutura.sql` ✅ NOVO
**Objetivo:** Diagnóstico completo da estrutura  
**Quando usar:** Antes e depois de executar outros scripts  
**O que faz:**
- Lista todas as tabelas
- Verifica RLS ativo
- Conta políticas
- Verifica realtime
- Mostra triggers e funções
- Resumo visual completo

**Output esperado:**
```
╔════════════════════════════════════════╗
║   RESUMO DA ESTRUTURA DO SUPABASE      ║
╠════════════════════════════════════════╣
║ Total de Tabelas:                9    ║
║ Total de Políticas RLS:         24    ║
║ Total de Triggers:               2    ║
║ Total de Funções:                3    ║
║ Tabelas com Realtime:            3    ║
╚════════════════════════════════════════╝
```

---

### `001-create-tables.sql`
**Objetivo:** Criar estrutura base  
**Tabelas criadas:**
- `users` - Perfil do usuário
- `user_progress` - Dias completos
- `exercise_progress` - Exercícios completos
- `payments` - Webhook de pagamentos

**Também cria:**
- Políticas RLS
- Trigger `on_auth_user_created`
- Função `handle_new_user()`
- Índices de performance

---

### `002-add-new-tables.sql`
**Objetivo:** Adicionar features sociais  
**Tabelas criadas:**
- `audios_motivacionais` - Áudios do desafio
- `diario` - Diário 21D
- `comunidade` - Posts
- `curtidas` - Likes nos posts

**Também cria:**
- Políticas RLS para cada tabela
- Dados de exemplo (5 áudios)

---

### `003-enable-realtime.sql`
**Objetivo:** Ativar realtime  
**O que faz:**
- Adiciona `comunidade` ao realtime
- Verifica configuração

**⚠️ IMPORTANTE:** Após executar, vá em:
```
Database > Replication > Habilitar tabela "comunidade"
```

---

### `004-fix-user-data.sql`
**Objetivo:** Queries de manutenção  
**Contém:**
- Ver todos os usuários
- Atualizar nome
- Sincronizar current_day
- Calcular streak
- Ver progresso detalhado
- Resetar progresso (cuidado!)
- Estatísticas gerais
- Ver usuários que completaram
- Ver posts da comunidade
- Criar usuário manualmente

---

### `005-progress-system-update.sql`
**Objetivo:** Sistema de progresso avançado  
**O que faz:**
- Garante constraints UNIQUE
- Cria índices otimizados
- Atualiza políticas RLS
- Cria função `get_user_progress_summary()`
- Habilita realtime em `user_progress`

**Função SQL criada:**
```sql
-- Retorna resumo completo do progresso
SELECT get_user_progress_summary('user-id-aqui');
```

---

### `006-auto-unlock-week3.sql`
**Objetivo:** Desbloqueio automático  
**O que faz:**
- Cria tabela `user_week_progress`
- Cria função `update_week_progress()`
- Cria trigger `auto_update_week_progress`
- Inicializa dados de usuários existentes

**Como funciona:**
```
Usuário completa Dia 14
    ↓
Trigger dispara automaticamente
    ↓
Verifica: Semanas 1 e 2 completas?
    ↓ SIM
Atualiza: week3_unlocked = TRUE
    ↓
🎉 Semana 3 desbloqueada!
```

---

### `999-reset-database.sql` ⚠️ **NOVO**
**Objetivo:** Reset completo (dev/teste)  
**O que faz:**
- Desabilita triggers
- Remove publicações realtime
- Dropa todos os triggers
- Dropa todas as funções
- Dropa todas as tabelas
- Limpa estrutura completa

**⚠️ ATENÇÃO:**
- Use APENAS em desenvolvimento
- APAGA TODOS OS DADOS
- Não há como desfazer
- Descomente o bloco de confirmação primeiro

---

## 🔍 Verificação Rápida

### Verificar se tudo está OK:
```sql
-- 1. Listar tabelas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Deve retornar 9 tabelas:
-- audios_motivacionais
-- comunidade
-- curtidas
-- diario
-- exercise_progress
-- payments
-- user_progress
-- user_week_progress
-- users
```

### Verificar Realtime:
```sql
SELECT tablename FROM pg_publication_tables 
WHERE schemaname = 'public';

-- Deve incluir:
-- comunidade
-- user_progress
-- user_week_progress
```

---

## 🐛 Troubleshooting

### Erro: "relation already exists"
**Solução:** Tabela já existe. Pule para o próximo script.

### Erro: "permission denied"
**Solução:** Use um usuário com privilégios de admin.

### Erro: "trigger already exists"
**Solução:** Drop o trigger antes:
```sql
DROP TRIGGER IF EXISTS nome_do_trigger ON nome_da_tabela;
```

### Realtime não funciona
**Solução:**
1. Execute `003-enable-realtime.sql`
2. Vá em Database > Replication
3. Habilite manualmente cada tabela

---

## 📊 Checklist Final

Após executar todos os scripts:

- [ ] ✅ 9 tabelas criadas
- [ ] ✅ RLS ativo em todas
- [ ] ✅ ~24 políticas criadas
- [ ] ✅ 2 triggers ativos
- [ ] ✅ 3 funções criadas
- [ ] ✅ 3 tabelas com realtime
- [ ] ✅ Índices criados
- [ ] ✅ Trigger de auto-desbloqueio funcionando

---

## 🎯 Ordem Recomendada Completa

1. `000-verificar-estrutura.sql` - Ver estado atual
2. `001-create-tables.sql` - Criar base
3. `002-add-new-tables.sql` - Adicionar features
4. `003-enable-realtime.sql` - Ativar realtime
5. Database > Replication > Habilitar tabelas
6. `005-progress-system-update.sql` - Otimizações
7. `006-auto-unlock-week3.sql` - Auto-desbloqueio
8. `000-verificar-estrutura.sql` - Verificar tudo OK ✅

---

## 📞 Suporte

Se encontrar problemas:
1. Execute `000-verificar-estrutura.sql` para diagnóstico
2. Verifique os logs do Supabase: Logs > Query Performance
3. Consulte `INSTRUÇÕES_SUPABASE.md` na raiz do projeto

---

**Última atualização:** 25 de Outubro de 2025  
**Total de scripts:** 8  
**Status:** ✅ Estrutura completa e testada


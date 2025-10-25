# 🗄️ ESTRUTURA COMPLETA DO SUPABASE - DESAFIO 21D

## 📊 ANÁLISE REALIZADA

**Data:** 25 de Outubro de 2025  
**Método:** Análise de código + Scripts SQL existentes  
**Status:** ✅ Estrutura completa mapeada

---

## 🎯 TABELAS NECESSÁRIAS (9 Total)

### ✅ 1. **`users`** - Perfil do Usuário
**Script:** `001-create-tables.sql`

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  current_day INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  videos_watched INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usado em:**
- Dashboard (mostrar nome)
- Header (avatar e saudação)
- Progresso (current_day, streak)

---

### ✅ 2. **`user_progress`** - Dias Completos
**Script:** `001-create-tables.sql`

```sql
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  day_number INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);
```

**Usado em:**
- Dashboard (calcular progresso)
- Video Player (marcar completo)
- Week Module (mostrar dias completos)
- API `/api/progress/toggle`
- API `/api/progress/summary`

---

### ✅ 3. **`user_week_progress`** - Controle de Semanas
**Script:** `006-auto-unlock-week3.sql`

```sql
CREATE TABLE user_week_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  week1_unlocked BOOLEAN DEFAULT TRUE,
  week2_unlocked BOOLEAN DEFAULT FALSE,
  week3_unlocked BOOLEAN DEFAULT FALSE,
  week1_complete BOOLEAN DEFAULT FALSE,
  week2_complete BOOLEAN DEFAULT FALSE,
  week3_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usado em:**
- Dashboard (verificar desbloqueio)
- Week Module (bloquear/desbloquear)
- API `/api/progress/unlock-week`
- Trigger automático

---

### ✅ 4. **`exercise_progress`** - Exercícios Completos
**Script:** `001-create-tables.sql`

```sql
CREATE TABLE public.exercise_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  exercise_id TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);
```

**Usado em:**
- Video Player (tracking detalhado)
- API `/api/progress/complete-exercise`

---

### ✅ 5. **`diario`** - Diário 21D
**Script:** `002-add-new-tables.sql`

```sql
CREATE TABLE diario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  data DATE DEFAULT NOW(),
  conteudo TEXT NOT NULL,
  mood TEXT,
  energy INTEGER,
  dia INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usado em:**
- `components/journal-page.tsx`
- Página de Diário

---

### ✅ 6. **`comunidade`** - Posts da Comunidade
**Script:** `002-add-new-tables.sql`

```sql
CREATE TABLE comunidade (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  conteudo TEXT NOT NULL,
  data_postagem TIMESTAMPTZ DEFAULT NOW()
);
```

**Usado em:**
- `components/community-page.tsx`
- Realtime habilitado

---

### ✅ 7. **`curtidas`** - Likes nos Posts
**Script:** `002-add-new-tables.sql`

```sql
CREATE TABLE curtidas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  post_id UUID REFERENCES comunidade(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);
```

**Usado em:**
- `components/community-page.tsx`
- Sistema de curtidas

---

### ✅ 8. **`payments`** - Pagamentos (Webhook)
**Script:** `001-create-tables.sql`

```sql
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  email TEXT NOT NULL,
  name TEXT,
  status TEXT NOT NULL,
  amount DECIMAL(10, 2),
  transaction_id TEXT UNIQUE,
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usado em:**
- `app/api/webhook-ggcheckout/route.ts`
- Sistema de pagamentos

---

### ✅ 9. **`audios_motivacionais`** - Áudios (Exemplo)
**Script:** `002-add-new-tables.sql`

```sql
CREATE TABLE audios_motivacionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  url TEXT NOT NULL,
  duracao TEXT NOT NULL,
  dia INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Usado em:**
- Feature futura de áudios motivacionais
- Dados de exemplo incluídos

---

## 🔧 TRIGGERS NECESSÁRIOS (2)

### 1. **`on_auth_user_created`**
**Script:** `001-create-tables.sql`  
**Tabela:** `auth.users`  
**Função:** `handle_new_user()`

**O que faz:**
- Cria automaticamente um registro em `users` quando usuário se cadastra
- Copia nome e email do auth para tabela users

### 2. **`auto_update_week_progress`**
**Script:** `006-auto-unlock-week3.sql`  
**Tabela:** `user_progress`  
**Função:** `update_week_progress()`

**O que faz:**
- Dispara quando um dia é marcado completo
- Calcula automaticamente semanas completas
- Desbloqueia Semana 3 quando 1 e 2 estão completas

---

## 🔄 FUNÇÕES SQL (3)

### 1. **`handle_new_user()`**
**Script:** `001-create-tables.sql`

Cria perfil do usuário automaticamente.

### 2. **`update_week_progress()`**
**Script:** `006-auto-unlock-week3.sql`

Atualiza progresso das semanas e desbloqueia automaticamente.

### 3. **`get_user_progress_summary(user_id)`**
**Script:** `005-progress-system-update.sql`

Retorna resumo JSON completo do progresso do usuário.

---

## 🔐 POLÍTICAS RLS (Row Level Security)

**Total:** ~24 políticas

### Por Tabela:

- **`users`**: 2 políticas (SELECT, UPDATE)
- **`user_progress`**: 3 políticas (SELECT, INSERT, UPDATE)
- **`user_week_progress`**: 3 políticas (SELECT, INSERT, UPDATE)
- **`exercise_progress`**: 2 políticas (SELECT, INSERT)
- **`diario`**: 4 políticas (SELECT, INSERT, UPDATE, DELETE)
- **`comunidade`**: 3 políticas (SELECT, INSERT, DELETE)
- **`curtidas`**: 3 políticas (SELECT, INSERT, DELETE)
- **`payments`**: 1 política (SELECT)
- **`audios_motivacionais`**: Sem RLS (dados públicos)

---

## 🔴 REALTIME HABILITADO (3 Tabelas)

1. **`comunidade`** - Posts aparecem em tempo real
2. **`user_progress`** - Progresso atualiza automaticamente
3. **`user_week_progress`** - Desbloqueio em tempo real

**Como habilitar:**
```
Database > Replication > Habilitar tabela
```

---

## 📋 SCRIPTS SQL DISPONÍVEIS (8 Total)

| # | Arquivo | Tipo | Descrição |
|---|---------|------|-----------|
| 0 | `000-verificar-estrutura.sql` | 🔍 Diagnóstico | **NOVO!** Verifica estrutura completa |
| 1 | `001-create-tables.sql` | 🏗️ Setup | Tabelas principais + triggers |
| 2 | `002-add-new-tables.sql` | 🏗️ Setup | Comunidade + diário |
| 3 | `003-enable-realtime.sql` | ⚡ Config | Ativa realtime |
| 4 | `004-fix-user-data.sql` | 🔧 Manutenção | Queries úteis |
| 5 | `005-progress-system-update.sql` | ⚡ Config | Sistema de progresso |
| 6 | `006-auto-unlock-week3.sql` | ⚡ Config | Auto-desbloqueio |
| 999 | `999-reset-database.sql` | ⚠️ Reset | **NOVO!** Reset completo |

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

### 1️⃣ Diagnóstico Inicial
```sql
-- Ver estado atual do banco
000-verificar-estrutura.sql
```

### 2️⃣ Setup Base (Obrigatório)
```sql
001-create-tables.sql      -- Tabelas principais
002-add-new-tables.sql     -- Features sociais
003-enable-realtime.sql    -- Ativar realtime
```

### 3️⃣ Habilitar Realtime Manual
```
Database > Replication > Habilitar:
- comunidade
- user_progress
- user_week_progress
```

### 4️⃣ Features Avançadas (Recomendado)
```sql
005-progress-system-update.sql  -- Otimizações
006-auto-unlock-week3.sql       -- Auto-desbloqueio
```

### 5️⃣ Verificação Final
```sql
-- Confirmar que tudo está OK
000-verificar-estrutura.sql
```

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

✅ Estrutura completa! Todas as tabelas principais criadas.
✅ Realtime configurado corretamente.
```

---

## 📊 DIAGRAMA DE RELACIONAMENTOS

```
auth.users (Supabase Auth)
    ↓
users (Perfil)
    ├─→ user_progress (Dias completos)
    │   └─→ TRIGGER → user_week_progress (Semanas)
    ├─→ exercise_progress (Exercícios)
    ├─→ diario (Entradas do diário)
    ├─→ comunidade (Posts)
    │   └─→ curtidas (Likes)
    └─→ payments (Pagamentos)

audios_motivacionais (Independente)
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### Após executar todos os scripts:

- [ ] **9 tabelas** criadas
- [ ] **24 políticas RLS** ativas
- [ ] **2 triggers** funcionando
- [ ] **3 funções** criadas
- [ ] **3 tabelas** com realtime
- [ ] **Índices** criados
- [ ] **Trigger auto-desbloqueio** ativo

### Como verificar:
```sql
-- Execute e veja o resumo
SELECT * FROM pg_tables WHERE schemaname = 'public';
SELECT * FROM pg_policies WHERE schemaname = 'public';
SELECT * FROM information_schema.triggers WHERE trigger_schema = 'public';
```

---

## 🆕 NOVIDADES ADICIONADAS

### 1. **Script de Verificação** (`000-verificar-estrutura.sql`)
- Diagnóstico completo da estrutura
- Relatório visual com resumo
- Identifica problemas automaticamente
- Conta registros por tabela
- Lista todas as configurações

### 2. **Script de Reset** (`999-reset-database.sql`)
- Reset completo do banco (dev/teste)
- Remove todas as tabelas
- Dropa triggers e funções
- Com confirmação de segurança

### 3. **Documentação** (`scripts/README.md`)
- Guia completo de todos os scripts
- Ordem de execução detalhada
- Troubleshooting completo
- Checklist de verificação

---

## 🎯 RESUMO EXECUTIVO

### O que você precisa fazer:

1. **Abra o SQL Editor do Supabase**
   - https://supabase.com > Seu projeto > SQL Editor

2. **Execute na ordem:**
   ```sql
   000-verificar-estrutura.sql  -- Ver estado atual
   001-create-tables.sql        -- Criar base
   002-add-new-tables.sql       -- Adicionar features
   003-enable-realtime.sql      -- Configurar realtime
   005-progress-system-update.sql -- Otimizações
   006-auto-unlock-week3.sql    -- Auto-desbloqueio
   000-verificar-estrutura.sql  -- Confirmar OK ✅
   ```

3. **Habilite Realtime manualmente:**
   - Database > Replication
   - Habilitar: `comunidade`, `user_progress`, `user_week_progress`

4. **Pronto!** ✅

---

## 📞 SUPORTE

**Documentação disponível:**
- `scripts/README.md` - Guia completo de scripts
- `INSTRUÇÕES_SUPABASE.md` - Setup passo a passo
- `DEPLOY.md` - Deploy na Vercel
- `ESTRUTURA_SUPABASE_COMPLETA.md` - Este documento

**Scripts SQL:**
- 8 scripts organizados por função
- Documentação inline em cada script
- Ordem de execução clara

---

**Última atualização:** 25 de Outubro de 2025  
**Versão:** 1.3.0  
**Status:** ✅ ESTRUTURA COMPLETA MAPEADA  
**GitHub:** https://github.com/JOTAERRERARO/desafio21d-areademembros


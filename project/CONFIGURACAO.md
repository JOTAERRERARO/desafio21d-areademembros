# 🔧 Guia de Configuração - Desafio 21D

## Variáveis de Ambiente Necessárias

Para o projeto funcionar corretamente na Vercel (ou localmente), você precisa configurar as seguintes variáveis de ambiente:

### 1. Variáveis Públicas (Safe para Client-Side)

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 2. Variáveis Privadas (NUNCA expor no cliente)

```bash
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## Onde encontrar essas informações?

1. Acesse seu projeto no Supabase: https://app.supabase.com
2. Vá em **Settings** → **API**
3. Você encontrará:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

## Configurando na Vercel

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as 3 variáveis acima
4. **IMPORTANTE**: Marque as variáveis com `NEXT_PUBLIC_` para todos os ambientes (Production, Preview, Development)
5. **IMPORTANTE**: A `SUPABASE_SERVICE_ROLE_KEY` deve estar marcada **apenas** para Production (nunca expor no client)

## Testando Localmente

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

2. Execute:

```bash
pnpm install
pnpm dev
```

3. Acesse: http://localhost:3000

## Verificando se está funcionando

### ✅ Sinais de que está OK:

- Login funciona sem erro 503
- Dashboard carrega normalmente
- Webhook de pagamento cria usuários
- Logs aparecem no console com prefixos `[WEBHOOK]`, `[COMPLETE_DAY]`, etc.

### ❌ Sinais de problemas:

- Erro 503 (INTERNAL_FUNCTION_SERVICE_UNAVAILABLE)
- Mensagens de erro como "Supabase environment variables are not configured"
- Erro "Database connection failed"

## Solucionando Problemas

### Erro 503 na Vercel

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Faça um novo deploy após adicionar as variáveis
3. Verifique os logs da função na Vercel Dashboard

### Erro de autenticação

1. Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está configurada (para webhooks)
2. Verifique se o usuário existe na tabela `users` do Supabase
3. Verifique as permissões RLS (Row Level Security) das tabelas

### Logs úteis

Todos os logs agora têm prefixos para facilitar debug:
- `[SUPABASE CLIENT]` - Cliente do navegador
- `[SUPABASE SERVER]` - Cliente do servidor
- `[SUPABASE ADMIN]` - Cliente admin (com service role)
- `[WEBHOOK]` - Webhook de pagamento
- `[COMPLETE_DAY]` - API de progresso diário
- `[COMPLETE_EXERCISE]` - API de exercícios
- `[AUTH_CALLBACK]` - Callback de autenticação

## Estrutura de Dados

### Tabelas necessárias no Supabase:

- `users` - Dados dos usuários
- `user_progress` - Progresso dos dias
- `exercise_progress` - Progresso dos exercícios
- `payments` - Log de pagamentos

Veja os scripts de migração em `scripts/` para criar as tabelas.


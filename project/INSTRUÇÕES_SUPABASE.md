# 🗄️ INSTRUÇÕES PARA CONFIGURAR O SUPABASE

## ⚠️ IMPORTANTE: Execute estes passos NO PAINEL DO SUPABASE

Como não tenho acesso direto ao Supabase via MCP, você precisa executar estes scripts manualmente no SQL Editor do Supabase.

---

## 📋 PASSO A PASSO

### 1️⃣ Acesse o Supabase
1. Vá para: https://supabase.com
2. Entre no seu projeto "Desafio 21D"
3. Clique em **SQL Editor** no menu lateral

---

### 2️⃣ Execute os Scripts na Ordem

#### Script 1: Criar Tabelas Principais
**Arquivo:** `scripts/001-create-tables.sql`

```sql
-- COPIE E COLE ESTE SCRIPT NO SQL EDITOR

-- Este script cria:
-- - Tabela users (usuários)
-- - Tabela user_progress (progresso dos dias)
-- - Tabela exercise_progress (progresso dos exercícios)
-- - Tabela payments (pagamentos)
-- - Políticas RLS (Row Level Security)
-- - Trigger para criar usuário automaticamente
```

👉 **Ação:** Abra o arquivo `scripts/001-create-tables.sql` e copie todo o conteúdo para o SQL Editor, depois clique em "Run"

---

#### Script 2: Adicionar Tabelas Adicionais
**Arquivo:** `scripts/002-add-new-tables.sql`

```sql
-- COPIE E COLE ESTE SCRIPT NO SQL EDITOR

-- Este script cria:
-- - Tabela audios_motivacionais
-- - Tabela diario (journal)
-- - Tabela comunidade (posts)
-- - Tabela curtidas (likes)
-- - Políticas RLS para todas
```

👉 **Ação:** Abra o arquivo `scripts/002-add-new-tables.sql` e copie todo o conteúdo para o SQL Editor, depois clique em "Run"

---

#### Script 3: Habilitar Realtime
**Arquivo:** `scripts/003-enable-realtime.sql`

```sql
-- COPIE E COLE ESTE SCRIPT NO SQL EDITOR

-- Este script habilita Realtime na tabela comunidade
ALTER PUBLICATION supabase_realtime ADD TABLE comunidade;
```

👉 **Ação:** Abra o arquivo `scripts/003-enable-realtime.sql` e copie todo o conteúdo para o SQL Editor, depois clique em "Run"

---

### 3️⃣ Habilitar Realtime Manualmente (IMPORTANTE!)

Mesmo após executar o script 3, você precisa:

1. Vá em **Database** > **Replication** no menu lateral
2. Procure pela tabela **`comunidade`**
3. Clique no botão/switch para **HABILITAR** Realtime para essa tabela
4. Aguarde alguns segundos para aplicar

**Sem este passo, a comunidade NÃO funcionará em tempo real!**

---

### 4️⃣ Verificar se Tudo Funcionou

Execute este query no SQL Editor para verificar:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deve retornar:
-- - audios_motivacionais
-- - comunidade
-- - curtidas
-- - diario
-- - exercise_progress
-- - payments
-- - user_progress
-- - users
```

```sql
-- Verificar se Realtime está ativo
SELECT 
  schemaname, 
  tablename, 
  pubname 
FROM 
  pg_publication_tables 
WHERE 
  tablename = 'comunidade';

-- Deve retornar uma linha com:
-- schemaname: public
-- tablename: comunidade
-- pubname: supabase_realtime
```

---

### 5️⃣ Obter Credenciais

Após criar as tabelas, obtenha suas credenciais:

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Cole no arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🔍 Troubleshooting

### Erro: "relation does not exist"
**Causa:** Tabela não foi criada
**Solução:** Execute o script correspondente novamente

### Erro: "permission denied"
**Causa:** RLS bloqueando acesso
**Solução:** Verifique se as políticas foram criadas corretamente

### Realtime não funciona
**Causa:** Não habilitou no painel
**Solução:** Vá em Database > Replication > Habilitar tabela comunidade

### Trigger não cria usuário automaticamente
**Causa:** Trigger não foi criado
**Solução:** Execute novamente a parte do trigger do script 001

---

## ✅ Checklist Final

Antes de testar o projeto:

- [ ] Script 1 executado com sucesso
- [ ] Script 2 executado com sucesso
- [ ] Script 3 executado com sucesso
- [ ] Realtime habilitado manualmente para tabela `comunidade`
- [ ] Credenciais copiadas para `.env.local`
- [ ] Todas as 8 tabelas existem (verificado com query)
- [ ] Realtime está ativo (verificado com query)

---

## 🚀 Próximo Passo

Após configurar o Supabase:

```bash
# Teste localmente
pnpm install
pnpm dev

# Acesse: http://localhost:3000
# 1. Crie uma conta
# 2. Teste o player de vídeo
# 3. Marque um dia como completo
# 4. Faça um post na comunidade
# 5. Abra em outra aba e veja o post aparecer (realtime!)
```

---

## 📞 Precisa de Ajuda?

Se algo não funcionar:
1. Verifique os logs do Supabase: **Logs** > **Query Performance**
2. Consulte o arquivo `DEPLOY.md` para troubleshooting detalhado
3. Verifique se TODAS as variáveis de ambiente estão configuradas

---

**⚠️ LEMBRE-SE:** O código já foi commitado e está no GitHub. Agora só falta configurar o Supabase e o projeto estará 100% funcional!

**Repositório:** https://github.com/JOTAERRERARO/desafio21d-areademembros
**Commit:** d2a4b39 - "build: correção total projeto 21D"


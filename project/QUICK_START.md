# ⚡ Quick Start - Deploy Rápido

## 🚀 Setup em 5 Minutos

### 1️⃣ Clone o Projeto
```bash
git clone seu-repositorio.git
cd desafio21d-areademembros/project
```

### 2️⃣ Instale as Dependências
```bash
pnpm install
# ou
npm install
```

### 3️⃣ Configure o Supabase

#### A. Crie um projeto no Supabase
1. Acesse: https://supabase.com
2. Clique em "New Project"
3. Escolha um nome, senha e região

#### B. Execute os Scripts SQL
No SQL Editor do Supabase, execute na ordem:
1. `scripts/001-create-tables.sql`
2. `scripts/002-add-new-tables.sql`
3. `scripts/003-enable-realtime.sql`

#### C. Habilite o Realtime
1. Vá em **Database** > **Replication**
2. Encontre a tabela `comunidade`
3. Clique para **habilitar realtime**

### 4️⃣ Configure as Variáveis de Ambiente
Crie `.env.local` na raiz:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5️⃣ Rode o Projeto
```bash
pnpm dev
# ou
npm run dev
```

Acesse: http://localhost:3000

---

## 🌐 Deploy na Vercel (5 minutos)

### Método 1: Via GitHub (Recomendado)

1. **Push para GitHub**
```bash
git add .
git commit -m "feat: projeto pronto para deploy"
git push origin main
```

2. **Conecte na Vercel**
- Acesse: https://vercel.com
- "New Project" → Importe seu repositório
- Framework Preset: **Next.js** (já detecta automaticamente)

3. **Configure as Environment Variables**
```
NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sua-chave-aqui
NEXT_PUBLIC_SITE_URL = https://seu-projeto.vercel.app
```

4. **Deploy**
- Clique em "Deploy"
- Aguarde ~2 minutos
- ✅ Pronto!

### Método 2: Via Vercel CLI

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Seguir as instruções no terminal
```

---

## 📱 Teste Rápido

Após o deploy, teste essas funcionalidades:

1. ✅ **Registro/Login** - Crie uma conta
2. ✅ **Dashboard** - Veja seu nome no topo
3. ✅ **Player** - Abra o Dia 1 e teste o vídeo
4. ✅ **Progresso** - Marque o Dia 1 como completo
5. ✅ **Comunidade** - Faça um post
6. ✅ **Realtime** - Abra em outra aba e veja o post aparecer automaticamente

---

## 🆘 Problemas Comuns

### Player não carrega
```bash
# Reinstale react-player
pnpm install react-player
```

### Build falha
```bash
# Teste localmente primeiro
pnpm build

# Se funcionar local mas falhar na Vercel:
# - Verifique as env vars na Vercel
# - Limpe o cache: Settings > General > Clear Cache
```

### Nome não aparece
Execute no SQL Editor do Supabase:
```sql
-- Ver usuários sem nome
SELECT * FROM users WHERE name IS NULL OR name = 'Membro';

-- Atualizar manualmente
UPDATE users 
SET name = 'Seu Nome Aqui'
WHERE email = 'seu-email@example.com';
```

### Realtime não funciona
1. Vá em Database > Replication
2. Habilite para tabela `comunidade`
3. Aguarde ~1 minuto
4. Recarregue a página

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- [`DEPLOY.md`](./DEPLOY.md) - Guia completo de deploy
- [`CHANGELOG.md`](./CHANGELOG.md) - Histórico de mudanças
- Scripts SQL em [`scripts/`](./scripts/)

---

## 🎯 Checklist Mínimo

Antes de considerar pronto:

- [ ] Projeto roda local sem erros
- [ ] Build funciona (`pnpm build`)
- [ ] Scripts SQL executados no Supabase
- [ ] Realtime habilitado
- [ ] Env vars configuradas (local e Vercel)
- [ ] Deploy na Vercel funcionando
- [ ] Login funciona
- [ ] Vídeos carregam
- [ ] Progresso salva

---

## 🔥 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Preview de produção local
pnpm start

# Lint
pnpm lint

# Limpar tudo e reinstalar
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
```

---

## 💡 Dicas

1. **Use pnpm** ao invés de npm para installs mais rápidos
2. **Teste local** antes de fazer push
3. **Monitore logs** da Vercel durante o deploy
4. **Habilite Analytics** na Vercel para ver acessos
5. **Faça backup** do banco de dados regularmente

---

## 📞 Precisa de Ajuda?

1. Verifique [`DEPLOY.md`](./DEPLOY.md) para troubleshooting detalhado
2. Veja os logs:
   - Vercel: Dashboard > Deployments > Ver logs
   - Supabase: Logs > Query Performance
   - Browser: F12 > Console
3. Confirme que todas as tabelas existem no Supabase

---

**Tempo estimado total:** 5-10 minutos
**Dificuldade:** ⭐⭐ (Fácil)
**Última atualização:** 25 de Outubro de 2025


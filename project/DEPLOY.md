# 🚀 Guia de Deploy - Desafio Corpo Definido 21D

## ✅ Correções Implementadas

### 1. Player de Vídeo YouTube
- ✅ Otimizado para usar `react-player/youtube` específico
- ✅ Configuração correta de player com legendas em português
- ✅ Load otimizado com dynamic import para reduzir bundle inicial

### 2. Sistema de Progresso
- ✅ Lógica de desbloqueio de semanas funcionando corretamente
- ✅ Semana 3 desbloqueia apenas quando Semanas 1 e 2 estão completas
- ✅ Cálculo de progresso centralizado em `lib/utils/progress.ts`

### 3. Comunidade em Tempo Real
- ✅ Implementado Supabase Realtime para postagens
- ✅ Atualizações automáticas sem refresh da página
- ✅ Sistema de curtidas funcionando

### 4. Personalização do Usuário
- ✅ Nome completo do usuário exibido no header
- ✅ Primeiro nome extraído e mostrado no dashboard
- ✅ Avatar com inicial do nome personalizada

### 5. Dependências
- ✅ Atualizadas para versões latest do Next.js e React
- ✅ Supabase SDK atualizado
- ✅ react-player configurado corretamente

### 6. Deploy Vercel
- ✅ Arquivo `vercel.json` criado com configurações otimizadas
- ✅ Build command e framework corretamente configurados

---

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# Site URL (para redirect do auth)
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
```

### Como obter as credenciais do Supabase:

1. Acesse [supabase.com](https://supabase.com)
2. Vá para o seu projeto
3. Clique em **Settings** > **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🗄️ Configuração do Banco de Dados

Execute os scripts SQL na ordem:

### 1. Criar Tabelas Principais
Execute o arquivo `scripts/001-create-tables.sql` no SQL Editor do Supabase.

### 2. Criar Tabelas Adicionais
Execute o arquivo `scripts/002-add-new-tables.sql` no SQL Editor do Supabase.

### 3. Habilitar Realtime (IMPORTANTE!)

No painel do Supabase:
1. Vá em **Database** > **Replication**
2. Encontre a tabela `comunidade`
3. Clique no botão para **habilitar realtime** na tabela

---

## 🌐 Deploy na Vercel

### Primeira vez (através do GitHub):

1. Faça push do código para o GitHub:
```bash
git add .
git commit -m "build: correção total projeto 21D"
git push origin main
```

2. Acesse [vercel.com](https://vercel.com)
3. Clique em **"Add New Project"**
4. Importe seu repositório do GitHub
5. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (use o domínio que a Vercel fornecer)
6. Clique em **Deploy**

### Deploy subsequentes:

Após a primeira configuração, todo push para `main` fará deploy automaticamente.

```bash
git add .
git commit -m "sua mensagem aqui"
git push origin main
```

### Verificar Deploy:

1. Acesse o dashboard da Vercel
2. Verifique se o build passou com sucesso
3. Clique no domínio para testar
4. Se o domínio principal não atualizou, vá em:
   - **Settings** > **Domains**
   - Certifique-se que seu domínio está marcado como **Primary**

---

## 🧪 Testar Localmente

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse: http://localhost:3000

---

## 🔍 Troubleshooting

### Player de vídeo não carrega

**Problema**: Vídeo não aparece ou fica preto.

**Solução**:
- Verifique se as URLs dos vídeos estão no formato correto
- Certifique-se que o `react-player` está instalado: `pnpm install react-player`

### Semana 3 não desbloqueia

**Problema**: Mesmo completando as semanas anteriores, a Semana 3 continua bloqueada.

**Solução**:
- Verifique se o progresso está sendo salvo no Supabase
- Confirme que todas as policies RLS estão configuradas corretamente
- Teste a query no SQL Editor:
```sql
SELECT * FROM user_progress WHERE user_id = 'seu_user_id';
```

### Nome do usuário não aparece

**Problema**: Mostra "Membro" ao invés do nome real.

**Solução**:
1. Verifique se o usuário foi criado corretamente na tabela `users`
2. Confirme que o trigger `on_auth_user_created` está ativo
3. Para usuários existentes, insira manualmente:
```sql
INSERT INTO users (id, name, email)
VALUES ('user_id_aqui', 'Nome Completo', 'email@example.com');
```

### Comunidade não atualiza em tempo real

**Problema**: Precisa dar refresh para ver novos posts.

**Solução**:
1. Habilite o Realtime no Supabase para a tabela `comunidade`
2. Verifique se as policies RLS permitem SELECT para todos os usuários autenticados
3. Verifique o console do navegador por erros de conexão

### Build falha na Vercel

**Problema**: O build falha com erros de TypeScript ou dependências.

**Solução**:
1. Teste o build localmente primeiro: `pnpm build`
2. Corrija todos os erros que aparecerem
3. Certifique-se que todas as variáveis de ambiente estão configuradas na Vercel
4. Limpe o cache da Vercel e tente novamente

---

## 📦 Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Rodar desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Lint
pnpm lint

# Limpar cache e reinstalar
rm -rf node_modules .next
pnpm install
```

---

## 🎯 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Scripts SQL executados no Supabase
- [ ] Realtime habilitado na tabela `comunidade`
- [ ] Build local funciona sem erros
- [ ] Deploy na Vercel bem-sucedido
- [ ] Player de vídeo funciona em produção
- [ ] Login/Logout funcionando
- [ ] Progresso sendo salvo corretamente
- [ ] Comunidade com posts em tempo real
- [ ] Nome do usuário aparecendo corretamente
- [ ] Responsivo em mobile, tablet e desktop

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs da Vercel (Deployments > Ver logs)
2. Verifique o console do navegador (F12)
3. Verifique os logs do Supabase (Logs > Query Performance)

---

## 🔥 Próximos Passos (Opcionais)

- [ ] Configurar domínio customizado na Vercel
- [ ] Adicionar analytics e monitoramento
- [ ] Configurar emails transacionais do Supabase
- [ ] Adicionar sistema de notificações
- [ ] Implementar recuperação de senha
- [ ] Adicionar testes automatizados


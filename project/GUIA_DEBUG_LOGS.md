# 🔍 GUIA DE DEBUG - LOGS DE AUTENTICAÇÃO

## 🎯 Objetivo

Este documento explica como usar os logs de debug implementados para diagnosticar problemas de autenticação e sessão no projeto Desafio 21D.

---

## 📊 LOGS IMPLEMENTADOS

### 1. 🍪 Cookie Debug (Server)
**Arquivo:** `lib/supabase/server.ts`

**Logs gerados:**
```
[Cookie Debug] Supabase URL: https://seu-projeto.supabase.co
[Cookie Debug] Supabase Key: ✅ OK
[Cookie Debug] Cookies recebidos no SSR: ['sb-xxx-auth-token', 'sb-xxx-auth-token-code-verifier']
[Cookie Debug] Total de cookies: 2
[Cookie Debug] GET sb-xxx-auth-token: ✅ Encontrado
[Cookie Debug] SET sb-xxx-auth-token: eyJhbGciOiJIUzI1NiI...
```

**O que verificar:**
- ✅ URL e Key estão configurados
- ✅ Cookies estão sendo recebidos no SSR
- ✅ Cookie auth-token está presente
- ❌ Se "Total de cookies: 0" → problema na criação

---

### 2. 🛡️ Middleware Debug
**Arquivo:** `middleware.ts`

**Logs gerados:**
```
[Middleware Debug] ==========================================
[Middleware Debug] Request path: /dashboard
[Middleware Debug] Cookies no request: ['sb-xxx-auth-token', 'sb-xxx-auth-token-code-verifier']
[Middleware Debug] Setando cookies: ['sb-xxx-auth-token']
[Middleware Debug] Sessão detectada: ✅ Ativa
[Middleware Debug] Usuário da sessão: teste@gmail.com
[Middleware Debug] ✅ Permitindo acesso a: /dashboard
[Middleware Debug] ==========================================
```

**O que verificar:**
- ✅ Cookies estão no request
- ✅ Sessão foi detectada como ativa
- ✅ Usuário foi identificado
- ❌ Se "Sessão: Inativa" → cookies não estão válidos

---

### 3. 🏠 Dashboard Debug
**Arquivo:** `app/dashboard/page.tsx`

**Logs gerados:**
```
[Dashboard Debug] ==========================================
[Dashboard Debug] Render SSR iniciado
[Dashboard Debug] Supabase client criado no SSR
[Dashboard Debug] ✅ Usuário autenticado: teste@gmail.com
[Dashboard Debug] User ID: a1b2c3d4-...
[Dashboard Debug] Buscando dados do usuário da tabela users...
[Dashboard Debug] ✅ Dados do usuário carregados: João Silva
[Dashboard Debug] Buscando progresso do usuário...
[Dashboard Debug] ✅ Renderizando dashboard com 14 dias completos
[Dashboard Debug] Dias completos: [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
[Dashboard Debug] ==========================================
```

**O que verificar:**
- ✅ SSR conseguiu criar client
- ✅ Usuário foi autenticado
- ✅ Dados foram carregados do banco
- ❌ Se "Nenhum usuário detectado" → cookies não foram lidos

---

### 4. 🔐 Login Debug
**Arquivo:** `app/login/page.tsx`

**Logs gerados:**
```
[Auth Debug] Login iniciado teste@gmail.com
[Auth Debug] Login bem-sucedido: teste@gmail.com
[Auth Debug] Sessão ativa: teste@gmail.com
[Auth Debug] Criando registro de usuário...
[Auth Debug] Usuário criado com sucesso
[Auth Debug] Redirecionando para dashboard...
```

**O que verificar:**
- ✅ Login completou sem erros
- ✅ Sessão foi criada
- ✅ Usuário foi criado/encontrado na tabela
- ❌ Se "Sessão não foi criada" → problema no Supabase Auth

---

### 5. 🔄 Auth Callback Debug
**Arquivo:** `app/auth/callback/route.ts`

**Logs gerados:**
```
[Auth Callback] Processing callback with code: present
[Auth Callback] Session created successfully for: teste@gmail.com
```

**O que verificar:**
- ✅ Code foi recebido
- ✅ Sessão foi criada com sucesso
- ❌ Se "Error exchanging code" → problema no Supabase

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Problema 1: "Sessão Inativa" no Middleware

**Sintoma:**
```
[Middleware Debug] Sessão detectada: ❌ Inativa
[Middleware Debug] ❌ Bloqueando acesso não autenticado
```

**Possíveis Causas:**
1. Cookies não estão sendo criados no login
2. Cookies estão sendo bloqueados pelo navegador
3. Domínio dos cookies está incorreto

**Solução:**
```
1. Verifique no navegador: F12 > Application > Cookies
2. Deve ter: sb-xxx-auth-token
3. Se não tiver, veja logs do login
4. Se "Sessão ativa" apareceu no login mas não no middleware:
   - Problema de sincronização
   - Aguarde 1-2 segundos após login antes de acessar dashboard
```

---

### Problema 2: "Nenhum usuário detectado" no Dashboard

**Sintoma:**
```
[Dashboard Debug] ❌ Nenhum usuário detectado, redirecionando para login
```

**Possíveis Causas:**
1. Middleware permitiu acesso mas SSR não pegou os cookies
2. Cookies expiraram entre middleware e SSR
3. Problema na função supabaseServer()

**Solução:**
```
1. Verifique logs anteriores do Cookie Debug
2. Se "Total de cookies: 0" → cookies não chegaram no SSR
3. Verifique se middleware setou cookies no response
4. Limpe cache do navegador e tente novamente
```

---

### Problema 3: "Total de cookies: 0" no SSR

**Sintoma:**
```
[Cookie Debug] Cookies recebidos no SSR: []
[Cookie Debug] Total de cookies: 0
```

**Possíveis Causas:**
1. Cookies não foram criados no login
2. SameSite ou Secure bloqueando cookies
3. Path dos cookies incorreto

**Solução:**
```
1. Verifique logs do login
2. Se "SET sb-xxx-auth-token" apareceu → cookies foram criados
3. Problema pode ser no navegador ou domínio
4. Teste em modo anônimo
5. Verifique se HTTPS está ativo em produção
```

---

### Problema 4: Loop de Redirecionamento

**Sintoma:**
```
[Middleware Debug] ✅ Ativa
[Dashboard Debug] ❌ Nenhum usuário
→ Redireciona para /login
→ Middleware detecta sessão
→ Redireciona para /dashboard
→ Loop infinito
```

**Possíveis Causas:**
1. Middleware vê sessão mas SSR não vê
2. Cookies não estão sendo propagados corretamente

**Solução:**
```
1. Verifique se os mesmos cookies aparecem em:
   - [Middleware Debug] Cookies no request
   - [Cookie Debug] Cookies recebidos no SSR
2. Se diferentes → problema no NextResponse
3. Adicione delay maior no login (1000ms ao invés de 500ms)
```

---

## 🧪 FLUXO DE TESTE

### Teste Completo com Logs:

**1. Acesse /login**
```
Nenhum log esperado (página pública)
```

**2. Preencha email/senha e clique "Entrar"**
```
[Auth Debug] Login iniciado teste@gmail.com
[Auth Debug] Login bem-sucedido: teste@gmail.com
[Auth Debug] Sessão ativa: teste@gmail.com
[Auth Debug] Usuário encontrado: teste@gmail.com
[Auth Debug] Redirecionando para dashboard...
```

**3. Redirect para /dashboard (automaticamente)**
```
[Middleware Debug] ==========================================
[Middleware Debug] Request path: /dashboard
[Middleware Debug] Cookies no request: ['sb-xxx-auth-token', '...']
[Middleware Debug] Sessão detectada: ✅ Ativa
[Middleware Debug] Usuário da sessão: teste@gmail.com
[Middleware Debug] ✅ Permitindo acesso a: /dashboard
[Middleware Debug] ==========================================
```

**4. Dashboard SSR renderiza**
```
[Dashboard Debug] ==========================================
[Dashboard Debug] Render SSR iniciado
[Cookie Debug] Supabase URL: https://xxx.supabase.co
[Cookie Debug] Supabase Key: ✅ OK
[Cookie Debug] Cookies recebidos no SSR: ['sb-xxx-auth-token', '...']
[Cookie Debug] Total de cookies: 2
[Cookie Debug] GET sb-xxx-auth-token: ✅ Encontrado
[Dashboard Debug] Supabase client criado no SSR
[Dashboard Debug] ✅ Usuário autenticado: teste@gmail.com
[Dashboard Debug] User ID: a1b2c3d4-...
[Dashboard Debug] Buscando dados do usuário...
[Dashboard Debug] ✅ Dados do usuário carregados: João Silva
[Dashboard Debug] ✅ Renderizando dashboard com 14 dias completos
[Dashboard Debug] ==========================================
```

**5. Dê F5 na página**
```
(Repete logs do passo 3 e 4)
✅ Deve manter sessão e continuar no dashboard
```

---

## 📊 CHECKLIST DE LOGS ESPERADOS

### ✅ Login Bem-Sucedido:
- [x] `[Auth Debug] Login iniciado`
- [x] `[Auth Debug] Login bem-sucedido`
- [x] `[Auth Debug] Sessão ativa`
- [x] `[Auth Debug] Usuário encontrado`
- [x] `[Auth Debug] Redirecionando`

### ✅ Middleware Funcionando:
- [x] `[Middleware Debug] Cookies no request: [...]` (não vazio)
- [x] `[Middleware Debug] Sessão detectada: ✅ Ativa`
- [x] `[Middleware Debug] Usuário da sessão: email`
- [x] `[Middleware Debug] ✅ Permitindo acesso`

### ✅ SSR Funcionando:
- [x] `[Cookie Debug] Cookies recebidos no SSR: [...]` (não vazio)
- [x] `[Cookie Debug] GET sb-xxx-auth-token: ✅ Encontrado`
- [x] `[Dashboard Debug] ✅ Usuário autenticado`
- [x] `[Dashboard Debug] ✅ Dados do usuário carregados`

---

## 🚨 ALERTAS IMPORTANTES

### ❌ Se ver isso:
```
[Cookie Debug] Total de cookies: 0
```
**Problema:** Cookies não estão chegando no SSR  
**Ação:** Verificar middleware e navegador

### ❌ Se ver isso:
```
[Middleware Debug] Sessão detectada: ❌ Inativa
```
**Problema:** Cookies inválidos ou expirados  
**Ação:** Fazer login novamente

### ❌ Se ver isso:
```
[Dashboard Debug] ❌ Nenhum usuário detectado
```
**Problema:** SSR não conseguiu ler cookies  
**Ação:** Verificar logs de Cookie Debug acima

---

## 🔧 COMO ACESSAR OS LOGS

### Em Desenvolvimento (localhost):
```
Terminal onde rodou `pnpm dev`
Todos os logs aparecem ali
```

### Em Produção (Vercel):
```
1. Acesse: https://vercel.com/dashboard
2. Entre no projeto
3. Clique em: Deployments > Latest
4. Clique em: View Function Logs
5. OU clique em: Runtime Logs
```

### No Navegador:
```
F12 > Console
Logs do client aparecem ali:
- [Auth Debug] Login iniciado
- [Auth Debug] Sessão ativa
- etc
```

---

## 📋 INTERPRETAÇÃO DOS LOGS

### ✅ Tudo Funcionando:
```
[Auth Debug] Login bem-sucedido ✅
[Auth Debug] Sessão ativa ✅
[Middleware Debug] Sessão detectada: ✅ Ativa
[Cookie Debug] Total de cookies: 2 ✅
[Dashboard Debug] ✅ Usuário autenticado ✅
```

### ❌ Problema no Login:
```
[Auth Debug] Login iniciado
[Auth Debug] Erro de login: Invalid credentials ❌
```
**Solução:** Email ou senha incorretos

### ❌ Problema na Sessão:
```
[Auth Debug] Login bem-sucedido ✅
[Auth Debug] Sessão não foi criada após login ❌
```
**Solução:** Problema no Supabase Auth - verificar configuração

### ❌ Problema no Middleware:
```
[Middleware Debug] Cookies no request: [] ❌
[Middleware Debug] Sessão detectada: ❌ Inativa
```
**Solução:** Cookies não foram criados ou bloqueados

### ❌ Problema no SSR:
```
[Cookie Debug] Total de cookies: 0 ❌
[Dashboard Debug] ❌ Nenhum usuário detectado
```
**Solução:** Cookies não chegaram no SSR - verificar middleware

---

## 🎯 FLUXO DE DEBUG

```
1. Faça login
   ↓
2. Veja console do navegador (F12)
   - Deve ter logs [Auth Debug]
   ↓
3. Se redirect para /dashboard, veja logs da Vercel
   - Deve ter logs [Middleware Debug]
   - Deve ter logs [Cookie Debug]
   - Deve ter logs [Dashboard Debug]
   ↓
4. Identifique onde está o ❌
   ↓
5. Consulte seção "Interpretação dos Logs" acima
   ↓
6. Aplique a solução sugerida
```

---

## 🔍 CENÁRIOS COMUNS

### Cenário 1: Login OK mas volta para /login

**Logs esperados:**
```
✅ [Auth Debug] Sessão ativa
❌ [Middleware Debug] Sessão detectada: Inativa
```

**Causa:** Cookies não estão sendo enviados no request subsequente

**Solução:**
1. Verifique cookies no navegador (F12 > Application > Cookies)
2. Limpe cookies e tente novamente
3. Teste em modo anônimo
4. Verifique se está usando HTTPS em produção

---

### Cenário 2: Middleware permite mas Dashboard rejeita

**Logs esperados:**
```
✅ [Middleware Debug] Sessão detectada: Ativa
❌ [Cookie Debug] Total de cookies: 0
```

**Causa:** Cookies não estão sendo propagados do middleware para SSR

**Solução:**
1. Problema no NextResponse
2. Verifique se middleware está retornando `supabaseResponse`
3. Verifique se cookies foram setados no response

---

### Cenário 3: Tudo parece OK mas não funciona

**Logs esperados:**
```
✅ [Auth Debug] Sessão ativa
✅ [Middleware Debug] Sessão detectada: Ativa
✅ [Cookie Debug] Cookies recebidos: [...]
❌ [Dashboard Debug] ❌ Nenhum usuário detectado
```

**Causa:** Cookies chegaram mas são inválidos

**Solução:**
1. Verifique se os cookies têm o mesmo nome/prefixo
2. Verifique se `storageKey` é consistente (sb-21d-auth)
3. Limpe todos os cookies e faça login novamente

---

## 📱 EXEMPLO DE LOG COMPLETO (SUCESSO)

```
====== NAVEGADOR (Console) ======
[Auth Debug] Login iniciado teste@gmail.com
[Auth Debug] Login bem-sucedido: teste@gmail.com
[Auth Debug] Sessão ativa: teste@gmail.com
[Auth Debug] Usuário encontrado: teste@gmail.com
[Auth Debug] Redirecionando para dashboard...

====== VERCEL (Function Logs) ======
[Middleware Debug] ==========================================
[Middleware Debug] Request path: /dashboard
[Middleware Debug] Cookies no request: ['sb-ivwqpzjpqoapojodcvzc-auth-token', 'sb-ivwqpzjpqoapojodcvzc-auth-token-code-verifier']
[Middleware Debug] Sessão detectada: ✅ Ativa
[Middleware Debug] Usuário da sessão: teste@gmail.com
[Middleware Debug] ✅ Permitindo acesso a: /dashboard
[Middleware Debug] ==========================================

[Dashboard Debug] ==========================================
[Dashboard Debug] Render SSR iniciado
[Cookie Debug] Supabase URL: https://ivwqpzjpqoapojodcvzc.supabase.co
[Cookie Debug] Supabase Key: ✅ OK
[Cookie Debug] Cookies recebidos no SSR: ['sb-ivwqpzjpqoapojodcvzc-auth-token', 'sb-ivwqpzjpqoapojodcvzc-auth-token-code-verifier']
[Cookie Debug] Total de cookies: 2
[Cookie Debug] GET sb-ivwqpzjpqoapojodcvzc-auth-token: ✅ Encontrado
[Dashboard Debug] Supabase client criado no SSR
[Dashboard Debug] ✅ Usuário autenticado: teste@gmail.com
[Dashboard Debug] User ID: 123e4567-e89b-12d3-a456-426614174000
[Dashboard Debug] Buscando dados do usuário da tabela users...
[Dashboard Debug] ✅ Dados do usuário carregados: Teste Silva
[Dashboard Debug] Buscando progresso do usuário...
[Dashboard Debug] ✅ Renderizando dashboard com 14 dias completos
[Dashboard Debug] Dias completos: [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
[Dashboard Debug] ==========================================
```

**✅ SUCESSO TOTAL!**

---

## 🛠️ FERRAMENTAS DE DEBUG

### 1. Console do Navegador (F12)
```
Console tab
Filtre por: [Auth Debug]
```

### 2. Vercel Logs
```
Dashboard > Deployments > Latest > View Function Logs
Filtre por: [Middleware Debug] ou [Dashboard Debug]
```

### 3. Network Tab
```
F12 > Network
Veja requisições para /dashboard
Headers > Cookies
Deve ter: sb-xxx-auth-token
```

### 4. Application Tab
```
F12 > Application > Cookies > seu-dominio
Liste todos os cookies do Supabase
```

---

## 📞 TROUBLESHOOTING RÁPIDO

| Sintoma | Log Key | Ação |
|---------|---------|------|
| Loop de redirect | `[Middleware Debug] Sessão: Ativa` + `[Dashboard Debug] Nenhum usuário` | Cookies não propagando do middleware |
| Sempre vai para /login | `[Middleware Debug] Sessão: Inativa` | Cookies não foram criados no login |
| Erro no login | `[Auth Debug] Erro de login` | Credenciais incorretas ou Supabase offline |
| Dashboard vazio | `[Dashboard Debug] ❌ Erro ao buscar` | Problema de RLS ou tabela |

---

## ✅ RESULTADO ESPERADO

Após implementar todos os logs:

**Console (Navegador):**
- 5-7 linhas de `[Auth Debug]`

**Vercel Logs:**
- 10-15 linhas de `[Middleware Debug]`
- 15-20 linhas de `[Cookie Debug]`
- 10-15 linhas de `[Dashboard Debug]`

**Total:** ~40-50 linhas de logs por login completo

**Com isso você consegue identificar EXATAMENTE onde está quebrando!** 🎯

---

**Data:** 25 de Outubro de 2025  
**Versão:** 1.6.0 (Debug Enhanced)  
**Status:** ✅ LOGS COMPLETOS IMPLEMENTADOS


# 💪 Desafio 21D - Área de Membros

Plataforma de transformação física com Supabase + Next.js 16 + TailwindCSS 4.

## 🚀 Funcionalidades

- ✅ **Autenticação** com Supabase Auth
- ✅ **Dashboard gamificado** com progresso visual
- ✅ **Sistema de progresso** e desbloqueio automático de semanas
- ✅ **Comunidade** com atualizações em tempo real (Realtime)
- ✅ **Diário 21D** para acompanhamento diário
- ✅ **Integração** com GGCheckout via Webhook
- ✅ **Player de vídeos** YouTube integrado

## ⚙️ Tecnologias

- **Next.js 16** - Framework React
- **Supabase** - Backend (Auth + Database + Realtime)
- **TailwindCSS 4** - Estilização
- **TypeScript** - Tipagem estática
- **Vercel** - Deploy e hospedagem

## 📦 Instalação

```bash
# Clonar o repositório
git clone https://github.com/JOTAERRERARO/desafio21d-areademembros.git

# Entrar no diretório
cd desafio21d-areademembros/project

# Instalar dependências
pnpm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Configurar variáveis de ambiente no .env.local
```

## 🔐 Configuração (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GG_WEBHOOK_SECRET=your_webhook_secret
```

## 🎯 Comandos

```bash
# Desenvolvimento local
pnpm dev

# Build de produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Linting
pnpm lint
```

## 📁 Estrutura do Projeto

```
project/
├── app/                    # Rotas Next.js
│   ├── auth/              # Callback de autenticação
│   ├── dashboard/          # Dashboard principal
│   ├── login/             # Página de login
│   ├── video/[id]/        # Player de vídeo
│   └── api/               # API Routes
├── components/             # Componentes React
│   ├── ui/                # Componentes UI reutilizáveis
│   └── ...                # Componentes específicos
├── lib/                   # Utilitários e helpers
│   ├── supabase/          # Clientes Supabase
│   └── data/              # Dados estáticos
├── public/                # Assets estáticos
└── scripts/               # Scripts SQL para Supabase
```

## 🎨 Características

### Dashboard
- Progresso visual com barras animadas
- Badges de conquistas
- Status de desbloqueio das semanas
- Realtime para atualizações instantâneas

### Comunidade
- Postagens em tempo real
- Curtidas e interações
- Feed dinâmico sem necessidade de refresh

### Sistema de Progresso
- Rastreamento automático de dias completos
- Desbloqueio progressivo das semanas (2 → 3)
- Histórico de desempenho

## 🚀 Deploy

O projeto está configurado para deploy automático na Vercel:

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 📝 Licença

Este projeto é privado e confidencial.

## 👤 Autor

Projeto desenvolvido para o Desafio 21D.

---

**Status:** ✅ Produção  
**Versão:** 1.0.0  
**Última atualização:** 2025

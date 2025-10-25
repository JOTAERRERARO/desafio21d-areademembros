# 🔥 Desafio Corpo Definido 21D - Área de Membros

<div align="center">

![Status](https://img.shields.io/badge/status-production-success)
![Next.js](https://img.shields.io/badge/Next.js-latest-black)
![React](https://img.shields.io/badge/React-latest-blue)
![Supabase](https://img.shields.io/badge/Supabase-enabled-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**Plataforma completa de acompanhamento para o desafio de 21 dias de transformação corporal**

[Demo](#) • [Documentação](./DEPLOY.md) • [Changelog](./CHANGELOG.md) • [Quick Start](./QUICK_START.md)

</div>

---

## 🎯 Sobre o Projeto

Área de membros premium para o **Desafio Corpo Definido 21D**, com sistema completo de:
- ✅ 21 treinos em vídeo organizados em 3 semanas
- ✅ Sistema de progresso com desbloqueio progressivo
- ✅ Comunidade em tempo real
- ✅ Dashboard personalizado
- ✅ Acompanhamento de metas e estatísticas

---

## ✨ Funcionalidades

### 🏋️ Sistema de Treinos
- 21 dias de treinos em vídeo (YouTube)
- Organização em 3 semanas progressivas
- Sistema de desbloqueio por conclusão
- Player otimizado com legendas em português

### 📊 Dashboard Inteligente
- Progresso personalizado por usuário
- Estatísticas de dias completos e sequência
- Cards interativos com animações
- Identificação por primeiro nome

### 👥 Comunidade Realtime
- Posts públicos entre membros
- Sistema de curtidas
- Atualizações em tempo real (sem refresh)
- Rankings e top membros

### 🎨 Design Moderno
- Tema dark com gradientes laranja/amarelo
- Totalmente responsivo (mobile-first)
- Animações suaves e micro-interações
- UI/UX otimizada para engajamento

---

## 🚀 Correções Implementadas (v1.0)

### ✅ Player de Vídeo
- Otimizado para YouTube com `react-player/youtube`
- Configuração correta de legendas PT-BR
- Load dinâmico para performance

### ✅ Sistema de Desbloqueio
- Semana 3 desbloqueia apenas quando 1 e 2 estão completas
- Lógica centralizada e consistente
- Sincronização com Supabase

### ✅ Comunidade Realtime
- Implementado Supabase Realtime
- Posts aparecem automaticamente
- Sistema de likes funcionando

### ✅ Personalização
- Nome completo do usuário exibido
- Primeiro nome no dashboard
- Avatar com inicial personalizada

### ✅ Deploy e Produção
- Arquivo `vercel.json` configurado
- Dependências atualizadas
- Build otimizado

---

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com SSR
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos

### Backend
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Realtime
  - Storage
  - Row Level Security

### Deploy
- **Vercel** - Hospedagem e CI/CD
- **GitHub** - Controle de versão

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- pnpm, npm ou yarn
- Conta no Supabase
- Conta na Vercel (opcional)

### Instalação Rápida

```bash
# Clone o repositório
git clone seu-repo.git
cd project

# Instale dependências
pnpm install

# Configure .env.local
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# Execute os scripts SQL no Supabase
# Ver arquivos em scripts/

# Rode o projeto
pnpm dev
```

📖 **Guia Completo**: [QUICK_START.md](./QUICK_START.md)

---

## 🎬 Como Usar

### 1. Primeiro Acesso
1. Crie sua conta com email e senha
2. Você será redirecionado para o dashboard
3. Seu nome aparecerá no topo da página

### 2. Começar o Desafio
1. Clique em "IR PARA O TREINO DE HOJE"
2. Assista ao vídeo do treino
3. Complete o treino
4. Marque como completo

### 3. Acompanhar Progresso
- Veja suas estatísticas no dashboard
- Acompanhe o progresso semanal
- Verifique sua sequência de dias

### 4. Interagir na Comunidade
1. Acesse "Comunidade" no menu lateral
2. Compartilhe suas conquistas
3. Curta posts de outros membros
4. Veja atualizações em tempo real

---

## 📂 Estrutura do Projeto

```
project/
├── app/                      # Pages e rotas (Next.js 15)
│   ├── api/                  # API routes
│   ├── dashboard/            # Página principal
│   ├── login/                # Autenticação
│   └── video/[id]/           # Player de vídeo
├── components/               # Componentes React
│   ├── ui/                   # Componentes base (Radix UI)
│   ├── dashboard.tsx         # Dashboard principal
│   ├── video-player.tsx      # Player de vídeo
│   ├── community-page.tsx    # Comunidade
│   └── ...
├── lib/                      # Utilitários e lógica
│   ├── actions/              # Server actions
│   ├── data/                 # Dados estáticos (treinos)
│   ├── supabase/             # Config Supabase
│   ├── types/                # TypeScript types
│   └── utils/                # Funções auxiliares
├── scripts/                  # Scripts SQL
│   ├── 001-create-tables.sql
│   ├── 002-add-new-tables.sql
│   └── ...
├── public/                   # Arquivos estáticos
├── styles/                   # CSS global
├── DEPLOY.md                 # Guia de deploy
├── CHANGELOG.md              # Histórico de mudanças
├── QUICK_START.md            # Guia rápido
└── README.md                 # Este arquivo
```

---

## 🔧 Configuração

### Variáveis de Ambiente

Crie `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Banco de Dados

Execute os scripts SQL na ordem:
1. `scripts/001-create-tables.sql` - Tabelas principais
2. `scripts/002-add-new-tables.sql` - Tabelas adicionais
3. `scripts/003-enable-realtime.sql` - Configurar realtime

Depois, habilite Realtime manualmente:
- Database > Replication > Tabela `comunidade`

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor dev em localhost:3000

# Produção
pnpm build            # Build de produção
pnpm start            # Inicia servidor de produção

# Qualidade
pnpm lint             # Executar ESLint

# Manutenção
pnpm install          # Instalar/atualizar dependências
```

---

## 🧪 Testes

### Checklist Manual
- [ ] Login/Logout funciona
- [ ] Dashboard carrega com nome do usuário
- [ ] Vídeos carregam e reproduzem
- [ ] Progresso é salvo ao marcar dia completo
- [ ] Semanas 2 e 3 desbloqueiam corretamente
- [ ] Posts na comunidade aparecem em realtime
- [ ] Sistema de curtidas funciona
- [ ] Responsivo em mobile/tablet/desktop

---

## 🌐 Deploy

### Vercel (Recomendado)

```bash
# Via GitHub (automatizado)
git push origin main

# Ou via CLI
vercel --prod
```

### Requisitos
- Variáveis de ambiente configuradas na Vercel
- Scripts SQL executados no Supabase
- Realtime habilitado

📖 **Guia Completo**: [DEPLOY.md](./DEPLOY.md)

---

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Autenticação via Supabase Auth
- ✅ Validação de permissões por usuário
- ✅ SQL injection protegido por prepared statements
- ✅ HTTPS enforced em produção

---

## 📈 Performance

- ⚡ Lighthouse Score: 90+
- ⚡ First Contentful Paint: < 1.5s
- ⚡ Time to Interactive: < 3s
- ⚡ Dynamic imports para código pesado
- ⚡ Image optimization automático (Next.js)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é proprietário e confidencial.
Todos os direitos reservados © 2025

---

## 🆘 Suporte

### Documentação
- [Guia de Deploy](./DEPLOY.md)
- [Quick Start](./QUICK_START.md)
- [Changelog](./CHANGELOG.md)

### Problemas Comuns
Consulte a seção **Troubleshooting** em [DEPLOY.md](./DEPLOY.md#-troubleshooting)

### Logs
- **Vercel**: Dashboard > Deployments > Logs
- **Supabase**: Logs > Query Performance
- **Browser**: F12 > Console

---

## 🎯 Roadmap

### Em Breve
- [ ] Sistema de notificações push
- [ ] App mobile (React Native)
- [ ] Integração com wearables
- [ ] Modo offline

### Futuro
- [ ] Gamificação (badges, conquistas)
- [ ] Desafios personalizados
- [ ] Planos de nutrição integrados
- [ ] Marketplace de equipamentos

---

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ para transformar vidas através do fitness.

---

## 📊 Estatísticas

- **21 dias** de transformação
- **3 semanas** progressivas
- **25 vídeos** (21 principais + 4 extras)
- **Comunidade** em tempo real
- **100%** responsivo

---

**Versão:** 1.0.0  
**Status:** ✅ Em Produção  
**Última Atualização:** 25 de Outubro de 2025

<div align="center">

**[⬆ Voltar ao topo](#-desafio-corpo-definido-21d---área-de-membros)**

</div>


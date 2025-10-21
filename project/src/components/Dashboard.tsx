import { Calendar, Flame, Play, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      icon: Calendar,
      value: user?.completedDays.length || 0,
      label: 'Dias Feitos',
      color: 'text-primary',
    },
    {
      icon: Flame,
      value: user?.streak || 0,
      label: 'Dias Seguidos',
      color: 'text-red-500',
    },
    {
      icon: Play,
      value: user?.videosWatched || 0,
      label: 'Vídeos',
      color: 'text-secondary',
    },
    {
      icon: Target,
      value: '75%',
      label: 'Para Semana 3',
      color: 'text-accent-green',
    },
  ];

  const weekProgress = [
    { week: 1, title: 'BASE E REATIVAÇÃO', progress: 100, status: 'completed' },
    { week: 2, title: 'QUEIMA E DEFINIÇÃO', progress: 65, status: 'current' },
    { week: 3, title: 'PERFORMANCE', progress: 0, status: 'locked' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-dark-card via-dark-card to-primary/10 rounded-2xl p-8 border border-dark-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg')] opacity-10 bg-cover bg-center" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
            <Flame className="text-primary" size={32} />
            BEM-VINDO DE VOLTA, {user?.name.toUpperCase()}!
          </h1>
          <p className="text-lg text-gray-300 mb-1">
            Você está no <span className="font-bold text-primary">DIA {user?.currentDay}</span> de 21
          </p>
          <p className="text-gray-400 mb-6">
            Continue assim! A transformação acontece um treino de cada vez.
          </p>
          <button className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50">
            ▶ TREINO DO DIA: PUSH + CORE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-dark-card border border-dark-border rounded-xl p-6 hover:translate-y-[-4px] transition-all hover:shadow-xl hover:shadow-primary/10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <stat.icon className={`${stat.color} mb-3`} size={28} />
            <div className="text-4xl font-black mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-primary" size={24} />
          <h2 className="text-xl font-bold">SEU TREINO DE HOJE</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/5">
            <div className="aspect-video bg-dark-bg rounded-lg overflow-hidden relative group cursor-pointer">
              <img
                src="https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg"
                alt="Treino do dia"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={28} fill="white" />
                </div>
              </div>
              <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                DIA 14
              </div>
            </div>
          </div>
          <div className="md:w-3/5 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2">PUSH + CORE</h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-400">
                <span className="font-semibold">Duração:</span> 25 min
              </p>
              <p className="text-gray-400">
                <span className="font-semibold">Nível:</span> Intermediário
              </p>
            </div>
            <button className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg transition-all hover:scale-105 w-full md:w-auto">
              ▶ COMEÇAR AGORA
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">SEU PROGRESSO SEMANAL</h2>
        <div className="space-y-4">
          {weekProgress.map((week) => (
            <div key={week.week} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold">SEMANA {week.week}: {week.title}</span>
                  {week.status === 'completed' && (
                    <span className="text-accent-green text-sm">✅ 100% CONCLUÍDA</span>
                  )}
                  {week.status === 'current' && (
                    <span className="text-primary text-sm">🔥 {week.progress}% EM PROGRESSO</span>
                  )}
                  {week.status === 'locked' && (
                    <span className="text-gray-500 text-sm">🔒 BLOQUEADA</span>
                  )}
                </div>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    week.status === 'completed'
                      ? 'bg-accent-green'
                      : week.status === 'current'
                      ? 'bg-gradient-to-r from-primary to-red-500'
                      : 'bg-gray-700'
                  }`}
                  style={{ width: `${week.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          💬 ATUALIZAÇÕES DA COMUNIDADE
        </h2>
        <div className="space-y-4">
          {[
            {
              name: 'Carlos M.',
              action: 'completou Dia 21! 🎉',
              comment: 'Melhor decisão que tomei esse ano',
              time: 'há 2 horas',
            },
            {
              name: 'Rafael S.',
              action: 'postou uma transformação',
              comment: 'Ver foto',
              time: 'há 5 horas',
            },
          ].map((update, index) => (
            <div key={index} className="flex gap-3 pb-4 border-b border-dark-border last:border-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center font-bold flex-shrink-0">
                {update.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {update.name} <span className="font-normal text-gray-400">{update.action}</span>
                </p>
                <p className="text-sm text-gray-400">{update.comment}</p>
                <p className="text-xs text-gray-500 mt-1">{update.time}</p>
              </div>
            </div>
          ))}
          <button className="w-full text-center text-sm text-primary hover:text-primary-light font-semibold py-2 hover:bg-white/5 rounded-lg transition-colors">
            VER TODAS AS ATUALIZAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
}

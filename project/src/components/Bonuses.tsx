import { Gift, BookOpen, Podcast, Play, Brain, Download, ExternalLink } from 'lucide-react';

const bonuses = [
  {
    id: 1,
    icon: BookOpen,
    title: 'E-book: 21 Hábitos de um Homem Disciplinado',
    description: 'Guia completo para construir rotinas inabaláveis',
    type: 'PDF - 85 páginas',
    color: 'text-accent-yellow',
    bgColor: 'bg-accent-yellow/10',
    borderColor: 'border-accent-yellow/30',
  },
  {
    id: 2,
    icon: Podcast,
    title: 'Podcast: A Mentalidade de Alta Performance',
    description: '5 episódios exclusivos sobre mindset e produtividade',
    type: 'Áudio - 2h 15min total',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/30',
  },
  {
    id: 3,
    icon: Play,
    title: 'Treino Extra: Full Body Burn 40 Min',
    description: 'Workout avançado para dias que você quer mais',
    type: 'Vídeo - 40 minutos',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
  },
  {
    id: 4,
    icon: Brain,
    title: 'Workshop: Como Não Desistir Após o Desafio',
    description: 'Estratégias para manter momentum após os 21 dias',
    type: 'Vídeo - 55 minutos',
    color: 'text-accent-green',
    bgColor: 'bg-accent-green/10',
    borderColor: 'border-accent-green/30',
  },
];

export function Bonuses() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-dark-card via-dark-card to-accent-yellow/10 rounded-2xl p-8 border border-dark-border">
        <div className="flex items-start gap-3 mb-4">
          <Gift className="text-accent-yellow" size={40} />
          <div>
            <h1 className="text-2xl font-black mb-1">BÔNUS EXCLUSIVOS</h1>
            <p className="text-gray-400">Recursos extras para elevar seu desempenho</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {bonuses.map((bonus) => (
          <div
            key={bonus.id}
            className={`bg-dark-card border-2 ${bonus.borderColor} rounded-xl p-6 hover:scale-[1.02] transition-all hover:shadow-xl ${bonus.bgColor}`}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center justify-center md:w-24 md:h-24 w-16 h-16 rounded-full bg-dark-bg flex-shrink-0 mx-auto md:mx-0">
                <bonus.icon className={bonus.color} size={40} />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">{bonus.title}</h3>
                <p className="text-gray-400 mb-2">{bonus.description}</p>
                <p className="text-sm text-gray-500 mb-4">{bonus.type}</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  {bonus.id === 3 ? (
                    <a
                      href="https://example.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 ${bonus.color} hover:opacity-80 font-bold py-3 px-6 rounded-lg transition-all border-2 ${bonus.borderColor}`}
                    >
                      <ExternalLink size={20} />
                      Assistir Agora
                    </a>
                  ) : (
                    <button className={`inline-flex items-center justify-center gap-2 ${bonus.color} hover:opacity-80 font-bold py-3 px-6 rounded-lg transition-all border-2 ${bonus.borderColor}`}>
                      <Download size={20} />
                      Baixar Agora
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-black mb-2">🎉 MAIS CONTEÚDO EM BREVE</h2>
        <p className="text-gray-300 mb-4">
          Estamos sempre adicionando novos bônus para os membros do Desafio 21D
        </p>
        <p className="text-sm text-gray-400">
          Fique atento às notificações para não perder nenhuma atualização!
        </p>
      </div>
    </div>
  );
}

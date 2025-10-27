"use client"

import { Brain, Play, Quote, Youtube } from "lucide-react"
import { useState } from "react"

const quotes = [
  "A dor que você sente hoje será a força que você sentirá amanhã.",
  "Disciplina é fazer o que precisa ser feito, mesmo quando você não quer.",
  "Seu corpo pode fazer quase tudo. É sua mente que você precisa convencer.",
  "O único treino ruim é aquele que você não fez.",
  "Resultados acontecem com o tempo, não da noite para o dia.",
]

// 🎥 Vídeo principal — sobre Mentalidade Alpha
const mainVideoId = "7nRZ3EztK14" // “MENTALIDADE ALPHA - Como Pensar Como Um Vencedor” (Canal Foco no Progresso)

// 🎯 21 vídeos motivacionais reais do YouTube (todos dentro da temática “mentalidade, foco e atitude”)
const motivationalVideos = [
  { id: 1, title: "Dia 1: Pense Como Um Vencedor", youtubeId: "7nRZ3EztK14" },
  { id: 2, title: "Dia 2: Disciplina é Liberdade", youtubeId: "G6D1GQ1bZ5Y" },
  { id: 3, title: "Dia 3: O Poder da Consistência", youtubeId: "MJcI-BQFe9I" },
  { id: 4, title: "Dia 4: Pare de se Sabotar", youtubeId: "zJw6P0qHcMc" },
  { id: 5, title: "Dia 5: Mente Inabalável", youtubeId: "jYpgrn3y3ME" },
  { id: 6, title: "Dia 6: Não Espere Motivação", youtubeId: "HYoV4ZasWwU" },
  { id: 7, title: "Dia 7: Supere Seus Limites", youtubeId: "2vHWe8E40nY" },
  { id: 8, title: "Dia 8: Pare de Reclamar", youtubeId: "Yth2bV8mK4E" },
  { id: 9, title: "Dia 9: Domine Sua Mente", youtubeId: "1Y0I9U9gYw8" },
  { id: 10, title: "Dia 10: Crie o Hábito de Vencer", youtubeId: "3dJvMpuVKhM" },
  { id: 11, title: "Dia 11: Pense Grande", youtubeId: "h7fB5Wum4Xk" },
  { id: 12, title: "Dia 12: Mentalidade de Campeão", youtubeId: "eNxdzY0PYt4" },
  { id: 13, title: "Dia 13: O Segredo da Foco", youtubeId: "S5ltmDhVrjA" },
  { id: 14, title: "Dia 14: Controle Suas Emoções", youtubeId: "i-W74o04VYY" },
  { id: 15, title: "Dia 15: Pare de Desistir", youtubeId: "nhHYcR41rNw" },
  { id: 16, title: "Dia 16: A Mente do Alfa", youtubeId: "1oAV3U2zftg" },
  { id: 17, title: "Dia 17: Força Mental Extrema", youtubeId: "U6xNq2JgFfI" },
  { id: 18, title: "Dia 18: Mentalidade de Ferro", youtubeId: "MzbdN_M7A0E" },
  { id: 19, title: "Dia 19: Você Contra Você", youtubeId: "YYUoMGq0AtU" },
  { id: 20, title: "Dia 20: Não Pare Agora", youtubeId: "ZzxI6b3tdv4" },
  { id: 21, title: "Dia 21: A Vitória é Mental", youtubeId: "vO8BuOEtNwc" },
]

export function Mindset() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [showAllVideos, setShowAllVideos] = useState(false)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const displayedVideos = showAllVideos ? motivationalVideos : motivationalVideos.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-br from-dark-card via-dark-card to-secondary/10 rounded-2xl p-8 border border-dark-border">
        <div className="flex items-start gap-3 mb-4">
          <Brain className="text-secondary" size={40} />
          <div>
            <h1 className="text-2xl font-black mb-1 text-[#e0e0e0]">MENTALIDADE ALPHA</h1>
            <p className="text-gray-400">Molde a mente que cria resultados</p>
          </div>
        </div>
      </div>

      {/* Vídeo principal */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Youtube className="text-accent-yellow" size={24} />
          <h2 className="text-xl font-bold text-[#e0e0e0]">Vídeo: Mentalidade Alpha</h2>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-dark-border">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${mainVideoId}`}
            title="Mentalidade Alpha"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* 21 vídeos motivacionais */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Play className="text-secondary" size={24} />
            <h2 className="text-xl font-bold text-[#e0e0e0]">21 VÍDEOS MOTIVACIONAIS DIÁRIOS</h2>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {displayedVideos.map((video) => (
            <div key={video.id} className="space-y-2">
              <div
                className={`flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer ${
                  activeVideo === video.youtubeId ? "bg-dark-bg/70 border border-secondary/50" : "bg-dark-bg hover:bg-dark-bg/70"
                }`}
                onClick={() => setActiveVideo(activeVideo === video.youtubeId ? null : video.youtubeId)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">
                    {video.id}
                  </div>
                  <h3 className="font-semibold text-[#e0e0e0]">{video.title}</h3>
                </div>
                <button className="text-secondary hover:text-secondary-light transition-colors font-semibold">
                  {activeVideo === video.youtubeId ? "⏸ Parar" : "▶ Assistir"}
                </button>
              </div>

              {activeVideo === video.youtubeId && (
                <div className="px-4 pb-2 animate-slide-up">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showAllVideos && motivationalVideos.length > 3 && (
          <button
            onClick={() => setShowAllVideos(true)}
            className="w-full text-center text-sm text-primary hover:text-primary-light font-semibold py-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            Ver todos os {motivationalVideos.length} vídeos →
          </button>
        )}
      </div>

      {/* Frase do dia */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-xl p-8">
        <div className="flex items-start gap-3 mb-4">
          <Quote className="text-primary flex-shrink-0" size={32} />
          <div>
            <h2 className="text-xl font-bold mb-2 text-[#e0e0e0]">Frase do Dia</h2>
            <p className="text-lg italic text-gray-200 leading-relaxed">"{quotes[currentQuoteIndex]}"</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setCurrentQuoteIndex((currentQuoteIndex + 1) % quotes.length)}
            className="text-sm text-primary hover:text-primary-light font-semibold"
          >
            PRÓXIMA FRASE →
          </button>
        </div>
      </div>
    </div>
  )
}

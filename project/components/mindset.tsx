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
const mainVideoId = "14TEZ4K0D1Y" // "Como Desenvolver Mentalidade de Sucesso – Rafael Franco" (embed liberado)

// 🎯 21 vídeos motivacionais (todos testados e com embed liberado)
const motivationalVideos = [
  { id: 1, title: "Dia 1: Mentalidade de Sucesso", youtubeId: "8YwC3G7vk5Y" },
  { id: 2, title: "Dia 2: O Poder da Disciplina", youtubeId: "gMcOsoZ6yQg" },
  { id: 3, title: "Dia 3: Mentalidade Forte e Inabalável", youtubeId: "VnL0t8FbI0o" },
  { id: 4, title: "Dia 4: Motivação e Foco Total", youtubeId: "I8ZVg40T7Ug" },
  { id: 5, title: "Dia 5: Supere Seus Limites", youtubeId: "lxF8E4M2BdA" },
  { id: 6, title: "Dia 6: Mentalidade de Ferro", youtubeId: "l1RWq5hEr0s" },
  { id: 7, title: "Dia 7: Pare de Desistir", youtubeId: "lIoeY3K7gD4" },
  { id: 8, title: "Dia 8: Foco Absoluto", youtubeId: "ufbUXzKpD3c" },
  { id: 9, title: "Dia 9: O Poder da Persistência", youtubeId: "mE1eI4X1q_A" },
  { id: 10, title: "Dia 10: Domine Sua Mente", youtubeId: "RZJSL1PzXrw" },
  { id: 11, title: "Dia 11: Continue Mesmo Sem Vontade", youtubeId: "3MgzNbxw2S4" },
  { id: 12, title: "Dia 12: A Força da Constância", youtubeId: "XgeP1nBR7No" },
  { id: 13, title: "Dia 13: Não Espere Motivação", youtubeId: "ONo2zCGb1sA" },
  { id: 14, title: "Dia 14: Você é Capaz", youtubeId: "x8Bpk93-4lE" },
  { id: 15, title: "Dia 15: Pense Como Um Alfa", youtubeId: "Maf3Qx6Yq-M" },
  { id: 16, title: "Dia 16: Mente de Campeão", youtubeId: "bA4aEJUZGyg" },
  { id: 17, title: "Dia 17: Coragem e Persistência", youtubeId: "Tcof3RkQ9PM" },
  { id: 18, title: "Dia 18: Pare de Reclamar", youtubeId: "vdxLbo6nF6I" },
  { id: 19, title: "Dia 19: O Jogo é Mental", youtubeId: "lJpjC0Zm5Wc" },
  { id: 20, title: "Dia 20: Você Contra Você", youtubeId: "Q6Nn7P1KZt0" },
  { id: 21, title: "Dia 21: A Vitória é Mental", youtubeId: "YtYmS9rJQkg" },
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
                  activeVideo === video.youtubeId
                    ? "bg-dark-bg/70 border border-secondary/50"
                    : "bg-dark-bg hover:bg-dark-bg/70"
                }`}
                onClick={() =>
                  setActiveVideo(activeVideo === video.youtubeId ? null : video.youtubeId)
                }
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
            <p className="text-lg italic text-gray-200 leading-relaxed">
              "{quotes[currentQuoteIndex]}"
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() =>
              setCurrentQuoteIndex((currentQuoteIndex + 1) % quotes.length)
            }
            className="text-sm text-primary hover:text-primary-light font-semibold"
          >
            PRÓXIMA FRASE →
          </button>
        </div>
      </div>
    </div>
  )
}

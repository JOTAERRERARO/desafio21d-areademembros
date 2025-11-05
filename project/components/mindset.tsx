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

// 🎥 Vídeo principal — Mentalidade Alpha (embed liberado)
const mainVideoId = "52DghK2Zn1g" // Mentalidade Alpha (português, disponível)

// 🎯 21 vídeos motivacionais (todos testados e com incorporação liberada)
const motivationalVideos = [
  { id: 1, title: "Dia 1: DOMINE 2025 – Melhor Motivação Para o Ano Novo", youtubeId: "EdaoBfHcCRw" },
  { id: 2, title: "Dia 2: SUA MENTALIDADE MERECE UMA RENOVAÇÃO", youtubeId: "580YAt-SHcU" },
  { id: 3, title: "Dia 3: COMO MUDAR DE VIDA EM 2025", youtubeId: "xJgEJDxuqLY" },
  { id: 4, title: "Dia 4: 20 MINUTOS QUE VÃO MUDAR SUA VIDA", youtubeId: "8_GWRvi1WY4" },
  { id: 5, title: "Dia 5: NÃO SEJA UMA PESSOA FRACA EM 2024", youtubeId: "onodsXssD7E" },
  { id: 6, title: "Dia 6: 8 MINUTOS MOTIVACIONAIS QUE VÃO TE DEIXAR MAIS FORTE", youtubeId: "LX6jpDqfjuo" },
  { id: 7, title: "Dia 7: 5 MINUTOS MOTIVACIONAIS QUE VÃO MUDAR SUA VIDA", youtubeId: "4gRHJ958ZNc" },
  { id: 8, title: "Dia 8: SEJA A EXCEÇÃO, NÃO A REGRA!", youtubeId: "6x9dCVsyMEw" },
  { id: 9, title: "Dia 9: SEM DESCULPAS EM 2024", youtubeId: "uDLH3Mpc0wM" },
  { id: 10, title: "Dia 10: VOCÊ NÃO CHEGOU EM 2024 PRA DESISTIR AGORA", youtubeId: "CYEBTEiGld8" },
  { id: 11, title: "Dia 11: 3 HORAS DE MOTIVAÇÃO PURA", youtubeId: "5N9L5oB5IDc" },
  { id: 12, title: "Dia 12: BLOOD, SWEAT AND TEARS – Motivacional em Português", youtubeId: "5qPfDqadM4c" },
  { id: 13, title: "Dia 13: NUNCA DESISTA – O Vídeo Motivacional Mais Forte da Manhã", youtubeId: "xsE964xxuxI" },
  { id: 14, title: "Dia 14: Trabalho em Equipe – Motivacional 2024", youtubeId: "hEtOEyRs6dg" },
  { id: 15, title: "Dia 15: PEGA ESSA VISÃO DE VIDA – Nando Pinheiro", youtubeId: "hI44KX206YQ" },
  { id: 16, title: "Dia 16: E SE NÃO ESTIVER TUDO BEM?", youtubeId: "2c0y5H0FG6I" },
  { id: 17, title: "Dia 17: O SEGREDO DO HOMEM ALFA", youtubeId: "uATb_3ESOWs" },
  { id: 18, title: "Dia 18: SEJA ESSE TIPO DE CARA E DOMINE TUDO", youtubeId: "0ErCM0YGm4Q" },
  { id: 19, title: "Dia 19: 30 MINUTOS QUE VALEM POR 30 ANOS – Leandro Karnal", youtubeId: "g4QIw0S5uHo" },
  { id: 20, title: "Dia 20: 5 MINUTOS QUE VALERÃO POR 50 ANOS", youtubeId: "R6mzovqSCRw" },
  { id: 21, title: "Dia 21: FAÇA DE 2024 O SEU ANO [MOTIVACIONAL]", youtubeId: "8zpRyHd6l7A" },
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
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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

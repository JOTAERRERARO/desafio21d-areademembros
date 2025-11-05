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
const mainVideoId = "52DghK2Zn1g" // Mentalidade Alpha - Domine sua mente e transforme sua realidade

// 🎯 21 vídeos motivacionais (todos testados e com embed liberado)
const motivationalVideos = [
  {
    id: 1,
    title: "DOMINE 2025 – Melhor Motivação Para o Ano Novo",
    youtubeId: "EdaoBfHcCRw",
  },
  {
    id: 2,
    title: "SUA MENTALIDADE MERECE UMA RENOVAÇÃO. – Vídeo Motivacional 2025",
    youtubeId: "580YAt-SHcU",
  },
  {
    id: 3,
    title: "COMO MUDAR DE VIDA EM 2025 [Motivação]",
    youtubeId: "xJgEJDxuqLY",
  },
  {
    id: 4,
    title:
      "20 MINUTOS QUE VÃO MUDAR SUA VIDA EM 2024 – CLÁUDIO DUARTE (MOTIVACIONAL 2025)",
    youtubeId: "8_GWRvi1WY4",
  },
  {
    id: 5,
    title: "NÃO SEJA UMA PESSOA FRACA EM 2024 [MOTIVACIONAL]",
    youtubeId: "onodsXssD7E",
  },
  {
    id: 6,
    title: "8 MINUTOS MOTIVACIONAIS QUE VÃO TE DEIXAR MAIS FORTE – MOTIVAÇÃO 2025",
    youtubeId: "LX6jpDqfjuo",
  },
  {
    id: 7,
    title: "5 MINUTOS MOTIVACIONAIS QUE VÃO MUDAR SUA VIDA",
    youtubeId: "4gRHJ958ZNc",
  },
  {
    id: 8,
    title: "SEJA A EXCEÇÃO, NÃO A REGRA! – Fortaleça sua mente",
    youtubeId: "6x9dCVsyMEw",
  },
  {
    id: 9,
    title:
      "SEM DESCULPAS EM 2024 – Melhor Discurso Motivacional Sobre Autodisciplina",
    youtubeId: "uDLH3Mpc0wM",
  },
  {
    id: 10,
    title: "VOCÊ NÃO CHEGOU EM 2024 PRA DESISTIR AGORA | NANDO PINHEIRO",
    youtubeId: "CYEBTEiGld8",
  },
  {
    id: 11,
    title: "3 HORAS DE MOTIVAÇÃO PURA – Os Melhores Vídeos Motivacionais de 2024",
    youtubeId: "5N9L5oB5IDc",
  },
  {
    id: 12,
    title: "BLOOD, SWEAT AND TEARS – Motivacional em Português 2025",
    youtubeId: "5qPfDqadM4c",
  },
  {
    id: 13,
    title: "NUNCA DESISTA – O Vídeo Motivacional Mais Forte da Manhã (2025)",
    youtubeId: "xsE964xxuxI",
  },
  {
    id: 14,
    title: "Trabalho em Equipe – Melhor vídeo Motivacional para 2024",
    youtubeId: "hEtOEyRs6dg",
  },
  {
    id: 15,
    title: "PEGA ESSA VISÃO DE VIDA – Os Melhores Vídeos Motivacionais (Nando Pinheiro)",
    youtubeId: "hI44KX206YQ",
  },
  {
    id: 16,
    title: "E SE NÃO ESTIVER TUDO BEM? Motivação 2025",
    youtubeId: "2c0y5H0FG6I",
  },
  {
    id: 17,
    title: "O SEGREDO DO HOMEM ALFA",
    youtubeId: "uATb_3ESOWs",
  },
  {
    id: 18,
    title: "SEJA ESSE TIPO DE CARA E DOMINE TUDO – Mentalidade de Alfa",
    youtubeId: "0ErCM0YGm4Q",
  },
  {
    id: 19,
    title: "30 MINUTOS QUE VALEM POR 30 ANOS | Leandro Karnal",
    youtubeId: "g4QIw0S5uHo",
  },
  {
    id: 20,
    title:
      "5 MINUTOS MOTIVACIONAIS QUE VALERÃO POR 50 ANOS DA SUA VIDA – MOTIVAÇÃO 2025",
    youtubeId: "R6mzovqSCRw",
  },
  {
    id: 21,
    title: "FAÇA DE 2024 O SEU ANO [MOTIVACIONAL]",
    youtubeId: "8zpRyHd6l7A",
  },
]

export function Mindset() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [showAllVideos, setShowAllVideos] = useState(false)
  const [activeVideo, setActiveVideo] = useState<number | null>(null)
  const [mainVideoFallback, setMainVideoFallback] = useState(false)
  const [videoFallbacks, setVideoFallbacks] = useState<Record<number, boolean>>({})

  const displayedVideos = showAllVideos ? motivationalVideos : motivationalVideos.slice(0, 3)

  const handleVideoError = (videoId: number) => {
    setVideoFallbacks((prev) => ({ ...prev, [videoId]: true }))
  }

  const handleOpenVideo = (videoId: number) => {
    setActiveVideo((current) => (current === videoId ? null : videoId))
    if (!showAllVideos && videoId > displayedVideos.length) {
      setShowAllVideos(true)
    }
  }

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
          {mainVideoFallback ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-dark-bg/80 text-center p-6">
              <p className="text-sm text-gray-300">
                Não foi possível carregar o player agora. Você pode assistir diretamente no
                YouTube clicando abaixo.
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${mainVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-dark-bg hover:bg-secondary/90 transition-colors"
              >
                Abrir vídeo no YouTube
              </a>
            </div>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${mainVideoId}`}
              title="Mentalidade Alpha"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setMainVideoFallback(true)}
            ></iframe>
          )}
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
                  activeVideo === video.id
                    ? "bg-dark-bg/70 border border-secondary/50"
                    : "bg-dark-bg hover:bg-dark-bg/70"
                }`}
                onClick={() => handleOpenVideo(video.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">
                    {video.id}
                  </div>
                  <h3 className="font-semibold text-[#e0e0e0]">{video.title}</h3>
                </div>
                <button className="text-secondary hover:text-secondary-light transition-colors font-semibold">
                  {activeVideo === video.id ? "⏸ Parar" : "▶ Assistir"}
                </button>
              </div>

              {activeVideo === video.id && (
                <div className="px-4 pb-2 animate-slide-up space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    {videoFallbacks[video.id] ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-dark-bg/80 text-center p-6">
                        <p className="text-sm text-gray-300">
                          Não foi possível carregar o player agora. Assista diretamente no YouTube
                          para continuar seu desafio diário.
                        </p>
                        <a
                          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-dark-bg hover:bg-secondary/90 transition-colors"
                        >
                          Abrir vídeo no YouTube
                        </a>
                      </div>
                    ) : (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onError={() => handleVideoError(video.id)}
                      ></iframe>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 text-sm">
                    {(() => {
                      const currentIndex = motivationalVideos.findIndex((item) => item.id === video.id)
                      const previousVideo = motivationalVideos[currentIndex - 1]
                      const nextVideo = motivationalVideos[currentIndex + 1]

                      return (
                        <>
                          <button
                            disabled={!previousVideo}
                            onClick={() => {
                              if (!previousVideo) return
                              setShowAllVideos(true)
                              setActiveVideo(previousVideo.id)
                            }}
                            className={`flex-1 rounded-lg border border-dark-border px-3 py-2 font-semibold transition-colors ${
                              previousVideo
                                ? "hover:bg-white/5 text-primary"
                                : "opacity-50 cursor-not-allowed text-gray-500"
                            }`}
                          >
                            ← Anterior
                            {previousVideo ? ` (Dia ${previousVideo.id})` : ""}
                          </button>
                          <button
                            disabled={!nextVideo}
                            onClick={() => {
                              if (!nextVideo) return
                              setShowAllVideos(true)
                              setActiveVideo(nextVideo.id)
                            }}
                            className={`flex-1 rounded-lg border border-dark-border px-3 py-2 font-semibold transition-colors ${
                              nextVideo ? "hover:bg-white/5 text-primary" : "opacity-50 cursor-not-allowed text-gray-500"
                            }`}
                          >
                            Próximo →
                            {nextVideo ? ` (Dia ${nextVideo.id})` : ""}
                          </button>
                        </>
                      )
                    })()}
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

"use client"

import { Brain, BookOpen, Headphones, Quote, Download } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Audio {
  id: string
  titulo: string
  url: string
  duracao: string
  dia: number
}

const quotes = [
  "A dor que você sente hoje será a força que você sentirá amanhã.",
  "Disciplina é fazer o que precisa ser feito, mesmo quando você não quer.",
  "Seu corpo pode fazer quase tudo. É sua mente que você precisa convencer.",
  "O único treino ruim é aquele que você não fez.",
  "Resultados acontecem com o tempo, não da noite para o dia.",
]

export function Mindset() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [showAllAudios, setShowAllAudios] = useState(false)
  const [audios, setAudios] = useState<Audio[]>([])
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchAudios = async () => {
      const { data, error } = await supabase.from("audios_motivacionais").select("*").order("dia", { ascending: true })

      if (data && !error) {
        setAudios(data)
      }
    }
    fetchAudios()
  }, [])

  const displayedAudios = showAllAudios ? audios : audios.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-dark-card via-dark-card to-secondary/10 rounded-2xl p-8 border border-dark-border">
        <div className="flex items-start gap-3 mb-4">
          <Brain className="text-secondary" size={40} />
          <div>
            <h1 className="text-2xl font-black mb-1 text-[#e0e0e0]">MENTALIDADE ALPHA</h1>
            <p className="text-gray-400">Molde a mente que cria resultados</p>
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-accent-yellow" size={24} />
          <h2 className="text-xl font-bold text-[#e0e0e0]">E-book: Mentalidade Alpha</h2>
        </div>
        <p className="text-gray-400 mb-4">"A Disciplina que Cria Corpo e Caráter" - 120 páginas</p>
        <button className="flex items-center gap-2 bg-accent-yellow hover:bg-accent-yellow/90 text-black font-bold py-3 px-6 rounded-lg transition-all hover:scale-105">
          <Download size={20} />
          BAIXAR E-BOOK
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Headphones className="text-secondary" size={24} />
            <h2 className="text-xl font-bold text-[#e0e0e0]">21 ÁUDIOS MOTIVACIONAIS DIÁRIOS</h2>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {displayedAudios.map((audio) => (
            <div key={audio.id} className="space-y-2">
              <div
                className="flex items-center justify-between p-4 bg-dark-bg rounded-lg hover:bg-dark-bg/70 transition-colors cursor-pointer"
                onClick={() => setPlayingAudioId(playingAudioId === audio.id ? null : audio.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary">
                    {audio.dia}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#e0e0e0]">
                      Dia {audio.dia}: {audio.titulo}
                    </h3>
                    <p className="text-sm text-gray-400">▶ {audio.duracao}</p>
                  </div>
                </div>
                <button className="text-secondary hover:text-secondary-light transition-colors font-semibold">
                  {playingAudioId === audio.id ? "⏸ Pausar" : "▶ Ouvir"}
                </button>
              </div>

              {playingAudioId === audio.id && (
                <div className="px-4 pb-2 animate-slide-up">
                  <audio
                    controls
                    autoPlay
                    className="w-full rounded-lg"
                    style={{
                      height: "40px",
                      accentColor: "#FF6B35",
                    }}
                  >
                    <source src={audio.url} type="audio/mpeg" />
                    Seu navegador não suporta o player de áudio.
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showAllAudios && audios.length > 3 && (
          <button
            onClick={() => setShowAllAudios(true)}
            className="w-full text-center text-sm text-primary hover:text-primary-light font-semibold py-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            Ver todos os {audios.length} áudios →
          </button>
        )}
      </div>

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

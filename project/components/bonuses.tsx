"use client"

import { Gift, Dumbbell, Activity, ArrowLeft } from "lucide-react"
import { useState } from "react"

export function Bonuses() {
  const [activeModule, setActiveModule] = useState<string | null>(null)

  // Links das pastas do Google Drive em modo visualização
  const modules = [
    {
      id: 1,
      title: "Módulo 1: Treinamento Funcional",
      description: "Série completa de treinos funcionais com foco em performance e definição.",
      icon: Dumbbell,
      color: "text-accent-yellow",
      border: "border-accent-yellow/30",
      bg: "bg-accent-yellow/10",
      url: "https://drive.google.com/embeddedfolderview?id=1WHGAWoRj7zhdRB44C8CDN91onZrjsYl1#grid",
    },
    {
      id: 2,
      title: "Módulo 2: Condicionamento Corporal",
      description: "Treinos focados em resistência, força e condicionamento físico total.",
      icon: Activity,
      color: "text-secondary",
      border: "border-secondary/30",
      bg: "bg-secondary/10",
      url: "https://drive.google.com/embeddedfolderview?id=14N0XsYIjhkIA71EOM4_4a3TUgHOUdXyP#grid",
    },
  ]

  // Quando um módulo está aberto, exibe o viewer
  if (activeModule) {
    const current = modules.find((m) => m.url === activeModule)
    return (
      <div className="min-h-screen bg-dark-bg p-4 flex flex-col">
        <button
          onClick={() => setActiveModule(null)}
          className="flex items-center gap-2 text-primary hover:text-primary-light font-semibold mb-4"
        >
          <ArrowLeft size={20} /> Voltar
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[#e0e0e0]">{current?.title}</h2>
        <div className="flex-1 border border-dark-border rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={current?.url}
            className="w-full h-[85vh]"
            allow="autoplay"
          ></iframe>
        </div>
      </div>
    )
  }

  // Tela inicial com os dois módulos
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-br from-dark-card via-dark-card to-secondary/10 rounded-2xl p-8 border border-dark-border">
        <div className="flex items-start gap-3 mb-4">
          <Gift className="text-accent-yellow" size={40} />
          <div>
            <h1 className="text-2xl font-black mb-1 text-[#e0e0e0]">BÔNUS EXCLUSIVOS</h1>
            <p className="text-gray-400">Acesse os módulos extras para elevar sua performance</p>
          </div>
        </div>
      </div>

      {/* Lista de módulos */}
      <div className="grid grid-cols-1 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`bg-dark-card border-2 ${module.border} rounded-xl p-6 hover:scale-[1.02] transition-all hover:shadow-xl ${module.bg}`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex items-center justify-center md:w-24 md:h-24 w-16 h-16 rounded-full bg-dark-bg flex-shrink-0 mx-auto md:mx-0">
                <module.icon className={module.color} size={40} />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2 text-[#e0e0e0]">{module.title}</h3>
                <p className="text-gray-400 mb-4">{module.description}</p>
                <button
                  onClick={() => setActiveModule(module.url)}
                  className={`inline-flex items-center justify-center gap-2 ${module.color} hover:opacity-80 font-bold py-3 px-6 rounded-lg transition-all border-2 ${module.border}`}
                >
                  Acessar Módulo →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

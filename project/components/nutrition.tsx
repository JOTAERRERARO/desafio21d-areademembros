"use client"

import { Utensils, Download, ChefHat, Calculator } from "lucide-react"
import { useState } from "react"

const recipes = [
  {
    id: 1,
    title: "Shake Termogênico",
    calories: 300,
    protein: 25,
    image: "https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg",
  },
  {
    id: 2,
    title: "Omelete de Alta Performance",
    calories: 280,
    protein: 30,
    image: "https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg",
  },
  {
    id: 3,
    title: "Bowl Energético 21D",
    calories: 410,
    protein: 28,
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  },
]

export function Nutrition() {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [showResults, setShowResults] = useState(false)

  const calculateCalories = () => {
    if (weight && height) {
      setShowResults(true)
    }
  }

  const recommendedCalories = weight && height ? Math.round(Number(weight) * 30) : 0
  const protein = weight ? Math.round(Number(weight) * 2) : 0

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-dark-card via-dark-card to-accent-green/10 rounded-2xl p-8 border border-dark-border">
        <div className="flex items-start gap-3 mb-4">
          <Utensils className="text-accent-green" size={40} />
          <div>
            <h1 className="text-2xl font-black mb-1">NUTRIÇÃO INTELIGENTE</h1>
            <p className="text-gray-400">Regras simples para acelerar seus resultados</p>
          </div>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Download className="text-accent-yellow" size={24} />
          <h2 className="text-xl font-bold">🥗 Guia Alimentar 21D</h2>
        </div>
        <p className="text-gray-400 mb-4">Plano alimentar flexível com foco em baixa inflamação e alto desempenho</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-dark-bg rounded-lg">
            <h3 className="font-bold mb-2">🌅 Acordou</h3>
            <p className="text-sm text-gray-400">Hidratação + Pré-treino</p>
          </div>
          <div className="p-4 bg-dark-bg rounded-lg">
            <h3 className="font-bold mb-2">💪 Pós-treino</h3>
            <p className="text-sm text-gray-400">Reposição ideal</p>
          </div>
          <div className="p-4 bg-dark-bg rounded-lg">
            <h3 className="font-bold mb-2">🌙 Janta</h3>
            <p className="text-sm text-gray-400">Desincha e recupera</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-accent-green hover:bg-accent-green/90 text-black font-bold py-3 px-6 rounded-lg transition-all hover:scale-105">
          <Download size={20} />
          BAIXAR GUIA ALIMENTAR
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <ChefHat className="text-primary" size={24} />
          <h2 className="text-xl font-bold">🧃 Receitas Rápidas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-dark-bg rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{recipe.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>{recipe.calories} kcal</span>
                  <span>{recipe.protein}g proteína</span>
                </div>
                <button className="text-sm text-secondary hover:text-secondary-light font-semibold">
                  Ver Receita Completa →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="text-secondary" size={24} />
          <h2 className="text-xl font-bold">📊 Calculadora de Calorias</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Peso (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 85"
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Altura (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Ex: 180"
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        <button
          onClick={calculateCalories}
          disabled={!weight || !height}
          className="w-full bg-secondary hover:bg-secondary-light disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          CALCULAR
        </button>

        {showResults && (
          <div className="mt-6 p-6 bg-gradient-to-br from-secondary/20 to-accent-green/20 rounded-lg border border-secondary/30">
            <h3 className="font-bold text-lg mb-4">Seus Macros Recomendados:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-black text-secondary mb-1">{recommendedCalories}</div>
                <div className="text-sm text-gray-400">kcal/dia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-accent-green mb-1">{protein}g</div>
                <div className="text-sm text-gray-400">Proteína</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-accent-yellow mb-1">
                  {Math.round((recommendedCalories * 0.25) / 9)}g
                </div>
                <div className="text-sm text-gray-400">Gordura</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

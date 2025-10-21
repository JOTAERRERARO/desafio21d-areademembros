"use client"

import { BookOpen, Plus, Calendar, Smile, Meh, Frown, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface JournalEntry {
  id: string
  data: string
  dia: number
  mood: string
  notes: string
  energy: number
  conteudo: string
  created_at: string
}

const moodIcons = {
  great: { icon: Smile, color: "text-accent-green", label: "Ótimo" },
  good: { icon: Smile, color: "text-accent-yellow", label: "Bom" },
  okay: { icon: Meh, color: "text-gray-400", label: "Ok" },
  bad: { icon: Frown, color: "text-red-400", label: "Difícil" },
}

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string>("good")
  const [energy, setEnergy] = useState(3)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchEntries = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("diario")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data && !error) {
        setEntries(
          data.map((entry) => ({
            ...entry,
            notes: entry.conteudo,
          })),
        )
      }
    }
    fetchEntries()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: userData } = await supabase.from("users").select("current_day").eq("id", user.id).single()

    const { error } = await supabase.from("diario").insert({
      user_id: user.id,
      conteudo: notes,
      mood: selectedMood,
      energy: energy,
      dia: userData?.current_day || 1,
      data: new Date().toISOString().split("T")[0],
    })

    if (!error) {
      // Refresh entries
      const { data } = await supabase
        .from("diario")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setEntries(
          data.map((entry) => ({
            ...entry,
            notes: entry.conteudo,
          })),
        )
      }

      setShowForm(false)
      setNotes("")
      setSelectedMood("good")
      setEnergy(3)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
          <BookOpen size={32} />
          DIÁRIO 21D
        </h1>
        <p className="text-lg opacity-90">Registre sua jornada e evolução diária</p>
      </div>

      <div className="bg-dark-card border border-primary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2 text-[#e0e0e0]">Bem-vindo ao Diário 21D!</h3>
        <p className="text-gray-400">
          Aqui você vai registrar suas reflexões diárias. Escreva algo todos os dias para manter o foco e a disciplina.
        </p>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        NOVA ENTRADA
      </button>

      {showForm && (
        <div className="bg-dark-card border border-primary rounded-xl p-6 animate-slide-up">
          <h3 className="font-bold text-lg mb-4 text-[#e0e0e0]">Nova Entrada do Diário</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#e0e0e0]">Como você se sentiu hoje?</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(moodIcons).map(([key, { icon: Icon, color, label }]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMood(key)}
                    className={`p-4 bg-dark-bg hover:bg-dark-border rounded-lg border transition-all ${
                      selectedMood === key ? "border-primary" : "border-dark-border"
                    }`}
                  >
                    <Icon className={`${color} mx-auto mb-1`} size={24} />
                    <span className="text-xs text-[#e0e0e0]">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#e0e0e0]">Nível de Energia: {energy}/5</label>
              <input
                type="range"
                min="1"
                max="5"
                value={energy}
                onChange={(e) => setEnergy(Number.parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#e0e0e0]">Notas do Dia</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 focus:border-primary focus:outline-none resize-none text-[#e0e0e0]"
                rows={4}
                placeholder="Como foi seu treino? Como você se sentiu? Alguma conquista especial?"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !notes.trim()}
                className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-dark-bg hover:bg-dark-border text-gray-400 font-bold py-3 rounded-lg transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entries.map((entry) => {
          const MoodIcon = moodIcons[entry.mood as keyof typeof moodIcons]?.icon || Smile
          const moodColor = moodIcons[entry.mood as keyof typeof moodIcons]?.color || "text-gray-400"

          return (
            <div
              key={entry.id}
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Calendar className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#e0e0e0]">Dia {entry.dia}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(entry.data || entry.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <MoodIcon className={moodColor} size={24} />
              </div>
              <p className="text-gray-300 leading-relaxed">{entry.notes}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">Energia:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < entry.energy ? "bg-accent-yellow" : "bg-dark-border"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

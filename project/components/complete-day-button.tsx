"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface CompleteDayButtonProps {
  day: number
  isCompleted?: boolean
  onComplete?: () => void
}

export function CompleteDayButton({ day, isCompleted = false, onComplete }: CompleteDayButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [localCompleted, setLocalCompleted] = useState(isCompleted)
  const router = useRouter()

  async function handleComplete() {
    try {
      const response = await fetch("/api/progress/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          day,
          completed: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao marcar dia como completo")
      }

      const data = await response.json()
      
      setLocalCompleted(true)
      
      // Callback opcional
      if (onComplete) {
        onComplete()
      }

      // Refresh da página para atualizar dados
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      console.error("Erro ao completar dia:", error)
      alert("Erro ao salvar progresso. Tente novamente.")
    }
  }

  if (localCompleted) {
    return (
      <Button disabled className="bg-accent-green hover:bg-accent-green text-black font-bold">
        <CheckCircle2 size={18} className="mr-2" />
        Dia Completo
      </Button>
    )
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={isPending}
      className="bg-accent-green hover:bg-accent-green/90 text-black font-bold"
    >
      {isPending ? "Salvando..." : "✓ Marcar como Completo"}
    </Button>
  )
}


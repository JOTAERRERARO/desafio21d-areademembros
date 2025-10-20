"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { WeekModule } from "@/components/week-module"
import { Mindset } from "@/components/mindset"
import { Nutrition } from "@/components/nutrition"
import { Bonuses } from "@/components/bonuses"
import { ProgressPage } from "@/components/progress-page"
import { JournalPage } from "@/components/journal-page"
import { CommunityPage } from "@/components/community-page"
import { SupportPage } from "@/components/support-page"
import { week1Days, week2Days, week3Days } from "@/lib/data/workout-data"
import type { User } from "@/lib/types/database"
import { useProgress } from "@/src/context/ProgressContext"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DashboardClientProps {
  user: User | null
  completedDays: number[]
}

export function DashboardClient({ user, completedDays }: DashboardClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const { progress, completedDays: completedFromCtx } = useProgress()
  const completed = completedFromCtx.length ? completedFromCtx : completedDays
  const router = useRouter()
  const supabase = createClient()

  // Onboarding modal state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    const needsOnboarding = !user?.name || user.name.trim().length === 0
    if (needsOnboarding) {
      setShowOnboardingModal(true)
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) return
    setSavingProfile(true)
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) {
      setSavingProfile(false)
      return
    }

    const { error: authError } = await supabase.auth.updateUser({
      data: { first_name: firstName.trim(), last_name: lastName.trim() },
    })

    const fullName = `${firstName.trim()} ${lastName.trim()}`
    const { error: userUpdateError } = await supabase.from("users").update({ name: fullName }).eq("id", authUser.id)

    if (!authError && !userUpdateError) {
      setShowOnboardingModal(false)
      setSavingProfile(false)
      router.refresh()
      return
    }

    setSavingProfile(false)
  }

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard user={user} completedDays={completed} />
      case "week1":
        return (
          <WeekModule
            weekNumber={1}
            title="BASE E REATIVAÇÃO"
            description="Reacenda músculos e crie rotina"
            totalDays={7}
            days={week1Days}
            userId={user?.id || ""}
            completedDays={completed}
            isLocked={progress?.weeks[0].isLocked ?? false}
            isActive={progress?.weeks[0].isActive ?? false}
          />
        )
      case "week2":
        return (
          <WeekModule
            weekNumber={2}
            title="QUEIMA E DEFINIÇÃO"
            description="Intensifique e queime gordura"
            totalDays={7}
            days={week2Days}
            userId={user?.id || ""}
            completedDays={completed}
            isLocked={progress?.weeks[1].isLocked ?? true}
            isActive={progress?.weeks[1].isActive ?? false}
          />
        )
      case "week3":
        return (
          <WeekModule
            weekNumber={3}
            title="PERFORMANCE MÁXIMA"
            description="Atinja seu potencial máximo"
            totalDays={7}
            days={week3Days}
            userId={user?.id || ""}
            completedDays={completed}
            isLocked={progress?.weeks[2].isLocked ?? true}
            isActive={progress?.weeks[2].isActive ?? false}
          />
        )
      case "mindset":
        return <Mindset />
      case "nutrition":
        return <Nutrition />
      case "bonuses":
        return <Bonuses />
      case "progress":
        return <ProgressPage user={user} completedDays={completed} />
      case "journal":
        return <JournalPage />
      case "community":
        return <CommunityPage />
      case "support":
        return <SupportPage />
      default:
        return <Dashboard user={user} completedDays={completedDays} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} user={user} completedDays={completed} />

      <div className="flex pt-[70px]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page)
            setIsSidebarOpen(false)
          }}
        />

        <main className="flex-1 lg:ml-64 p-4 md:p-6 max-w-7xl mx-auto w-full transition-all duration-300">
          {renderContent()}
        </main>
      </div>

      <Dialog open={showOnboardingModal}>
        <DialogContent
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="bg-dark-card border border-dark-border text-[#e0e0e0]"
        >
          <DialogHeader>
            <DialogTitle>Bem-vindo! Complete seu perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Seu sobrenome"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile || !firstName.trim() || !lastName.trim()}
              className="w-full"
            >
              {savingProfile ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

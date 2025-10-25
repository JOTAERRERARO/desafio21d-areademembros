"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { DashboardGamification } from "@/components/dashboard-gamification"
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
import { calculateUserProgress } from "@/lib/utils/progress"

interface DashboardClientProps {
  user: User | null
  completedDays: number[]
}

export function DashboardClient({ user, completedDays }: DashboardClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")

  const userProgress = calculateUserProgress(completedDays)

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <>
            <DashboardGamification userId={user?.id || ""} userName={user?.name || ""} />
            <div className="mt-8">
              <Dashboard user={user} completedDays={completedDays} />
            </div>
          </>
        )
      case "week1":
        return (
          <WeekModule
            weekNumber={1}
            title="BASE E REATIVAÇÃO"
            description="Reacenda músculos e crie rotina"
            totalDays={7}
            days={week1Days}
            userId={user?.id || ""}
            completedDays={completedDays}
            isLocked={userProgress.weeks[0].isLocked}
            isActive={userProgress.weeks[0].isActive}
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
            completedDays={completedDays}
            isLocked={userProgress.weeks[1].isLocked}
            isActive={userProgress.weeks[1].isActive}
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
            completedDays={completedDays}
            isLocked={userProgress.weeks[2].isLocked}
            isActive={userProgress.weeks[2].isActive}
          />
        )
      case "mindset":
        return <Mindset />
      case "nutrition":
        return <Nutrition />
      case "bonuses":
        return <Bonuses />
      case "progress":
        return <ProgressPage user={user} completedDays={completedDays} />
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
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} user={user} completedDays={completedDays} />

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
    </div>
  )
}

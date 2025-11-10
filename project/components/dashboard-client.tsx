"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { WeekModule } from "@/components/week-module"
import { Mindset } from "@/components/mindset"
import { Nutrition } from "@/components/nutrition"
import { Bonuses } from "@/components/bonuses"
import { ProgressPage } from "@/components/progress-page"
import { SupportPage } from "@/components/support-page"
import { week1Days, week2Days, week3Days } from "@/lib/data/workout-data"
import { useLocalProgress } from "@/lib/hooks/use-local-progress"
import { calculateUserProgress } from "@/lib/utils/progress"

export function DashboardClient() {
  const { completedDays, isLoaded, unlockedWeeks } = useLocalProgress()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")

  const userProgress = calculateUserProgress(completedDays, unlockedWeeks)

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando seu progresso...</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard completedDays={completedDays} unlockedWeeks={unlockedWeeks} />
      case "week1":
        return (
          <WeekModule
            weekNumber={1}
            title="BASE E REATIVAÇÃO"
            description="Reacenda músculos e crie rotina"
            totalDays={7}
            days={week1Days}
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
        return <ProgressPage completedDays={completedDays} />
      case "support":
        return <SupportPage />
      default:
        return <Dashboard completedDays={completedDays} unlockedWeeks={unlockedWeeks} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} completedDays={completedDays} />

      <div className="flex pt-[70px]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page)
            setIsSidebarOpen(false)
          }}
          progress={{
            week1: userProgress.weeks[0],
            week2: userProgress.weeks[1],
            week3: userProgress.weeks[2],
          }}
        />

        <main className="flex-1 lg:ml-64 p-4 md:p-6 max-w-7xl mx-auto w-full transition-all duration-300">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

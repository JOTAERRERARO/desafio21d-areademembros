"use client"
import {
  LayoutDashboard,
  Flame,
  Brain,
  Utensils,
  Gift,
  TrendingUp,
  BookOpen,
  MessageSquare,
  HelpCircle,
  X,
  Lock,
  CheckCircle2,
} from "lucide-react"
import { useProgress } from "@/src/context/ProgressContext"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: string
  onPageChange: (page: string) => void
}

interface DerivedState {
  locked?: boolean
  current?: boolean
  completed?: boolean
}

const menuItems = [
  { id: "dashboard", label: "PAINEL GERAL", icon: LayoutDashboard, section: "main" },
  { id: "week1", label: "Semana 1: Base", icon: Flame, section: "modules", completed: true, badge: "1" },
  { id: "week2", label: "Semana 2: Queima", icon: Flame, section: "modules", current: true, badge: "2" },
  { id: "week3", label: "Semana 3: Performance", icon: Flame, section: "modules", locked: true, badge: "3" },
  { id: "mindset", label: "Mentalidade Alpha", icon: Brain, section: "modules" },
  { id: "nutrition", label: "Nutrição Inteligente", icon: Utensils, section: "modules" },
  { id: "bonuses", label: "Bônus Exclusivos", icon: Gift, section: "modules" },
  { id: "progress", label: "Meu Progresso", icon: TrendingUp, section: "tools" },
  { id: "journal", label: "Diário 21D", icon: BookOpen, section: "tools" },
  { id: "community", label: "Comunidade", icon: MessageSquare, section: "tools" },
  { id: "support", label: "Suporte", icon: HelpCircle, section: "tools" },
]

export function Sidebar({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) {
  const { progress } = useProgress()
  const sectionTitles = {
    main: "",
    modules: "MÓDULOS DO DESAFIO",
    tools: "FERRAMENTAS",
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-[70px] bottom-0 w-64 bg-dark-card lg:bg-dark-card/100 bg-dark-card/95 border-r border-dark-border z-50 transition-transform duration-300 backdrop-blur-md ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 overflow-y-auto scrollbar-hide`}
      >
        <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg">
          <X size={20} />
        </button>

        <nav className="py-6">
          {menuItems.map((item, index) => {
            // derive locked/current/completed from progress when applicable
            const weekIdx = item.id === "week1" ? 0 : item.id === "week2" ? 1 : item.id === "week3" ? 2 : null
            const derived: DerivedState =
              weekIdx !== null && progress
                ? {
                    locked: progress.weeks[weekIdx].isLocked,
                    current: progress.weeks[weekIdx].isActive,
                    completed: progress.weeks[weekIdx].isCompleted,
                  }
                : {}
            const showSectionTitle = index === 0 || menuItems[index - 1].section !== item.section

            return (
              <div key={item.id}>
                {showSectionTitle && item.section !== "main" && (
                  <div className="px-4 mt-6 mb-2">
                    <div className="h-px bg-dark-border mb-2" />
                    <h3 className="text-xs font-bold text-gray-500 tracking-wider">
                      {sectionTitles[item.section as keyof typeof sectionTitles]}
                    </h3>
                  </div>
                )}

                <button
                  onClick={() => !derived.locked && !item.locked && onPageChange(item.id)}
                  disabled={derived.locked || item.locked}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                    currentPage === item.id
                      ? "bg-primary/20 border-l-4 border-primary text-primary"
                      : derived.locked || item.locked
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white/5 hover:translate-x-1 border-l-4 border-transparent"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="flex-1 text-left text-sm font-semibold">{item.label}</span>

                  {item.badge && (
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        derived.current || item.current ? "bg-primary text-white" : "bg-dark-bg"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {(derived.completed || item.completed) && <CheckCircle2 size={18} className="text-accent-green" />}
                  {(derived.current || item.current) && <Flame size={18} className="text-primary animate-pulse" />}
                  {(derived.locked || item.locked) && <Lock size={18} />}
                </button>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

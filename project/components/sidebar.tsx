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
import { useEffect, useState } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: string
  onPageChange: (page: string) => void

  // 👇 adiciona essas novas props
  progress?: {
    week1: { isLocked: boolean; isCompleted: boolean; isActive: boolean }
    week2: { isLocked: boolean; isCompleted: boolean; isActive: boolean }
    week3: { isLocked: boolean; isCompleted: boolean; isActive: boolean }
  }
}

interface MenuItem {
  id: string
  label: string
  icon: any
  section: string
  completed?: boolean
  current?: boolean
  locked?: boolean
  badge?: string
}

export function Sidebar({ isOpen, onClose, currentPage, onPageChange, progress }: SidebarProps) {
  const [menu, setMenu] = useState<MenuItem[]>([])

  useEffect(() => {
    const baseMenu: MenuItem[] = [
      { id: "dashboard", label: "PAINEL GERAL", icon: LayoutDashboard, section: "main" },
      {
        id: "week1",
        label: "Semana 1: Base",
        icon: Flame,
        section: "modules",
        completed: progress?.week1.isCompleted,
        current: progress?.week1.isActive,
        locked: progress?.week1.isLocked,
        badge: "1",
      },
      {
        id: "week2",
        label: "Semana 2: Queima",
        icon: Flame,
        section: "modules",
        completed: progress?.week2.isCompleted,
        current: progress?.week2.isActive,
        locked: progress?.week2.isLocked,
        badge: "2",
      },
      {
        id: "week3",
        label: "Semana 3: Performance",
        icon: Flame,
        section: "modules",
        completed: progress?.week3.isCompleted,
        current: progress?.week3.isActive,
        locked: progress?.week3.isLocked,
        badge: "3",
      },
      { id: "mindset", label: "Mentalidade Alpha", icon: Brain, section: "modules" },
      { id: "nutrition", label: "Nutrição Inteligente", icon: Utensils, section: "modules" },
      { id: "bonuses", label: "Bônus Exclusivos", icon: Gift, section: "modules" },
      { id: "progress", label: "Meu Progresso", icon: TrendingUp, section: "tools" },
      { id: "journal", label: "Diário 21D", icon: BookOpen, section: "tools" },
      { id: "community", label: "Comunidade", icon: MessageSquare, section: "tools" },
      { id: "support", label: "Suporte", icon: HelpCircle, section: "tools" },
    ]
    setMenu(baseMenu)
  }, [progress])

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
          {menu.map((item, index) => {
            const showSectionTitle = index === 0 || menu[index - 1].section !== item.section
            const isUnlocked = !item.locked

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
                  onClick={() => isUnlocked && onPageChange(item.id)}
                  disabled={!isUnlocked}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                    currentPage === item.id
                      ? "bg-primary/20 border-l-4 border-primary text-primary"
                      : !isUnlocked
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-white/5 hover:translate-x-1 border-l-4 border-transparent"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="flex-1 text-left text-sm font-semibold">{item.label}</span>

                  {/* 🔥/✅/🔒 Ícones dinâmicos */}
                  {item.completed && <CheckCircle2 size={18} className="text-accent-green" />}
                  {item.current && <Flame size={18} className="text-primary animate-pulse" />}
                  {item.locked && <Lock size={18} className="text-gray-500" />}
                </button>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

"use client"

import { Menu, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types/database"

interface HeaderProps {
  onMenuToggle: () => void
  user: User | null
  completedDays: number[]
}

export function Header({ onMenuToggle, user, completedDays }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const progress = user ? (completedDays.length / 21) * 100 : 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[70px] z-50 flex items-center px-4 md:px-6 transition-all duration-500 ${
        isScrolled ? "bg-dark-card/80 backdrop-blur-md border-b border-dark-border shadow-lg" : "bg-transparent"
      }`}
    >
      <button onClick={onMenuToggle} className="p-2 hover:bg-white/5 rounded-lg transition-colors active:scale-95">
        <Menu size={24} />
      </button>

      <div className="flex-1 flex justify-center px-2 md:px-4">
        <div className="hidden md:flex flex-col items-center max-w-md w-full">
          <div className="w-full bg-dark-bg/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent-yellow to-accent-green transition-all duration-500 shadow-lg shadow-primary/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-[#e0e0e0] mt-1 font-semibold">{Math.round(progress)}% CONCLUÍDO</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-white/5 rounded-lg p-2 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-yellow flex items-center justify-center font-bold shadow-lg">
              {user?.name.charAt(0) || "U"}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl py-2 animate-slide-up">
              <div className="px-4 py-2 border-b border-dark-border">
                <p className="font-semibold text-[#e0e0e0]">{user?.name || "Usuário"}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>

        {/* Logo placeholder - replace with actual logo */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-yellow flex items-center justify-center font-black text-sm shadow-lg">
          21D
        </div>
      </div>
    </header>
  )
}

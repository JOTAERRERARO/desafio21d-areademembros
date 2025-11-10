"use client"

import { Menu } from "lucide-react"
import { useState, useEffect } from "react"

interface HeaderProps {
  onMenuToggle: () => void
  completedDays: number[]
}

export function Header({ onMenuToggle, completedDays }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  const progress = (completedDays.length / 21) * 100

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
        <img src="/images/design-mode/MYStVHA.png" alt="21D Logo" className="h-24 w-auto object-contain" />
      </div>
    </header>
  )
}

import { Menu, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const progress = user ? (user.completedDays.length / 21) * 100 : 0;

  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-dark-card border-b border-dark-border z-50 flex items-center px-6">
      <button
        onClick={onMenuToggle}
        className="lg:hidden mr-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-black text-sm">
          21D
        </div>
        <span className="font-black text-lg tracking-tight hidden sm:block">DESAFIO 21D</span>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <div className="hidden md:flex flex-col items-center max-w-md w-full">
          <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-red-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 mt-1">
            {Math.round(progress)}% CONCLUÍDO
          </span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-2 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center font-bold">
            {user?.name.charAt(0)}
          </div>
          <span className="font-semibold hidden sm:block">{user?.name}</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl py-2">
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center gap-2 transition-colors">
              <User size={16} />
              Meu Perfil
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center gap-2 transition-colors">
              <Settings size={16} />
              Configurações
            </button>
            <button className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center gap-2 transition-colors">
              <HelpCircle size={16} />
              Suporte
            </button>
            <hr className="my-2 border-dark-border" />
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

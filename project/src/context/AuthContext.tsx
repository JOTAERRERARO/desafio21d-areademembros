import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProgress: (day: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'Carlos Silva',
  email: 'carlos@example.com',
  avatar: '',
  currentDay: 14,
  streak: 7,
  videosWatched: 42,
  completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = async (email: string, password: string) => {
    console.log('Login attempt:', { email, password });
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProgress = (day: number) => {
    if (user && !user.completedDays.includes(day)) {
      setUser({
        ...user,
        completedDays: [...user.completedDays, day],
        videosWatched: user.videosWatched + 1,
        currentDay: day + 1,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUserProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

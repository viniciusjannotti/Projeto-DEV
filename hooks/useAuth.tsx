'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verifica mock auth no localstorage
    const storedUser = localStorage.getItem('aterra_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user && !pathname.startsWith('/login') && pathname !== '/') {
        router.push('/login');
      } else if (user && (pathname === '/login' || pathname === '/')) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    // Mock login credentials as requested
    if ((email === 'adm' || email === 'adm@aterra.com') && pass === '123') {
      const mockUser: User = {
        id: 'u_admin_001',
        email: 'adm@aterra.com',
        role: 'admin',
        name: 'Administrador',
        created_at: new Date().toISOString()
      };
      setUser(mockUser);
      localStorage.setItem('aterra_user', JSON.stringify(mockUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aterra_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

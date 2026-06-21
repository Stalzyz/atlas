"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:6005' : 'https://api.raaghas.in')).replace(/\/api\/v1\/?$/, '') + '/api/v1';
        
        // Fetch session from HttpOnly cookie
        const response = await fetch(`${apiBase}/auth/me`, {
          credentials: 'include',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          setToken(data.access_token);
          setUser(data.user);
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error("Auth: Could not verify session with server", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const login = async (email: string, pass: string) => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:6005' : 'https://api.raaghas.in')).replace(/\/api\/v1\/?$/, '') + '/api/v1';
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pass }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    
    // Positive allowlist: Only allow specific high-privilege roles to access the admin dashboard
    if (data.user.role !== 'SUPER_ADMIN' && data.user.role !== 'ADMIN' && data.user.role !== 'MANAGER') {
      throw new Error('Unauthorized: Admin or Manager access required');
    }

    setToken(data.access_token);
    setUser(data.user);

    router.push('/');
    router.refresh();
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    
    // Invalidate HttpOnly cookie on backend
    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:6005' : 'https://api.raaghas.in')).replace(/\/api\/v1\/?$/, '') + '/api/v1';
      await fetch(`${apiBase}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout request failed');
    }
    
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }
  return context;
}

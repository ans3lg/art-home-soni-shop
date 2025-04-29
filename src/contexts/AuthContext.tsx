
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await api.getCurrentUser(token);
          setUser(userData);
        } catch (error) {
          console.error('Authentication error:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { token, user } = await api.login(email, password);
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast({
        title: 'Вход выполнен',
        description: `Добро пожаловать, ${user.name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Ошибка входа',
        description: error instanceof Error ? error.message : 'Проверьте ваши данные и попробуйте снова',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const { token, user } = await api.register(name, email, password);
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast({
        title: 'Регистрация успешна',
        description: `Аккаунт создан. Добро пожаловать, ${name}!`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Ошибка регистрации',
        description: error instanceof Error ? error.message : 'Пользователь с таким email уже существует',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast({
      title: 'Выход выполнен',
      description: 'Вы вышли из аккаунта',
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

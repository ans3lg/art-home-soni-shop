
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoading: boolean; // Added for compatibility
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isArtist: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';
  const isArtist = user?.role === 'artist';
  
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await api.getCurrentUser(storedToken);
          setUser(userData);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { token, user } = await api.login(email, password);
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (error: any) {
      setError(error.message || 'Ошибка при входе');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { token, user } = await api.register(name, email, password);
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (error: any) {
      setError(error.message || 'Ошибка при регистрации');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      if (!token) throw new Error('Не авторизован');
      
      setLoading(true);
      setError(null);
      
      const updatedUser = await api.updateProfile(profileData, token);
      setUser(prevUser => ({ ...prevUser!, ...updatedUser }));
      
      return updatedUser;
    } catch (error: any) {
      setError(error.message || 'Ошибка при обновлении профиля');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoading: loading, // Added for compatibility
        error,
        isAuthenticated,
        isAdmin,
        isArtist,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  artistOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false, artistOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isArtist, isLoading } = useAuth();
  
  // Показываем лоадер пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Проверяем аутентификацию
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  // Проверяем права администратора
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Проверяем права художника или администратора
  if (artistOnly && !isArtist && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

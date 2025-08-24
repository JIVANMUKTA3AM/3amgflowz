
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: string[];
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { role } = useUserRole();
  const location = useLocation();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location, redirectToOnboarding: true }} replace />;
  }

  // Se tem role específico requerido, verifica se o usuário tem permissão
  if (requireRole && requireRole.length > 0) {
    const userRole = role || profile?.role || 'user';
    if (!requireRole.includes(userRole)) {
      return <Navigate to="/client-dashboard" replace />;
    }
  }

  // Admins têm acesso irrestrito
  if (role === 'admin') {
    return <>{children}</>;
  }

  // Para onboarding, sempre permitir acesso
  if (location.pathname === '/onboarding') {
    return <>{children}</>;
  }

  // Para usuários regulares, verificar se precisam completar o onboarding
  // Se é um novo usuário (sem configuração de onboarding), direcionar para onboarding
  if (!profile?.agent_settings?.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

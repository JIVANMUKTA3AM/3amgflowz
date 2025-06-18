
import { useProfile } from "@/hooks/useProfile";
import { Navigate } from "react-router-dom";
import RoleBasedDashboard from "./RoleBasedDashboard";
import { Loader2 } from "lucide-react";

const RoleBasedRouter = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não tem perfil, redireciona para onboarding
  if (!profile) {
    return <Navigate to="/onboarding" replace />;
  }

  // Se é admin (role principal), vai direto para o dashboard completo
  if (profile.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não tem user_role_type definido, redireciona para onboarding
  if (!profile.user_role_type) {
    return <Navigate to="/onboarding" replace />;
  }

  // Renderiza o dashboard baseado no user_role_type para usuários não-admin
  return <RoleBasedDashboard />;
};

export default RoleBasedRouter;

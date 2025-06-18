
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

  // Se não tem perfil ou role definido, redireciona para onboarding
  if (!profile || !profile.user_role_type) {
    return <Navigate to="/onboarding" replace />;
  }

  // Renderiza o dashboard baseado no role
  return <RoleBasedDashboard />;
};

export default RoleBasedRouter;


import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate, useLocation, Routes, Route } from "react-router-dom";
import RoleBasedDashboard from "./RoleBasedDashboard";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import { Loader2 } from "lucide-react";

const RoleBasedRouter = () => {
  const { profile, isLoading } = useProfile();
  const { role } = useUserRole();
  const location = useLocation();

  console.log('RoleBasedRouter - Current path:', location.pathname);
  console.log('RoleBasedRouter - Profile:', profile);
  console.log('RoleBasedRouter - Role:', role);
  console.log('RoleBasedRouter - Loading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-300">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota principal */}
      <Route path="/" element={<Index />} />
      
      {/* Rota de autenticação */}
      <Route path="/auth" element={<Auth />} />
      
      {/* Rota de onboarding */}
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Dashboard completo para admins */}
      <Route path="/dashboard" element={
        role === 'admin' ? <Dashboard /> : <Navigate to="/" replace />
      } />
      
      {/* Dashboard baseado em role para usuários */}
      <Route path="/client-dashboard" element={<RoleBasedDashboard />} />
      
      {/* Fallback para qualquer outra rota */}
      <Route path="*" element={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Página não encontrada
            </h2>
            <p className="text-gray-300 mb-4">
              Rota atual: {location.pathname}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Ir para Início
            </button>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default RoleBasedRouter;

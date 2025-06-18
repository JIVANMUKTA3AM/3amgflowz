
import { useProfile } from "@/hooks/useProfile";
import TecnicoDashboard from "./agent-dashboard/TecnicoDashboard";
import ComercialDashboard from "./agent-dashboard/ComercialDashboard";
import GeralDashboard from "./agent-dashboard/GeralDashboard";
import Dashboard from "@/pages/Dashboard";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

const RoleBasedDashboard = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando painel...</p>
        </div>
      </div>
    );
  }

  // Se é admin principal, redireciona para dashboard completo
  if (profile?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const userRole = profile?.user_role_type;

  // Layout comum para agentes
  const AgentLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <div>
                <h1 className="font-bold text-xl">Sistema Provedor</h1>
                <p className="text-sm text-gray-600">
                  {userRole === 'tecnico' && 'Área Técnica'}
                  {userRole === 'comercial' && 'Área Comercial'}
                  {userRole === 'geral' && 'Atendimento Geral'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Logado como: {userRole?.toUpperCase()}
              </span>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );

  switch (userRole) {
    case 'tecnico':
      return (
        <AgentLayout>
          <TecnicoDashboard />
        </AgentLayout>
      );
    
    case 'comercial':
      return (
        <AgentLayout>
          <ComercialDashboard />
        </AgentLayout>
      );
    
    case 'geral':
      return (
        <AgentLayout>
          <GeralDashboard />
        </AgentLayout>
      );
    
    case 'admin':
      return <Dashboard />;
    
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Não Configurado
            </h2>
            <p className="text-gray-600 mb-4">
              Seu perfil ainda não foi configurado. Entre em contato com o administrador.
            </p>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ir para Admin Panel
            </button>
          </div>
        </div>
      );
  }
};

export default RoleBasedDashboard;

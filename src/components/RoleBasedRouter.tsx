
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';
import Index from '@/pages/Index';
import ClientDashboard from '@/pages/ClientDashboard';

const RoleBasedRouter = () => {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se for admin, mostra a interface completa atual
  if (role === 'admin') {
    return <Index />;
  }

  // Se for cliente, mostra a interface simplificada
  return <ClientDashboard />;
};

export default RoleBasedRouter;

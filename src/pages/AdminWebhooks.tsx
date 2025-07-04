
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WebhookManagement from "@/components/admin/WebhookManagement";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AdminWebhooks = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

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

  // Verificar se é admin
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gerenciamento de Webhooks
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Configure e monitore webhooks para integração com N8N e outros sistemas externos
          </p>
        </div>

        <WebhookManagement />
      </main>

      <Footer />
    </div>
  );
};

export default AdminWebhooks;

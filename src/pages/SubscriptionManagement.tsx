
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionDashboard from "@/components/subscription/SubscriptionDashboard";
import SubscriptionPlans from "@/components/subscription/SubscriptionPlans";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Loader2 } from "lucide-react";

const SubscriptionManagement = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();
  const { isLoading } = useSubscriptionManagement();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Carregando informações da assinatura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gerenciamento de Assinatura
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie sua assinatura, veja o histórico e explore nossos planos
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dashboard">Minha Assinatura</TabsTrigger>
            <TabsTrigger value="plans">Planos Disponíveis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            <SubscriptionDashboard />
          </TabsContent>
          
          <TabsContent value="plans" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Escolha o Plano Ideal
              </h2>
              <p className="text-gray-600">
                Desbloqueie todo o potencial da plataforma com nossos planos flexíveis
              </p>
            </div>
            <SubscriptionPlans />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionManagement;

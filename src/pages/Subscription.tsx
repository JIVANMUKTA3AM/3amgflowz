
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import SubscriptionCheckout from "@/components/subscription/SubscriptionCheckout";
import QuotaStatus from "@/components/subscription/QuotaStatus";
import { useWorkflow } from "@/hooks/useWorkflow";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Subscription = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success) {
      toast({
        title: "Assinatura ativada!",
        description: "Sua assinatura foi ativada com sucesso. Todos os agentes estão disponíveis.",
      });
    } else if (canceled) {
      toast({
        title: "Pagamento cancelado",
        description: "O processo de pagamento foi cancelado.",
        variant: "destructive",
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Assinaturas e Planos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Plano único e simples: todos os agentes por R$ 499/mês
            </p>
            
            {/* Link para gerenciamento */}
            <Link to="/subscription-management">
              <Button variant="outline" className="mb-8">
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Assinatura
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="plans">Planos</TabsTrigger>
              <TabsTrigger value="status">Minha Assinatura</TabsTrigger>
              <TabsTrigger value="usage">Uso e Cotas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plans" className="space-y-6">
              <SubscriptionCheckout />
            </TabsContent>
            
            <TabsContent value="status" className="space-y-6">
              <SubscriptionStatus />
            </TabsContent>
            
            <TabsContent value="usage" className="space-y-6">
              <QuotaStatus 
                currentUsage={{
                  agents: 3, // Todos os agentes incluídos
                  apiCalls: 0, // Será atualizado com dados reais
                  integrations: 0 // Será atualizado com dados reais
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscription;


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import CustomIntegrationSection from "@/components/integrations/CustomIntegrationSection";
import { useWorkflow } from "@/hooks/useWorkflow";
import { integrations } from "@/constants/integrations";

const Integracoes = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Integrações Disponíveis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conecte seus agentes IA com suas ferramentas favoritas e automatize 
              completamente o fluxo de atendimento ao cliente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>

          <CustomIntegrationSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Integracoes;

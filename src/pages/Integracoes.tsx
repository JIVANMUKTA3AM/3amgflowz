
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import CustomIntegrationSection from "@/components/integrations/CustomIntegrationSection";
import { useWorkflowSafe } from "@/hooks/useWorkflowSafe";
import { integrationsFallback } from "@/constants/integrationsFallback";

// Tentar importar as integrações originais, usar fallback se não existir
let integrations;
try {
  const originalIntegrations = require("@/constants/integrations");
  integrations = originalIntegrations.integrations || integrationsFallback;
} catch {
  integrations = integrationsFallback;
}

const Integracoes = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflowSafe();

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
            {integrations && integrations.length > 0 ? (
              integrations.map((integration) => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma integração encontrada
                  </h3>
                  <p className="text-gray-600">
                    Não foi possível carregar as integrações disponíveis.
                  </p>
                </div>
              </div>
            )}
          </div>

          <CustomIntegrationSection />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Integracoes;

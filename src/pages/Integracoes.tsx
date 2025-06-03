
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import IntegrationCard from "@/components/IntegrationCard";
import WebhookSpecificConfig from "@/components/WebhookSpecificConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { agentIntegrations, getIntegrationConfig, IntegrationConfig } from "@/services/integrations";

const Integracoes = () => {
  const { handleWorkflowTrigger, isLoading } = useWorkflow();
  const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig | null>>({});
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(true);

  useEffect(() => {
    loadIntegrationConfigs();
  }, []);

  const loadIntegrationConfigs = async () => {
    setIsLoadingConfigs(true);
    try {
      const configs: Record<string, IntegrationConfig | null> = {};
      
      for (const integration of agentIntegrations) {
        const config = await getIntegrationConfig(integration.agentType);
        configs[integration.agentType] = config;
      }
      
      setIntegrationConfigs(configs);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setIsLoadingConfigs(false);
    }
  };

  const handleStatusChange = (agentType: string, connected: boolean) => {
    setIntegrationConfigs(prev => ({
      ...prev,
      [agentType]: prev[agentType] ? { ...prev[agentType]!, isConnected: connected } : null
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      {/* Hero Section */}
      <section className="bg-gradient-3amg text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Integrações
          </h1>
          <p className="text-xl opacity-90">
            Conecte seus agentes com Google Sheets, CRM e Slack para automatizar seus fluxos de trabalho.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger value="services" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Serviços Externos
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Webhooks n8n
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {isLoadingConfigs ? (
                <Card>
                  <CardContent className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-3amg-purple"></div>
                  </CardContent>
                </Card>
              ) : (
                agentIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.agentType}
                    integration={integration}
                    existingConfig={integrationConfigs[integration.agentType]}
                    onStatusChange={(connected) => handleStatusChange(integration.agentType, connected)}
                  />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="webhooks" className="mt-6">
            <WebhookSpecificConfig />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Integracoes;

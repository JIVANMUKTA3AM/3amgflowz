
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import IntegrationCard from "@/components/IntegrationCard";
import { AgentIntegration, agentIntegrations, getIntegrationConfig, IntegrationConfig } from "@/services/integrations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Integracoes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [integrations, setIntegrations] = useState<AgentIntegration[]>([]);
  const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, IntegrationConfig | null>>({});

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setIsLoading(true);
    try {
      // Carregar dados das integrações
      setIntegrations(agentIntegrations);

      // Buscar configurações salvas para cada tipo de agente
      const configs: Record<string, IntegrationConfig | null> = {};
      for (const integration of agentIntegrations) {
        const config = await getIntegrationConfig(integration.agentType);
        configs[integration.agentType] = config;
        
        // Atualizar o status de conexão na lista de integrações
        if (config && config.isConnected) {
          setIntegrations(prevIntegrations => 
            prevIntegrations.map(i => 
              i.agentType === integration.agentType 
                ? { ...i, isConnected: true } 
                : i
            )
          );
        }
      }
      setIntegrationConfigs(configs);
    } catch (error) {
      console.error("Erro ao carregar integrações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações de integração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (agentType: string, connected: boolean) => {
    setIntegrations(prevIntegrations => 
      prevIntegrations.map(i => 
        i.agentType === agentType ? { ...i, isConnected: connected } : i
      )
    );
  };

  const getIntegrationsByType = (type: string) => {
    return integrations.filter(i => i.serviceType === type);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Carregando integrações...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Integrações de Serviços</h1>
          <p className="text-gray-600">
            Configure as integrações para cada tipo de agente com os serviços externos.
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="ticket">Tickets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {integrations.map((integration) => (
              <IntegrationCard
                key={`${integration.agentType}-${integration.serviceType}`}
                integration={integration}
                existingConfig={integrationConfigs[integration.agentType]}
                onStatusChange={(connected) => handleStatusChange(integration.agentType, connected)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="whatsapp" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {getIntegrationsByType("whatsapp").map((integration) => (
              <IntegrationCard
                key={`${integration.agentType}-${integration.serviceType}`}
                integration={integration}
                existingConfig={integrationConfigs[integration.agentType]}
                onStatusChange={(connected) => handleStatusChange(integration.agentType, connected)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="crm" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {getIntegrationsByType("crm").map((integration) => (
              <IntegrationCard
                key={`${integration.agentType}-${integration.serviceType}`}
                integration={integration}
                existingConfig={integrationConfigs[integration.agentType]}
                onStatusChange={(connected) => handleStatusChange(integration.agentType, connected)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="ticket" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {getIntegrationsByType("ticket").map((integration) => (
              <IntegrationCard
                key={`${integration.agentType}-${integration.serviceType}`}
                integration={integration}
                existingConfig={integrationConfigs[integration.agentType]}
                onStatusChange={(connected) => handleStatusChange(integration.agentType, connected)}
              />
            ))}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Integracoes;

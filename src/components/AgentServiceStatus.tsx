
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentIntegration, IntegrationConfig, agentIntegrations, getIntegrationConfig } from "@/services/integrations";
import IntegrationStatusChip from "./IntegrationStatusChip";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";

const AgentServiceStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, boolean | undefined>>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadIntegrationStatus();
  }, []);

  const loadIntegrationStatus = async () => {
    setIsLoading(true);
    try {
      const statuses: Record<string, boolean | undefined> = {};
      
      for (const integration of agentIntegrations) {
        const config = await getIntegrationConfig(integration.agentType);
        statuses[integration.agentType] = config?.isConnected;
      }
      
      setIntegrationStatus(statuses);
    } catch (error) {
      console.error("Erro ao carregar status das integrações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIntegrationByAgentType = (agentType: string): AgentIntegration | undefined => {
    return agentIntegrations.find(i => i.agentType === agentType);
  };

  const handleConfigureIntegrations = () => {
    navigate("/integracoes");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status dos Serviços</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Status dos Serviços</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleConfigureIntegrations}
          className="flex items-center gap-1 text-xs"
        >
          <span>Configurar</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {agentIntegrations.map((integration) => {
          const isConnected = integrationStatus[integration.agentType];
          
          return (
            <div key={integration.agentType} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{integration.serviceName}</p>
                <p className="text-xs text-gray-500">{getAgentTypeName(integration.agentType)}</p>
              </div>
              <IntegrationStatusChip isConnected={isConnected} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const getAgentTypeName = (agentType: string): string => {
  switch (agentType) {
    case "atendimento":
      return "Agente de Atendimento";
    case "comercial":
      return "Agente Comercial";
    case "suporte_tecnico":
      return "Agente de Suporte Técnico";
    default:
      return agentType;
  }
};

export default AgentServiceStatus;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentIntegration, IntegrationConfig, agentIntegrations, getIntegrationConfig } from "@/services/integrations";
import IntegrationStatusChip from "./IntegrationStatusChip";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Activity, Wifi, Settings } from "lucide-react";

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

  const connectedCount = Object.values(integrationStatus).filter(status => status === true).length;
  const totalCount = agentIntegrations.length;

  if (isLoading) {
    return (
      <Card className="h-full bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 border-indigo-200/50 shadow-lg">
        <CardHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Status dos Serviços
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="text-sm text-gray-500">Verificando conexões...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-[1.02]">
      <CardHeader className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg"></div>
        <div className="relative z-10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Status dos Serviços
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  {connectedCount}/{totalCount} conectados
                </span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleConfigureIntegrations}
            className="flex items-center gap-2 text-xs hover:bg-indigo-100/60 transition-all duration-200 hover:scale-105"
          >
            <Settings className="h-4 w-4" />
            <span>Configurar</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Integrações Ativas</span>
            <span className="text-sm text-indigo-600 font-semibold">
              {Math.round((connectedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${(connectedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Services List */}
        {agentIntegrations.map((integration, index) => {
          const isConnected = integrationStatus[integration.agentType];
          
          return (
            <div 
              key={integration.agentType} 
              className="group flex items-center justify-between p-3 rounded-lg border border-gray-200/60 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:border-indigo-300/60 transition-all duration-300 hover:shadow-md animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${
                    isConnected === true 
                      ? 'bg-green-500 shadow-green-500/50' 
                      : isConnected === false 
                        ? 'bg-red-500 shadow-red-500/50' 
                        : 'bg-gray-400 shadow-gray-400/50'
                  } shadow-lg`}></div>
                  {isConnected === true && (
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-20"></div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                    {integration.serviceName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getAgentTypeName(integration.agentType)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IntegrationStatusChip isConnected={isConnected} />
              </div>
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

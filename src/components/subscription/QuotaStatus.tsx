
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionQuotas } from "@/hooks/useSubscriptionQuotas";
import { Bot, Zap, Settings, CheckCircle } from "lucide-react";

interface QuotaStatusProps {
  currentUsage: {
    agents: number;
    apiCalls: number;
    integrations: number;
  };
}

const QuotaStatus = ({ currentUsage }: QuotaStatusProps) => {
  const { quotas, currentPlan, checkQuota } = useSubscriptionQuotas();

  const agentQuota = checkQuota('maxAgents', currentUsage.agents);
  const apiQuota = checkQuota('maxApiCalls', currentUsage.apiCalls);
  const integrationQuota = checkQuota('maxIntegrations', currentUsage.integrations);

  const getProgressValue = (current: number, max: number) => {
    if (max === -1) return 0; // Ilimitado
    if (max === 0) return 100; // Bloqueado
    return (current / max) * 100;
  };

  const getProgressColor = (current: number, max: number) => {
    if (max === -1) return "bg-green-500"; // Ilimitado
    if (max === 0) return "bg-red-500"; // Bloqueado
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Uso e Cotas
        </h2>
        <p className="text-gray-600">
          Acompanhe o uso dos recursos da sua assinatura
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agentes */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                Agentes
              </CardTitle>
              <Badge variant={currentPlan === 'premium' ? 'default' : 'secondary'}>
                {currentPlan === 'premium' ? 'Todos Incluídos' : 'Indisponível'}
              </Badge>
            </div>
            <CardDescription>
              {quotas.maxAgents === -1 ? 'Ilimitado' : 
               quotas.maxAgents === 0 ? 'Nenhum agente disponível' :
               `${currentUsage.agents} de ${quotas.maxAgents} agentes`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlan === 'premium' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Chatbot incluído
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Voice Assistant incluído
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  WhatsApp Bot incluído
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Faça upgrade para acessar os agentes
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chamadas de API */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Chamadas de API
              </CardTitle>
              <Badge variant={quotas.maxApiCalls === -1 ? 'default' : 'secondary'}>
                {quotas.maxApiCalls === -1 ? 'Ilimitado' : 'Limitado'}
              </Badge>
            </div>
            <CardDescription>
              {quotas.maxApiCalls === -1 ? 'Uso ilimitado' : 
               quotas.maxApiCalls === 0 ? 'Nenhuma chamada disponível' :
               `${currentUsage.apiCalls} de ${quotas.maxApiCalls} chamadas`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quotas.maxApiCalls === -1 ? (
              <div className="text-sm text-green-600">
                Chamadas ilimitadas de API
              </div>
            ) : quotas.maxApiCalls === 0 ? (
              <div className="text-sm text-gray-500">
                Faça upgrade para usar a API
              </div>
            ) : (
              <Progress 
                value={getProgressValue(currentUsage.apiCalls, quotas.maxApiCalls)} 
                className="h-2"
              />
            )}
          </CardContent>
        </Card>

        {/* Integrações */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-500" />
                Integrações
              </CardTitle>
              <Badge variant={quotas.maxIntegrations === -1 ? 'default' : 'secondary'}>
                {quotas.maxIntegrations === -1 ? 'Ilimitado' : 'Limitado'}
              </Badge>
            </div>
            <CardDescription>
              {quotas.maxIntegrations === -1 ? 'Integrações ilimitadas' : 
               quotas.maxIntegrations === 0 ? 'Nenhuma integração disponível' :
               `${currentUsage.integrations} de ${quotas.maxIntegrations} integrações`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quotas.maxIntegrations === -1 ? (
              <div className="text-sm text-green-600">
                Todas as integrações disponíveis
              </div>
            ) : quotas.maxIntegrations === 0 ? (
              <div className="text-sm text-gray-500">
                Faça upgrade para usar integrações
              </div>
            ) : (
              <Progress 
                value={getProgressValue(currentUsage.integrations, quotas.maxIntegrations)} 
                className="h-2"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Status */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos Disponíveis</CardTitle>
          <CardDescription>
            Recursos incluídos no seu plano atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${quotas.hasAdvancedAnalytics ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${quotas.hasAdvancedAnalytics ? 'text-green-600' : 'text-gray-500'}`}>
                Analytics Avançados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${quotas.hasPrioritySupport ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${quotas.hasPrioritySupport ? 'text-green-600' : 'text-gray-500'}`}>
                Suporte Prioritário
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${quotas.hasCustomIntegrations ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${quotas.hasCustomIntegrations ? 'text-green-600' : 'text-gray-500'}`}>
                Integrações Customizadas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className={`h-4 w-4 ${quotas.canExportData ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${quotas.canExportData ? 'text-green-600' : 'text-gray-500'}`}>
                Exportação de Dados
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotaStatus;

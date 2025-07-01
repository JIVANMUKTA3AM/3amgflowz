
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSubscriptionQuotas } from "@/hooks/useSubscriptionQuotas";
import { AlertTriangle, Infinity, CheckCircle, XCircle } from "lucide-react";

interface QuotaStatusProps {
  currentUsage?: {
    agents?: number;
    apiCalls?: number;
    integrations?: number;
  };
  showUpgradeAlert?: boolean;
}

const QuotaStatus = ({ currentUsage = {}, showUpgradeAlert = true }: QuotaStatusProps) => {
  const { quotas, currentPlan, checkQuota, isFeatureAvailable } = useSubscriptionQuotas();

  const usageStats = [
    {
      label: "Agentes IA",
      current: currentUsage.agents || 0,
      limit: quotas.maxAgents,
      icon: "🤖"
    },
    {
      label: "Chamadas API",
      current: currentUsage.apiCalls || 0,
      limit: quotas.maxApiCalls,
      icon: "📡"
    },
    {
      label: "Integrações",
      current: currentUsage.integrations || 0,
      limit: quotas.maxIntegrations,
      icon: "🔗"
    },
  ];

  const features = [
    {
      label: "Analytics Avançados",
      available: isFeatureAvailable('hasAdvancedAnalytics'),
    },
    {
      label: "Suporte Prioritário",
      available: isFeatureAvailable('hasPrioritySupport'),
    },
    {
      label: "Integrações Customizadas",
      available: isFeatureAvailable('hasCustomIntegrations'),
    },
    {
      label: "Exportação de Dados",
      available: isFeatureAvailable('canExportData'),
    },
  ];

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (current: number, limit: number) => {
    if (limit === -1) return "text-green-600";
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  const hasLimitReached = usageStats.some(stat => 
    stat.limit !== -1 && stat.current >= stat.limit
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Status de Uso - Plano {currentPlan}</span>
            <Badge variant="outline" className="capitalize">
              {currentPlan}
            </Badge>
          </CardTitle>
          <CardDescription>
            Acompanhe seu uso atual e limites do plano
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Usage Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {usageStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </span>
                  <span className={`text-sm font-mono ${getUsageColor(stat.current, stat.limit)}`}>
                    {stat.current}/{stat.limit === -1 ? <Infinity className="w-4 h-4 inline" /> : stat.limit}
                  </span>
                </div>
                {stat.limit !== -1 && (
                  <Progress 
                    value={getUsagePercentage(stat.current, stat.limit)} 
                    className="h-2"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recursos Disponíveis</h4>
            <div className="grid grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  {feature.available ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${feature.available ? 'text-gray-900' : 'text-gray-400'}`}>
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Alert */}
          {hasLimitReached && showUpgradeAlert && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Você atingiu o limite de alguns recursos. Considere fazer upgrade para continuar usando todos os recursos.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotaStatus;

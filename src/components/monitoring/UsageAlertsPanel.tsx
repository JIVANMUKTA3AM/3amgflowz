
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, DollarSign, Zap, TrendingUp } from "lucide-react";
import { UsageAlert, TokenUsage } from "@/hooks/useTokenMonitoring";

interface UsageAlertsPanelProps {
  usageAlerts: UsageAlert[];
  tokenUsage: TokenUsage[];
  isLoading: boolean;
}

const UsageAlertsPanel = ({ usageAlerts, tokenUsage, isLoading }: UsageAlertsPanelProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUsagePercentage = (current: number, threshold: number) => {
    return Math.min((current / threshold) * 100, 100);
  };

  // Calcular estatísticas atuais
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  const todayUsage = tokenUsage.filter(usage => usage.date === today);
  const monthlyUsage = tokenUsage.filter(usage => usage.date.startsWith(currentMonth));

  const dailyTokens = todayUsage.reduce((sum, usage) => sum + usage.tokens_used, 0);
  const dailyCost = todayUsage.reduce((sum, usage) => sum + usage.cost_estimate, 0);
  const monthlyTokens = monthlyUsage.reduce((sum, usage) => sum + usage.tokens_used, 0);
  const monthlyCost = monthlyUsage.reduce((sum, usage) => sum + usage.cost_estimate, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertas Ativos
          </CardTitle>
          <CardDescription>
            Monitoramento de limites e thresholds de uso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usageAlerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">Nenhum alerta ativo</p>
                <p className="text-xs text-gray-400">Seus recursos estão dentro dos limites</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {usageAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(alert.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">{alert.message}</p>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Uso atual: {alert.current_usage.toLocaleString()}</span>
                            <span>Limite: {alert.threshold.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={getUsagePercentage(alert.current_usage, alert.threshold)}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo de Uso Atual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Uso Diário
            </CardTitle>
            <CardDescription>Consumo de hoje</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Tokens</span>
                <span className="font-medium">{dailyTokens.toLocaleString()}</span>
              </div>
              <Progress value={getUsagePercentage(dailyTokens, 50000)} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Limite sugerido: 50K tokens/dia</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Custo</span>
                <span className="font-medium">${dailyCost.toFixed(2)}</span>
              </div>
              <Progress value={getUsagePercentage(dailyCost, 10)} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Limite sugerido: $10/dia</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Uso Mensal
            </CardTitle>
            <CardDescription>Consumo do mês atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Tokens</span>
                <span className="font-medium">{monthlyTokens.toLocaleString()}</span>
              </div>
              <Progress value={getUsagePercentage(monthlyTokens, 500000)} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Limite sugerido: 500K tokens/mês</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Custo</span>
                <span className="font-medium">${monthlyCost.toFixed(2)}</span>
              </div>
              <Progress value={getUsagePercentage(monthlyCost, 100)} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Limite sugerido: $100/mês</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageAlertsPanel;

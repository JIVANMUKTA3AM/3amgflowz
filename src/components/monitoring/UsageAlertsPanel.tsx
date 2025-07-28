
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Clock, Loader2 } from "lucide-react";

interface UsageAlertsPanelProps {
  usageAlerts: any[];
  tokenUsage: any[];
  isLoading: boolean;
}

const UsageAlertsPanel = ({ usageAlerts, tokenUsage, isLoading }: UsageAlertsPanelProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Uso</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

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
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'low': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Calcular estatísticas de uso
  const totalTokensToday = tokenUsage
    .filter(usage => usage.date === new Date().toISOString().split('T')[0])
    .reduce((sum, usage) => sum + usage.tokens_used, 0);

  const totalCostToday = tokenUsage
    .filter(usage => usage.date === new Date().toISOString().split('T')[0])
    .reduce((sum, usage) => sum + usage.cost_estimate, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Uso Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tokens:</span>
                <span className="font-medium">{totalTokensToday.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Custo:</span>
                <span className="font-medium">${totalCostToday.toFixed(4)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Alertas Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <Badge variant={usageAlerts.length > 0 ? 'destructive' : 'default'}>
                {usageAlerts.length} alertas
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas de Uso Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          {usageAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum alerta ativo no momento
            </div>
          ) : (
            <div className="space-y-4">
              {usageAlerts.map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-yellow-500">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <AlertDescription className="font-medium">
                          {alert.message}
                        </AlertDescription>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Limite: {alert.threshold_value} | Atual: {alert.current_value}
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAlertsPanel;

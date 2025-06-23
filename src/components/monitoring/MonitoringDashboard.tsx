
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, TrendingUp, DollarSign, Zap, Clock, AlertTriangle } from "lucide-react";
import { useTokenMonitoring } from "@/hooks/useTokenMonitoring";
import TokenUsageChart from "./TokenUsageChart";
import ModelPerformanceTable from "./ModelPerformanceTable";
import UsageAlertsPanel from "./UsageAlertsPanel";

const MonitoringDashboard = () => {
  const {
    tokenUsage,
    modelPerformance,
    usageAlerts,
    isLoading,
    refreshData,
  } = useTokenMonitoring();

  // Calcular métricas resumidas
  const totalTokensToday = tokenUsage
    .filter(usage => usage.date === new Date().toISOString().split('T')[0])
    .reduce((sum, usage) => sum + usage.tokens_used, 0);

  const totalCostToday = tokenUsage
    .filter(usage => usage.date === new Date().toISOString().split('T')[0])
    .reduce((sum, usage) => sum + usage.cost_estimate, 0);

  const totalConversationsToday = tokenUsage
    .filter(usage => usage.date === new Date().toISOString().split('T')[0])
    .reduce((sum, usage) => sum + usage.conversations_count, 0);

  const avgResponseTime = modelPerformance.length > 0
    ? modelPerformance.reduce((sum, model) => sum + model.avg_response_time, 0) / modelPerformance.length
    : 0;

  const formatTime = (ms: number) => {
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Monitoramento</h1>
          <p className="text-gray-600 mt-2">Acompanhe o uso de tokens, custos e performance dos seus agentes</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Alertas */}
      {usageAlerts.length > 0 && (
        <div className="mb-6">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-yellow-800">Alertas de Uso</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {usageAlerts.map((alert) => (
                  <Badge key={alert.id} variant={getSeverityColor(alert.severity)}>
                    {alert.message}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tokens Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{totalTokensToday.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Custo Hoje</p>
                <p className="text-2xl font-bold text-gray-900">${totalCostToday.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversas Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{totalConversationsToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(avgResponseTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com diferentes visualizações */}
      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Uso de Tokens</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="mt-6">
          <TokenUsageChart tokenUsage={tokenUsage} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <ModelPerformanceTable 
            modelPerformance={modelPerformance} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <UsageAlertsPanel 
            usageAlerts={usageAlerts} 
            tokenUsage={tokenUsage}
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;

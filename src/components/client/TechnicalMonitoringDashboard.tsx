import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Router, 
  Network, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Signal, 
  Zap,
  RefreshCw,
  Eye,
  Settings,
  MonitorSpeaker
} from "lucide-react";
import { useOLTMetrics } from "@/hooks/useOLTMetrics";
import { useSNMPData } from "@/hooks/useSNMPData";
import { useONTMonitoring } from "@/hooks/useONTMonitoring";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";

const TechnicalMonitoringDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { oltMetrics, alerts, isLoading: oltLoading, refetch: refetchOLT } = useOLTMetrics();
  const { snmpData, snmpLogs, isLoading: snmpLoading, refetch: refetchSNMP } = useSNMPData();
  const { ontData, isLoading: ontLoading } = useONTMonitoring();
  const { configurations } = useAgentConfigurations();

  // Auto refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetchOLT();
      refetchSNMP();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchOLT, refetchSNMP]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const formatSignalStrength = (power: number | null) => {
    if (!power) return 'N/A';
    return `${power.toFixed(1)} dBm`;
  };

  const formatUptime = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  // Aggregate metrics
  const totalOLTs = oltMetrics.length;
  const totalONTs = oltMetrics.reduce((sum, olt) => sum + olt.total_onts, 0);
  const onlineONTs = oltMetrics.reduce((sum, olt) => sum + olt.onts_online, 0);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical').length;
  const avgUptime = oltMetrics.length > 0 
    ? oltMetrics.reduce((sum, olt) => sum + olt.uptime_percentage, 0) / oltMetrics.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Monitoramento Técnico</h2>
          <p className="text-gray-400">Dashboard interativo para acompanhamento de agentes e infraestrutura</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="bg-gray-800 hover:bg-gray-700 border-gray-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchOLT();
              refetchSNMP();
            }}
            className="bg-gray-800 hover:bg-gray-700 border-gray-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total OLTs</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-white">{totalOLTs}</p>
                  <Badge variant="secondary" className="text-xs">
                    {oltMetrics.filter(olt => olt.uptime_percentage > 95).length} Online
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-3amg-orange/20 rounded-full">
                <Router className="h-8 w-8 text-3amg-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">ONTs Monitoradas</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-white">{totalONTs}</p>
                  <Badge variant="secondary" className="text-xs">
                    {onlineONTs} Online
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <MonitorSpeaker className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Alertas Críticos</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-white">{criticalAlerts}</p>
                  <Badge variant={criticalAlerts > 0 ? "destructive" : "secondary"} className="text-xs">
                    {alerts.length} Total
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Uptime Médio</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-white">{formatUptime(avgUptime)}</p>
                  <Badge variant={avgUptime > 95 ? "secondary" : "destructive"} className="text-xs">
                    Rede
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-1">
          <TabsTrigger value="overview" className="text-white data-[state=active]:text-foreground data-[state=active]:bg-background">
            <Eye className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="olts" className="text-white data-[state=active]:text-foreground data-[state=active]:bg-background">
            <Router className="h-4 w-4 mr-2" />
            OLTs
          </TabsTrigger>
          <TabsTrigger value="onts" className="text-white data-[state=active]:text-foreground data-[state=active]:bg-background">
            <MonitorSpeaker className="h-4 w-4 mr-2" />
            ONTs
          </TabsTrigger>
          <TabsTrigger value="agents" className="text-white data-[state=active]:text-foreground data-[state=active]:bg-background">
            <Activity className="h-4 w-4 mr-2" />
            Agentes
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-white data-[state=active]:text-foreground data-[state=active]:bg-background">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alertas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OLT Status Overview */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Router className="h-5 w-5 text-3amg-orange" />
                  Status das OLTs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {oltLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-3amg-orange mx-auto"></div>
                  </div>
                ) : oltMetrics.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Nenhuma OLT configurada</p>
                ) : (
                  oltMetrics.slice(0, 5).map((olt) => (
                    <div key={olt.olt_id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${olt.uptime_percentage > 95 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          <Router className={`h-4 w-4 ${olt.uptime_percentage > 95 ? 'text-green-400' : 'text-red-400'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-white">{olt.olt_name}</p>
                          <p className="text-sm text-gray-400">{olt.onts_online}/{olt.total_onts} ONTs Online</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatUptime(olt.uptime_percentage)}</p>
                        <Progress value={olt.uptime_percentage} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Alertas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400">Nenhum alerta ativo</p>
                  </div>
                ) : (
                  alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                      <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${
                        alert.severity === 'critical' ? 'text-red-400' :
                        alert.severity === 'high' ? 'text-orange-400' :
                        alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{alert.message}</p>
                        <p className="text-xs text-gray-400">{alert.olt_name} • {new Date(alert.created_at).toLocaleString()}</p>
                      </div>
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="olts" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {oltLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-3amg-orange mx-auto"></div>
              </div>
            ) : oltMetrics.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Router className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Nenhuma OLT configurada</p>
              </div>
            ) : (
              oltMetrics.map((olt) => (
                <Card key={olt.olt_id} className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-white">{olt.olt_name}</CardTitle>
                      <div className={`p-2 rounded-full ${olt.uptime_percentage > 95 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <Router className={`h-4 w-4 ${olt.uptime_percentage > 95 ? 'text-green-400' : 'text-red-400'}`} />
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">
                      Última sincronização: {new Date(olt.last_sync).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">ONTs Online</p>
                        <p className="text-lg font-semibold text-white">{olt.onts_online}/{olt.total_onts}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">Uptime</p>
                        <p className="text-lg font-semibold text-white">{formatUptime(olt.uptime_percentage)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Sinal Médio</span>
                        <span className="text-white">{formatSignalStrength(olt.avg_signal_strength)}</span>
                      </div>
                      <Progress value={Math.abs(olt.avg_signal_strength) * 4} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Uso Bandwidth</span>
                        <span className="text-white">{olt.bandwidth_usage.toFixed(1)}%</span>
                      </div>
                      <Progress value={olt.bandwidth_usage} className="h-2" />
                    </div>

                    {olt.alerts_count > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-red-400">{olt.alerts_count} alertas ativos</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="onts" className="mt-6">
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MonitorSpeaker className="h-5 w-5 text-blue-400" />
                ONTs Monitoradas
              </CardTitle>
              <CardDescription className="text-gray-400">
                Status detalhado de todas as ONTs em monitoramento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ontLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-3amg-orange mx-auto"></div>
                </div>
              ) : ontData.length === 0 ? (
                <div className="text-center py-8">
                  <MonitorSpeaker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Nenhuma ONT em monitoramento</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-400">Serial</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">RX Power</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">TX Power</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">Temperatura</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-400">Última Atualização</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ontData.slice(0, 10).map((ont) => (
                        <tr key={ont.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-3 px-4 text-white">{ont.ont_serial}</td>
                          <td className="py-3 px-4">
                            <Badge variant={ont.status === 'online' ? 'secondary' : 'destructive'}>
                              {ont.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-white">{formatSignalStrength(ont.optical_power_rx)}</td>
                          <td className="py-3 px-4 text-white">{formatSignalStrength(ont.optical_power_tx)}</td>
                          <td className="py-3 px-4 text-white">
                            {ont.temperature ? `${ont.temperature.toFixed(1)}°C` : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-gray-400">
                            {ont.last_seen ? new Date(ont.last_seen).toLocaleString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {configurations.map((config) => (
              <Card key={config.id} className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-white">{config.name}</CardTitle>
                    <div className={`p-2 rounded-full ${config.is_active ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                      <Activity className={`h-4 w-4 ${config.is_active ? 'text-green-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Tipo: {config.agent_type} • Modelo: {config.model}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">Status</p>
                      <Badge variant={config.is_active ? 'secondary' : 'outline'}>
                        {config.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400">Temperatura</p>
                      <p className="text-sm text-white">{config.temperature || 0.7}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Max Tokens</p>
                    <p className="text-sm text-white">{config.max_tokens || 1000}</p>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Central de Alertas
              </CardTitle>
              <CardDescription className="text-gray-400">
                Todos os alertas do sistema de monitoramento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Sistema operando normalmente</p>
                  <p className="text-gray-500 text-sm">Nenhum alerta ativo no momento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg border-l-4 border-l-red-500">
                      <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-400' :
                        alert.severity === 'high' ? 'text-orange-400' :
                        alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{alert.message}</h4>
                          <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">OLT: {alert.olt_name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Resolver
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalMonitoringDashboard;
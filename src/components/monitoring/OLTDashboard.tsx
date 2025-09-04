import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  TrendingUp,
  Signal,
  Clock,
  BarChart3
} from 'lucide-react';
import { useOLTMetrics } from '@/hooks/useOLTMetrics';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const OLTDashboard = () => {
  const { oltMetrics, alerts, isLoading, refetch } = useOLTMetrics();
  const [selectedOLT, setSelectedOLT] = useState<string | null>(null);

  // Calcular estatísticas gerais
  const totalOLTs = oltMetrics.length;
  const totalONTs = oltMetrics.reduce((sum, olt) => sum + olt.total_onts, 0);
  const totalOntsOnline = oltMetrics.reduce((sum, olt) => sum + olt.onts_online, 0);
  const totalOntsOffline = oltMetrics.reduce((sum, olt) => sum + olt.onts_offline, 0);
  const avgUptime = oltMetrics.length > 0 
    ? oltMetrics.reduce((sum, olt) => sum + olt.uptime_percentage, 0) / oltMetrics.length 
    : 0;
  const totalAlerts = alerts.filter(alert => !alert.resolved).length;
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.resolved).length;

  // Dados para gráficos
  const uptimeData = oltMetrics.map(olt => ({
    name: olt.olt_name,
    uptime: olt.uptime_percentage,
    bandwidth: olt.bandwidth_usage
  }));

  const ontsStatusData = [
    { name: 'Online', value: totalOntsOnline, color: 'hsl(var(--success))' },
    { name: 'Offline', value: totalOntsOffline, color: 'hsl(var(--destructive))' }
  ];

  const alertsData = oltMetrics.map(olt => ({
    name: olt.olt_name,
    alerts: olt.alerts_count
  }));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 98) return 'text-success';
    if (uptime >= 95) return 'text-warning';
    return 'text-destructive';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com métricas gerais */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Monitoramento OLT</h2>
          <p className="text-muted-foreground">
            Visão geral do status e performance das suas OLTs
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center p-6">
            <Server className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">OLTs Ativas</p>
              <p className="text-2xl font-bold text-primary">{totalOLTs}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
          <CardContent className="flex items-center p-6">
            <Wifi className="h-8 w-8 text-success mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">ONTs Online</p>
              <p className="text-2xl font-bold text-success">{totalOntsOnline}</p>
              <p className="text-xs text-muted-foreground">de {totalONTs} total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
          <CardContent className="flex items-center p-6">
            <WifiOff className="h-8 w-8 text-destructive mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">ONTs Offline</p>
              <p className="text-2xl font-bold text-destructive">{totalOntsOffline}</p>
              <p className="text-xs text-muted-foreground">Requer atenção</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-3amg-purple/20 bg-gradient-to-br from-3amg-purple/5 to-transparent">
          <CardContent className="flex items-center p-6">
            <Activity className="h-8 w-8 text-3amg-purple mr-3" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Uptime Médio</p>
              <p className={`text-2xl font-bold ${getUptimeColor(avgUptime)}`}>
                {avgUptime.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas críticos */}
      {totalAlerts > 0 && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning-foreground">
              <AlertTriangle className="h-5 w-5" />
              Alertas Ativos ({totalAlerts})
              {criticalAlerts > 0 && (
                <Badge variant="destructive">{criticalAlerts} críticos</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-background rounded border">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {alert.olt_name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs principais */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="olts">Detalhes OLTs</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de status das ONTs */}
            <Card>
              <CardHeader>
                <CardTitle>Status das ONTs</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={ontsStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ontsStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {ontsStatusData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertas por OLT */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas por OLT</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={alertsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="alerts" fill="hsl(var(--destructive))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="space-y-6">
            {/* Gráfico de uptime */}
            <Card>
              <CardHeader>
                <CardTitle>Uptime e Uso de Bandwidth por OLT</CardTitle>
              </CardHeader>
              <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={uptimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="uptime" 
                        stackId="1"
                        stroke="hsl(var(--success))" 
                        fill="hsl(var(--success))" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bandwidth" 
                        stackId="2"
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="olts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {oltMetrics.map((olt) => (
              <Card key={olt.olt_id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{olt.olt_name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {olt.uptime_percentage >= 98 ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">ONTs Total</p>
                      <p className="font-medium">{olt.total_onts}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Online</p>
                      <p className="font-medium text-success">{olt.onts_online}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Offline</p>
                      <p className="font-medium text-destructive">{olt.onts_offline}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Uptime</p>
                      <p className={`font-medium ${getUptimeColor(olt.uptime_percentage)}`}>
                        {olt.uptime_percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  {olt.avg_signal_strength !== 0 && (
                    <div>
                      <p className="text-muted-foreground text-sm">Força do Sinal Média</p>
                      <div className="flex items-center gap-2">
                        <Signal className="h-4 w-4" />
                        <span className="font-medium">{olt.avg_signal_strength.toFixed(1)} dBm</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Última Sincronização</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(olt.last_sync)}</span>
                    </div>
                  </div>

                  {olt.alerts_count > 0 && (
                    <Badge variant="destructive" className="w-full justify-center">
                      {olt.alerts_count} alerta(s) ativo(s)
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                  <p>Nenhum alerta ativo no momento</p>
                  <p className="text-sm">Todas as OLTs estão funcionando normalmente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.olt_name} • {formatTime(alert.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.resolved ? (
                          <Badge variant="outline">Resolvido</Badge>
                        ) : (
                          <Badge variant="secondary">Ativo</Badge>
                        )}
                      </div>
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

export default OLTDashboard;
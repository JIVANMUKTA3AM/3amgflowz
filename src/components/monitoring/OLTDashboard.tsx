import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  BarChart3,
  Router,
  Shield
} from 'lucide-react';
import { useOLTMetrics } from '@/hooks/useOLTMetrics';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const OLTDashboard = () => {
  const { oltMetrics, alerts, isLoading, refetch } = useOLTMetrics();
  const [selectedOLT, setSelectedOLT] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 rounded transform rotate-45" style={{background: 'linear-gradient(135deg, #8B5CF6, #F59E0B)'}}></div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Painel Administrativo - Gestão de Provedores
            </h2>
            <p className="text-white/80">
              Monitore clientes provedores, suas assinaturas e desempenho da plataforma
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value: '24h' | '7d' | '30d') => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <Server className="h-8 w-8 text-orange-300 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Atendimentos Hoje</p>
              <p className="text-2xl font-bold text-white">{totalOLTs}</p>
              <p className="text-xs text-green-300">+12% em relação ao período anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <Activity className="h-8 w-8 text-3amg-orange mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Tempo Médio de Resposta</p>
              <p className="text-2xl font-bold text-white">2.3min</p>
              <p className="text-xs text-green-400">-18% em relação ao período anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-3amg-orange mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Taxa de Resolução</p>
              <p className="text-2xl font-bold text-white">94.2%</p>
              <p className="text-xs text-green-400">+3% em relação ao período anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <Wifi className="h-8 w-8 text-3amg-purple mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Agentes Ativos</p>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-xs text-gray-400">100% em relação ao período anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-3amg-purple mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Satisfação do Cliente</p>
              <p className="text-2xl font-bold text-white">4.8/5</p>
              <p className="text-xs text-green-400">+0.3 em relação ao período anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Alertas Pendentes</p>
              <p className="text-2xl font-bold text-white">{totalAlerts}</p>
              <p className="text-xs text-red-400">-3 em relação ao período anterior</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <Server className="h-8 w-8 text-white mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Provedores Ativos</p>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-green-400">+2 novos provedores esta semana</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <Activity className="h-8 w-8 text-3amg-purple mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Agentes Online</p>
              <p className="text-2xl font-bold text-white">34</p>
              <p className="text-xs text-gray-400">100% disponibilidade</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Receita Mensal</p>
              <p className="text-2xl font-bold text-white">R$ 2.847</p>
              <p className="text-xs text-green-400">+15% em relação ao mês anterior</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Status Sistema</p>
              <p className="text-2xl font-bold text-white">Online</p>
              <p className="text-xs text-green-400">Todos os serviços funcionando</p>
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
            {/* Filtro de período */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Análise de Performance</h3>
              <div className="text-sm text-muted-foreground">
                Período: {timeRange === '24h' ? 'Últimas 24 horas' : timeRange === '7d' ? '7 dias' : '30 dias'}
              </div>
            </div>

            {/* Gráfico de uptime */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle>Uptime e Uso de Bandwidth por OLT</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={uptimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="uptime" 
                      stackId="1"
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6}
                      name="Uptime (%)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bandwidth" 
                      stackId="2"
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.6}
                      name="Bandwidth (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de tendência de banda */}
            <Card className="card-dark">
              <CardHeader>
                <CardTitle>Tendência de Uso de Banda</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={uptimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bandwidth" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Uso de Banda (%)"
                    />
                  </LineChart>
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
          <Card className="card-dark">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Alertas Recentes</CardTitle>
                <Badge variant={totalAlerts > 0 ? "destructive" : "outline"}>
                  {totalAlerts} ativo{totalAlerts !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success fiber-glow" />
                  <p className="text-lg font-medium">Sistema Funcionando Perfeitamente</p>
                  <p className="text-sm">Todas as OLTs estão operacionais</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${alert.severity === 'critical' ? 'border-destructive/50 bg-destructive/5' : 'border-border bg-card'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${alert.severity === 'critical' ? 'bg-destructive/10' : 'bg-warning/10'}`}>
                          <AlertTriangle className={`h-4 w-4 ${alert.severity === 'critical' ? 'text-destructive' : 'text-warning'}`} />
                        </div>
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Server className="h-3 w-3" />
                            {alert.olt_name} • {formatTime(alert.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.resolved ? (
                          <Badge variant="outline" className="text-success border-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolvido
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-destructive">
                            <Clock className="h-3 w-3 mr-1" />
                            Ativo
                          </Badge>
                        )}
                        <Button size="sm" variant="outline" className="text-xs">
                          Investigar
                        </Button>
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
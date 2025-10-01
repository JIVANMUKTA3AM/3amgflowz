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
  Radio,
  Zap,
  Thermometer,
  Battery
} from 'lucide-react';
import { useOLTMetrics } from '@/hooks/useOLTMetrics';
import { useONTMonitoring } from '@/hooks/useONTMonitoring';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Legend } from 'recharts';

const OLTDashboard = () => {
  const { oltMetrics, alerts, isLoading, refetch } = useOLTMetrics();
  const { ontData } = useONTMonitoring();
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
    { name: 'Online', value: totalOntsOnline, color: '#10B981' },
    { name: 'Offline', value: totalOntsOffline, color: '#EF4444' }
  ];

  const alertsData = oltMetrics.map(olt => ({
    name: olt.olt_name,
    alerts: olt.alerts_count
  }));

  // Dados de sinal óptico das ONTs
  const signalData = ontData
    .filter(ont => ont.optical_power_rx !== null && ont.optical_power_tx !== null)
    .map(ont => ({
      serial: ont.ont_serial.slice(-8),
      rx: ont.optical_power_rx || 0,
      tx: ont.optical_power_tx || 0,
      status: ont.status
    }));

  // Dados de temperatura e voltagem
  const healthData = ontData
    .filter(ont => ont.temperature !== null || ont.voltage !== null)
    .map(ont => ({
      serial: ont.ont_serial.slice(-8),
      temp: ont.temperature || 0,
      voltage: ont.voltage || 0,
      status: ont.status
    }));

  // Estatísticas de sinal
  const avgSignalRx = signalData.length > 0 
    ? signalData.reduce((sum, ont) => sum + ont.rx, 0) / signalData.length 
    : 0;
  const avgSignalTx = signalData.length > 0 
    ? signalData.reduce((sum, ont) => sum + ont.tx, 0) / signalData.length 
    : 0;
  const avgTemp = healthData.length > 0 
    ? healthData.reduce((sum, ont) => sum + ont.temp, 0) / healthData.length 
    : 0;

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
            <Radio className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Monitoramento de OLTs
            </h2>
            <p className="text-white/80">
              Monitoramento em tempo real de sinais ópticos, status e performance das OLTs
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm border-blue-500/20">
          <CardContent className="flex items-center p-6">
            <Server className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">OLTs Ativas</p>
              <p className="text-2xl font-bold text-white">{totalOLTs}</p>
              <p className="text-xs text-blue-300">Total de equipamentos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm border-green-500/20">
          <CardContent className="flex items-center p-6">
            <Wifi className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">ONTs Online</p>
              <p className="text-2xl font-bold text-white">{totalOntsOnline}</p>
              <p className="text-xs text-green-300">De {totalONTs} totais</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm border-purple-500/20">
          <CardContent className="flex items-center p-6">
            <Signal className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Sinal Médio RX</p>
              <p className="text-2xl font-bold text-white">{avgSignalRx.toFixed(2)} dBm</p>
              <p className="text-xs text-purple-300">Potência recebida</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-900/40 to-orange-800/20 backdrop-blur-sm border-orange-500/20">
          <CardContent className="flex items-center p-6">
            <Zap className="h-8 w-8 text-orange-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Sinal Médio TX</p>
              <p className="text-2xl font-bold text-white">{avgSignalTx.toFixed(2)} dBm</p>
              <p className="text-xs text-orange-300">Potência transmitida</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 backdrop-blur-sm border-cyan-500/20">
          <CardContent className="flex items-center p-6">
            <Activity className="h-8 w-8 text-cyan-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Uptime Médio</p>
              <p className="text-2xl font-bold text-white">{avgUptime.toFixed(1)}%</p>
              <p className="text-xs text-cyan-300">Disponibilidade</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 backdrop-blur-sm border-yellow-500/20">
          <CardContent className="flex items-center p-6">
            <AlertTriangle className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Alertas Ativos</p>
              <p className="text-2xl font-bold text-white">{totalAlerts}</p>
              <p className="text-xs text-yellow-300">{criticalAlerts} críticos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-900/40 to-pink-800/20 backdrop-blur-sm border-pink-500/20">
          <CardContent className="flex items-center p-6">
            <Thermometer className="h-8 w-8 text-pink-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">Temperatura Média</p>
              <p className="text-2xl font-bold text-white">{avgTemp.toFixed(1)}°C</p>
              <p className="text-xs text-pink-300">ONTs monitoradas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-sm border-red-500/20">
          <CardContent className="flex items-center p-6">
            <WifiOff className="h-8 w-8 text-red-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-white/80">ONTs Offline</p>
              <p className="text-2xl font-bold text-white">{totalOntsOffline}</p>
              <p className="text-xs text-red-300">Requerem atenção</p>
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
      <Tabs defaultValue="signals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="signals">Sinais Ópticos</TabsTrigger>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="olts">Detalhes OLTs</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Potência Óptica RX/TX */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Signal className="h-5 w-5 text-purple-400" />
                  Níveis de Sinal Óptico (RX/TX)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {signalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={signalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="serial" 
                        stroke="rgba(255,255,255,0.6)"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="rgba(255,255,255,0.6)" label={{ value: 'dBm', angle: -90, position: 'insideLeft' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="rx" fill="#8B5CF6" name="RX (Recebido)" />
                      <Bar dataKey="tx" fill="#F59E0B" name="TX (Transmitido)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    <p>Nenhum dado de sinal disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico de Temperatura e Voltagem */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Thermometer className="h-5 w-5 text-pink-400" />
                  Saúde dos Equipamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {healthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="serial" 
                        stroke="rgba(255,255,255,0.6)"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        yAxisId="temp"
                        stroke="rgba(255,255,255,0.6)"
                        label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="voltage"
                        orientation="right"
                        stroke="rgba(255,255,255,0.6)"
                        label={{ value: 'V', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid rgba(236, 72, 153, 0.3)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="temp"
                        type="monotone" 
                        dataKey="temp" 
                        stroke="#EC4899" 
                        strokeWidth={2}
                        name="Temperatura (°C)"
                        dot={{ fill: '#EC4899', r: 4 }}
                      />
                      <Line 
                        yAxisId="voltage"
                        type="monotone" 
                        dataKey="voltage" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Voltagem (V)"
                        dot={{ fill: '#10B981', r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    <p>Nenhum dado de saúde disponível</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabela detalhada de ONTs */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Radio className="h-5 w-5 text-cyan-400" />
                Monitoramento Detalhado de ONTs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3 text-gray-300">Serial</th>
                      <th className="text-left p-3 text-gray-300">Status</th>
                      <th className="text-right p-3 text-gray-300">RX (dBm)</th>
                      <th className="text-right p-3 text-gray-300">TX (dBm)</th>
                      <th className="text-right p-3 text-gray-300">Temp (°C)</th>
                      <th className="text-right p-3 text-gray-300">Voltagem (V)</th>
                      <th className="text-left p-3 text-gray-300">Última Atualização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ontData.slice(0, 10).map((ont) => (
                      <tr key={ont.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-3 text-white font-mono text-sm">{ont.ont_serial}</td>
                        <td className="p-3">
                          <Badge variant={ont.status === 'online' ? 'default' : 'destructive'}>
                            {ont.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right text-purple-400 font-semibold">
                          {ont.optical_power_rx?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="p-3 text-right text-orange-400 font-semibold">
                          {ont.optical_power_tx?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="p-3 text-right text-pink-400">
                          {ont.temperature?.toFixed(1) || 'N/A'}
                        </td>
                        <td className="p-3 text-right text-green-400">
                          {ont.voltage?.toFixed(2) || 'N/A'}
                        </td>
                        <td className="p-3 text-gray-400 text-sm">
                          {ont.last_seen ? formatTime(ont.last_seen) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {ontData.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhuma ONT monitorada no momento
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de status das ONTs */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Status das ONTs</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ontsStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ontsStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        border: '1px solid rgba(75, 85, 99, 0.3)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {ontsStatusData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-white">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertas por OLT */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Alertas por OLT</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={alertsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="alerts" fill="#EF4444" />
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
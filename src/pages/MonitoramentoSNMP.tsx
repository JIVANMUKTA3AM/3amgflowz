import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Router, 
  Activity, 
  Globe, 
  Monitor, 
  Server, 
  RefreshCw,
  NetworkIcon,
  Wifi,
  Settings2
} from 'lucide-react';
import { useWorkflow } from '@/hooks/useWorkflow';
import { useSNMPData } from '@/hooks/useSNMPData';
import { useONTMonitoring } from '@/hooks/useONTMonitoring';
import { useOltConfigurations } from '@/hooks/useOltConfigurations';
import { useOltProtocolDetector } from '@/hooks/useOltProtocolDetector';
import SNMPConsole from '@/components/snmp/SNMPConsole';
import HTTPConsole from '@/components/snmp/HTTPConsole';
import ONTMonitoringPanel from '@/components/snmp/ONTMonitoringPanel';

const MonitoramentoSNMP = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();
  const { configurations } = useOltConfigurations();
  const { snmpData, snmpLogs, isLoading, refetch } = useSNMPData();
  const { ontData } = useONTMonitoring();
  const { protocolMatrix } = useOltProtocolDetector();

  // Calcular métricas
  const totalOlts = configurations.length;
  const activeOlts = configurations.filter(config => config.is_active).length;
  const totalOnts = ontData.length;
  const onlineOnts = ontData.filter(ont => ont.status === 'online').length;
  const offlineOnts = ontData.filter(ont => ont.status === 'offline').length;
  
  // Contar protocolos suportados
  const snmpOlts = Object.values(protocolMatrix).flatMap(brand => 
    Object.values(brand).filter(config => config.capabilities.snmp)
  ).length;
  
  const httpOlts = Object.values(protocolMatrix).flatMap(brand => 
    Object.values(brand).filter(config => config.capabilities.http)
  ).length;

  const recentOperations = snmpLogs.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header da página */}
          <div className="text-center mb-8">
            <Router className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Monitoramento SNMP
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Monitore e gerencie suas OLTs e ONTs através de protocolos SNMP e HTTP. 
              Execute comandos, visualize métricas e monitore o status em tempo real.
            </p>
          </div>

          {/* Métricas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <Server className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">OLTs Totais</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOlts}</p>
                  <p className="text-xs text-green-600">{activeOlts} ativas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <Wifi className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">ONTs Online</p>
                  <p className="text-2xl font-bold text-gray-900">{onlineOnts}</p>
                  <p className="text-xs text-gray-500">de {totalOnts} total</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <NetworkIcon className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">ONTs Offline</p>
                  <p className="text-2xl font-bold text-gray-900">{offlineOnts}</p>
                  <p className="text-xs text-red-600">Requer atenção</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <Activity className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Operações SNMP</p>
                  <p className="text-2xl font-bold text-gray-900">{snmpLogs.length}</p>
                  <p className="text-xs text-blue-600">Últimas 24h</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operações Recentes */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Operações SNMP Recentes
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOperations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma operação SNMP registrada ainda</p>
                  <p className="text-sm">Execute comandos nas abas abaixo para ver o histórico</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOperations.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusColor(log.status)}>
                          {log.status.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{log.operation_type}</span>
                        {log.oid && (
                          <span className="text-sm text-gray-600 font-mono">{log.oid}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(log.created_at)}
                        {log.execution_time_ms && (
                          <span className="ml-2">({log.execution_time_ms}ms)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs principais */}
          <Tabs defaultValue="console" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="console" className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Console
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Monitoramento
              </TabsTrigger>
              <TabsTrigger value="protocols" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Protocolos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="console" className="space-y-6">
              <Tabs defaultValue="snmp" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="snmp">Console SNMP</TabsTrigger>
                  <TabsTrigger value="http">Console HTTP</TabsTrigger>
                </TabsList>
                
                <TabsContent value="snmp">
                  <SNMPConsole />
                </TabsContent>
                
                <TabsContent value="http">
                  <HTTPConsole />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="monitoring">
              <ONTMonitoringPanel />
            </TabsContent>

            <TabsContent value="protocols">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Suporte a Protocolos por Marca</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(protocolMatrix).map(([brand, models]) => (
                        <div key={brand} className="border-l-4 border-blue-200 pl-4">
                          <h3 className="font-semibold text-lg capitalize mb-3">{brand}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(models).map(([model, config]) => (
                              <div key={model} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{model}</h4>
                                  <Badge variant="outline">
                                    {config.protocol.toUpperCase()}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  {config.capabilities.snmp && (
                                    <Badge variant="secondary" className="text-xs">SNMP</Badge>
                                  )}
                                  {config.capabilities.http && (
                                    <Badge variant="secondary" className="text-xs">HTTP</Badge>
                                  )}
                                </div>
                                {config.capabilities.apiEndpoints && (
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-600">API Endpoints:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {config.capabilities.apiEndpoints.map((endpoint, idx) => (
                                        <code key={idx} className="text-xs bg-white px-2 py-1 rounded">
                                          {endpoint}
                                        </code>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Protocolos Suportados</CardTitle>
                  </CardHeader>
                  <CardContent className="text-blue-800 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">SNMP (Simple Network Management Protocol)</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Protocolo padrão para monitoramento de rede</li>
                          <li>• Suporte a SNMP v1, v2c e v3</li>
                          <li>• Ideal para equipamentos legados</li>
                          <li>• Operações: GET, WALK, SET</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">HTTP/REST API</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Interface moderna baseada em REST</li>
                          <li>• Suporte a JSON para troca de dados</li>
                          <li>• Maior flexibilidade e recursos</li>
                          <li>• Operações: GET, POST, PUT, DELETE</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MonitoramentoSNMP;
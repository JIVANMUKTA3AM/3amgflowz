
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Terminal, Router, Activity, Database, Globe } from 'lucide-react';
import SNMPConsole from '@/components/snmp/SNMPConsole';
import HTTPConsole from '@/components/snmp/HTTPConsole';
import ONTMonitoringPanel from '@/components/snmp/ONTMonitoringPanel';
import { useSNMPData } from '@/hooks/useSNMPData';
import { useONTMonitoring } from '@/hooks/useONTMonitoring';
import { useOltProtocolDetector } from '@/hooks/useOltProtocolDetector';

const TecnicoSNMPDashboard = () => {
  const { snmpData, snmpLogs } = useSNMPData();
  const { ontData } = useONTMonitoring();
  const { protocolMatrix } = useOltProtocolDetector();
  const [selectedProtocol, setSelectedProtocol] = useState<'snmp' | 'http'>('snmp');

  // Estatísticas básicas
  const totalONTs = ontData.length;
  const onlineONTs = ontData.filter(ont => ont.status === 'online').length;
  const offlineONTs = ontData.filter(ont => ont.status === 'offline').length;
  const recentOperations = snmpLogs.slice(0, 5);

  // Contar OLTs por protocolo
  const snmpOlts = Object.values(protocolMatrix).flatMap(brand => 
    Object.values(brand).filter(config => config.capabilities.snmp)
  ).length;
  
  const httpOlts = Object.values(protocolMatrix).flatMap(brand => 
    Object.values(brand).filter(config => config.capabilities.http)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Terminal className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operações Técnicas</h1>
          <p className="text-gray-600">Console SNMP e HTTP para gerenciamento de equipamentos</p>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total ONTs</p>
                <p className="text-2xl font-bold">{totalONTs}</p>
              </div>
              <Router className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ONTs Online</p>
                <p className="text-2xl font-bold text-green-600">{onlineONTs}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ONTs Offline</p>
                <p className="text-2xl font-bold text-red-600">{offlineONTs}</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">OLTs SNMP</p>
                <p className="text-2xl font-bold text-purple-600">{snmpOlts}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">OLTs HTTP</p>
                <p className="text-2xl font-bold text-orange-600">{httpOlts}</p>
              </div>
              <Globe className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operações recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Operações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOperations.length > 0 ? (
            <div className="space-y-2">
              {recentOperations.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}
                    >
                      {log.operation_type.toUpperCase()}
                    </Badge>
                    {log.oid && (
                      <span className="font-mono text-sm text-gray-600">{log.oid}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma operação realizada ainda
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs defaultValue="console" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="console">Console Técnico</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento ONTs</TabsTrigger>
          <TabsTrigger value="protocols">Protocolos Suportados</TabsTrigger>
        </TabsList>

        <TabsContent value="console">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Console de Comandos</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={selectedProtocol === 'snmp' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedProtocol('snmp')}
                  >
                    SNMP
                  </Badge>
                  <Badge 
                    variant={selectedProtocol === 'http' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedProtocol('http')}
                  >
                    HTTP
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedProtocol === 'snmp' ? <SNMPConsole /> : <HTTPConsole />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <ONTMonitoringPanel />
        </TabsContent>

        <TabsContent value="protocols">
          <Card>
            <CardHeader>
              <CardTitle>Protocolos Suportados por Modelo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(protocolMatrix).map(([brand, models]) => (
                  <div key={brand} className="space-y-3">
                    <h3 className="text-lg font-semibold capitalize">{brand}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(models).map(([model, config]) => (
                        <div key={model} className="border rounded-lg p-3">
                          <div className="font-medium mb-2">{model}</div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={config.capabilities.snmp ? 'default' : 'secondary'}>
                              SNMP: {config.capabilities.snmp ? 'Sim' : 'Não'}
                            </Badge>
                            <Badge variant={config.capabilities.http ? 'default' : 'secondary'}>
                              HTTP: {config.capabilities.http ? 'Sim' : 'Não'}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Protocolo: <span className="font-mono">{config.protocol}</span>
                          </div>
                          {config.capabilities.apiEndpoints && config.capabilities.apiEndpoints.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              APIs: {config.capabilities.apiEndpoints.join(', ')}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TecnicoSNMPDashboard;

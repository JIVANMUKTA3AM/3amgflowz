
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Terminal, Router, Activity, Database, Globe, FileText } from 'lucide-react';
import SNMPConsole from '@/components/snmp/SNMPConsole';
import HTTPConsole from '@/components/snmp/HTTPConsole';
import ONTMonitoringPanel from '@/components/snmp/ONTMonitoringPanel';
import SNMPOperationsTable from '@/components/monitoring/SNMPOperationsTable';
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
        <div className="w-12 h-12 rounded-lg gradient-header flex items-center justify-center">
          <Terminal className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Sistema de Monitoramento SNMP
            <div className="w-6 h-6 bg-3amg-purple rounded transform rotate-45 opacity-20"></div>
          </h1>
          <p className="text-muted-foreground">Console técnico e monitoramento de equipamentos de rede</p>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="gradient-card card-dark hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total ONTs</p>
                <p className="text-2xl font-bold text-foreground">{totalONTs}</p>
                <p className="text-xs text-muted-foreground">Equipamentos</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10 icon-tech">
                <Router className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card card-dark hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ONTs Online</p>
                <p className="text-2xl font-bold text-success">{onlineONTs}</p>
                <p className="text-xs text-muted-foreground">Conectadas</p>
              </div>
              <div className="p-2 rounded-lg bg-success/10 icon-tech">
                <Activity className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card card-dark hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ONTs Offline</p>
                <p className="text-2xl font-bold text-destructive">{offlineONTs}</p>
                <p className="text-xs text-muted-foreground">Desconectadas</p>
              </div>
              <div className="p-2 rounded-lg bg-destructive/10 icon-tech">
                <Activity className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card card-dark hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">OLTs SNMP</p>
                <p className="text-2xl font-bold text-3amg-purple">{snmpOlts}</p>
                <p className="text-xs text-muted-foreground">Protocolo SNMP</p>
              </div>
              <div className="p-2 rounded-lg bg-3amg-purple/10 icon-tech">
                <Database className="h-6 w-6 text-3amg-purple" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card card-dark hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">OLTs HTTP</p>
                <p className="text-2xl font-bold text-3amg-orange">{httpOlts}</p>
                <p className="text-xs text-muted-foreground">API REST</p>
              </div>
              <div className="p-2 rounded-lg bg-3amg-orange/10 icon-tech">
                <Globe className="h-6 w-6 text-3amg-orange" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card card-dark hover:shadow-lg transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Operações SNMP</p>
                <p className="text-2xl font-bold text-3amg-pink">{recentOperations.length}</p>
                <p className="text-xs text-muted-foreground">Últimas 24h</p>
              </div>
              <div className="p-2 rounded-lg bg-3amg-pink/10 icon-tech">
                <Terminal className="h-6 w-6 text-3amg-pink" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operações recentes */}
      <Card className="card-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-3amg-purple" />
            Operações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOperations.length > 0 ? (
            <div className="space-y-3">
              {recentOperations.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}
                      className="font-mono"
                    >
                      {log.operation_type.toUpperCase()}
                    </Badge>
                    {log.oid && (
                      <span className="font-mono text-sm text-muted-foreground bg-background/50 px-2 py-1 rounded">
                        {log.oid.length > 30 ? `${log.oid.substring(0, 30)}...` : log.oid}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma operação realizada ainda</p>
              <p className="text-sm">Execute comandos SNMP para ver o histórico</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs defaultValue="console" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gradient-header p-1 rounded-lg">
          <TabsTrigger value="console" className="text-white data-[state=active]:text-foreground">Console</TabsTrigger>
          <TabsTrigger value="monitoring" className="text-white data-[state=active]:text-foreground">Monitoramento</TabsTrigger>
          <TabsTrigger value="logs" className="text-white data-[state=active]:text-foreground">Logs Detalhados</TabsTrigger>
          <TabsTrigger value="protocols" className="text-white data-[state=active]:text-foreground">Protocolos</TabsTrigger>
        </TabsList>

        <TabsContent value="console">
          <Card className="card-dark">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-3amg-purple" />
                  Console de Comandos
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={selectedProtocol === 'snmp' ? 'default' : 'outline'}
                    className="cursor-pointer gradient-header text-white border-0 hover:opacity-80"
                    onClick={() => setSelectedProtocol('snmp')}
                  >
                    SNMP
                  </Badge>
                  <Badge 
                    variant={selectedProtocol === 'http' ? 'default' : 'outline'}
                    className="cursor-pointer gradient-header text-white border-0 hover:opacity-80"
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

        <TabsContent value="logs">
          <SNMPOperationsTable />
        </TabsContent>

        <TabsContent value="protocols">
          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-3amg-purple" />
                Protocolos Suportados por Modelo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(protocolMatrix).map(([brand, models]) => (
                  <div key={brand} className="space-y-4">
                    <h3 className="text-lg font-semibold capitalize text-3amg-purple flex items-center gap-2">
                      <Router className="h-5 w-5" />
                      {brand.toUpperCase()}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(models).map(([model, config]) => (
                        <div key={model} className="border border-border rounded-lg p-4 gradient-card hover:shadow-lg transition-all">
                          <div className="font-medium mb-3 text-foreground">{model}</div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge 
                              variant={config.capabilities.snmp ? 'default' : 'secondary'}
                              className={config.capabilities.snmp ? 'bg-3amg-purple text-white' : ''}
                            >
                              SNMP: {config.capabilities.snmp ? 'Sim' : 'Não'}
                            </Badge>
                            <Badge 
                              variant={config.capabilities.http ? 'default' : 'secondary'}
                              className={config.capabilities.http ? 'bg-3amg-orange text-white' : ''}
                            >
                              HTTP: {config.capabilities.http ? 'Sim' : 'Não'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Protocolo: <span className="font-mono text-foreground">{config.protocol}</span>
                          </div>
                          {config.capabilities.apiEndpoints && config.capabilities.apiEndpoints.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              <strong>APIs disponíveis:</strong> {config.capabilities.apiEndpoints.join(', ')}
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

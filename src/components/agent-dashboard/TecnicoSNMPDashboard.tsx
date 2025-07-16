
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Terminal, Router, Activity, Database } from 'lucide-react';
import SNMPConsole from '@/components/snmp/SNMPConsole';
import ONTMonitoringPanel from '@/components/snmp/ONTMonitoringPanel';
import { useSNMPData } from '@/hooks/useSNMPData';
import { useONTMonitoring } from '@/hooks/useONTMonitoring';

const TecnicoSNMPDashboard = () => {
  const { snmpData, snmpLogs } = useSNMPData();
  const { ontData } = useONTMonitoring();

  // Estatísticas básicas
  const totalONTs = ontData.length;
  const onlineONTs = ontData.filter(ont => ont.status === 'online').length;
  const offlineONTs = ontData.filter(ont => ont.status === 'offline').length;
  const recentOperations = snmpLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Terminal className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operações SNMP</h1>
          <p className="text-gray-600">Console e monitoramento de equipamentos via SNMP</p>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm text-gray-600">Dados Coletados</p>
                <p className="text-2xl font-bold">{snmpData.length}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
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
              Nenhuma operação SNMP realizada ainda
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs defaultValue="console" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="console">Console SNMP</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento ONTs</TabsTrigger>
        </TabsList>

        <TabsContent value="console">
          <SNMPConsole />
        </TabsContent>

        <TabsContent value="monitoring">
          <ONTMonitoringPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TecnicoSNMPDashboard;

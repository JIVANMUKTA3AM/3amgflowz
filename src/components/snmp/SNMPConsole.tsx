
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, Play, History, Database } from 'lucide-react';
import { useSNMPOperations } from '@/hooks/useSNMPOperations';
import { useSNMPData } from '@/hooks/useSNMPData';
import { useOltConfigurations } from '@/hooks/useOltConfigurations';

const SNMPConsole = () => {
  const { configurations } = useOltConfigurations();
  const { executeSNMP, isLoading, results } = useSNMPOperations();
  const [selectedOLT, setSelectedOLT] = useState('');
  const [operation, setOperation] = useState<'get' | 'walk' | 'set'>('get');
  const [oid, setOid] = useState('');
  const [value, setValue] = useState('');
  const [community, setCommunity] = useState('public');

  const { snmpData, snmpLogs, refetch } = useSNMPData(selectedOLT || undefined);

  const handleExecute = async () => {
    if (!selectedOLT || !oid) {
      return;
    }

    await executeSNMP({
      oltConfigId: selectedOLT,
      operation,
      oid,
      value: operation === 'set' ? value : undefined,
      community
    });

    // Refresh data after execution
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  const commonOIDs = [
    { label: 'System Description', oid: '1.3.6.1.2.1.1.1.0' },
    { label: 'System Uptime', oid: '1.3.6.1.2.1.1.3.0' },
    { label: 'Interface Table', oid: '1.3.6.1.2.1.2.2.1' },
    { label: 'Interface Status', oid: '1.3.6.1.2.1.2.2.1.8' },
    { label: 'Interface Speed', oid: '1.3.6.1.2.1.2.2.1.5' },
    { label: 'Interface In Octets', oid: '1.3.6.1.2.1.2.2.1.10' },
    { label: 'Interface Out Octets', oid: '1.3.6.1.2.1.2.2.1.16' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Console SNMP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="olt-select">Selecionar OLT</Label>
              <Select value={selectedOLT} onValueChange={setSelectedOLT}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma OLT" />
                </SelectTrigger>
                <SelectContent>
                  {configurations.map((olt) => (
                    <SelectItem key={olt.id} value={olt.id!}>
                      {olt.name} ({olt.ip_address})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="operation">Operação</Label>
              <Select value={operation} onValueChange={(value: 'get' | 'walk' | 'set') => setOperation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="get">GET</SelectItem>
                  <SelectItem value="walk">WALK</SelectItem>
                  <SelectItem value="set">SET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="oid">OID</Label>
              <Input
                id="oid"
                value={oid}
                onChange={(e) => setOid(e.target.value)}
                placeholder="1.3.6.1.2.1.1.1.0"
              />
            </div>

            <div>
              <Label htmlFor="community">Community</Label>
              <Input
                id="community"
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                placeholder="public"
              />
            </div>
          </div>

          {operation === 'set' && (
            <div>
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Valor para SET"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={handleExecute} disabled={isLoading || !selectedOLT || !oid}>
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Executando...' : 'Executar'}
            </Button>
          </div>

          {/* OIDs Comuns */}
          <div>
            <Label>OIDs Comuns</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonOIDs.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setOid(item.oid)}
                  className="text-xs"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Resultados */}
          {results.length > 0 && (
            <div>
              <Label>Resultado</Label>
              <Textarea
                value={JSON.stringify(results, null, 2)}
                readOnly
                className="font-mono text-sm"
                rows={6}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="data" className="w-full">
        <TabsList>
          <TabsTrigger value="data">Dados SNMP</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Dados Coletados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {snmpData.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="font-mono text-sm">{item.oid}</div>
                        <div className="text-lg">{item.value}</div>
                        {item.description && (
                          <div className="text-sm text-gray-600">{item.description}</div>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <Badge variant="outline">{item.data_type}</Badge>
                        <div className="mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {snmpData.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum dado SNMP encontrado. Execute alguns comandos para ver os resultados aqui.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Operações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {snmpLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={log.status === 'success' ? 'default' : log.status === 'error' ? 'destructive' : 'secondary'}
                          >
                            {log.operation_type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{log.status}</Badge>
                        </div>
                        {log.oid && (
                          <div className="font-mono text-sm">{log.oid}</div>
                        )}
                        {log.error_message && (
                          <div className="text-red-600 text-sm">{log.error_message}</div>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {log.execution_time_ms && (
                          <div>{log.execution_time_ms}ms</div>
                        )}
                        <div>{new Date(log.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {snmpLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum log encontrado.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SNMPConsole;


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Globe, Play, Code, Settings } from 'lucide-react';
import { useHTTPOperations } from '@/hooks/useHTTPOperations';
import { useOltConfigurations } from '@/hooks/useOltConfigurations';
import { useOltProtocolDetector } from '@/hooks/useOltProtocolDetector';

const HTTPConsole = () => {
  const { configurations } = useOltConfigurations();
  const { executeHTTP, isLoading, results } = useHTTPOperations();
  const { getSupportedOperations } = useOltProtocolDetector();
  
  const [selectedOLT, setSelectedOLT] = useState('');
  const [operation, setOperation] = useState<'get' | 'post' | 'put' | 'delete'>('get');
  const [endpoint, setEndpoint] = useState('');
  const [requestData, setRequestData] = useState('');
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');

  const handleExecute = async () => {
    if (!selectedOLT || !endpoint) {
      return;
    }

    let parsedData = undefined;
    let parsedHeaders = {};

    try {
      if (requestData.trim()) {
        parsedData = JSON.parse(requestData);
      }
      parsedHeaders = JSON.parse(headers);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return;
    }

    await executeHTTP({
      oltConfigId: selectedOLT,
      operation,
      endpoint,
      data: parsedData,
      headers: parsedHeaders
    });
  };

  const httpOnlyOlts = configurations.filter(config => {
    const support = getSupportedOperations(config.id!);
    return support.httpOperations;
  });

  const commonEndpoints = [
    { label: 'Status Geral', endpoint: '/api/status' },
    { label: 'Lista de ONTs', endpoint: '/api/onts' },
    { label: 'Configurações', endpoint: '/api/config' },
    { label: 'Estatísticas', endpoint: '/api/stats' },
    { label: 'Logs do Sistema', endpoint: '/api/logs' },
    { label: 'Reset ONT', endpoint: '/api/ont/reset' },
    { label: 'Ativar ONT', endpoint: '/api/ont/activate' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Console HTTP/API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="olt-select">Selecionar OLT (com suporte HTTP)</Label>
              <Select value={selectedOLT} onValueChange={setSelectedOLT}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma OLT" />
                </SelectTrigger>
                <SelectContent>
                  {httpOnlyOlts.map((olt) => {
                    const support = getSupportedOperations(olt.id!);
                    return (
                      <SelectItem key={olt.id} value={olt.id!}>
                        {olt.name} ({olt.ip_address}) - {support.protocol.toUpperCase()}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="operation">Método HTTP</Label>
              <Select value={operation} onValueChange={(value: 'get' | 'post' | 'put' | 'delete') => setOperation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="get">GET</SelectItem>
                  <SelectItem value="post">POST</SelectItem>
                  <SelectItem value="put">PUT</SelectItem>
                  <SelectItem value="delete">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="endpoint">Endpoint/URL</Label>
            <Input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/status"
            />
          </div>

          {/* Endpoints Comuns */}
          <div>
            <Label>Endpoints Comuns</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonEndpoints.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setEndpoint(item.endpoint)}
                  className="text-xs"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="headers">Headers (JSON)</Label>
            <Textarea
              id="headers"
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
              rows={3}
            />
          </div>

          {(operation === 'post' || operation === 'put') && (
            <div>
              <Label htmlFor="data">Dados da Requisição (JSON)</Label>
              <Textarea
                id="data"
                value={requestData}
                onChange={(e) => setRequestData(e.target.value)}
                placeholder='{"key": "value"}'
                rows={4}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={handleExecute} disabled={isLoading || !selectedOLT || !endpoint}>
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Executando...' : 'Executar'}
            </Button>
          </div>

          {/* Resultados */}
          {results && (
            <div>
              <Label>Resposta da API</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={results.status >= 200 && results.status < 300 ? 'default' : 'destructive'}>
                    Status: {results.status}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm">Headers de Resposta:</Label>
                  <Textarea
                    value={JSON.stringify(results.headers, null, 2)}
                    readOnly
                    className="font-mono text-sm"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm">Dados de Resposta:</Label>
                  <Textarea
                    value={JSON.stringify(results.data, null, 2)}
                    readOnly
                    className="font-mono text-sm"
                    rows={8}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre HTTP vs SNMP */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações sobre Protocolos
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>• <strong>HTTP/API</strong>: Ideal para OLTs modernas com interface REST (Huawei, ZTE, Parks)</p>
          <p>• <strong>SNMP</strong>: Protocolo padrão para equipamentos legados (VSOL, Fiberhome, Datacom)</p>
          <p>• <strong>Híbrido</strong>: Alguns modelos suportam ambos os protocolos</p>
          <p>• O sistema detecta automaticamente o protocolo baseado na marca/modelo configurado</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HTTPConsole;


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Terminal, Play, Trash2 } from "lucide-react";
import { useSNMPOperations } from '@/hooks/useSNMPOperations';
import { useOltConfigurations } from '@/hooks/useOltConfigurations';

const SNMPConsole = () => {
  const [selectedOlt, setSelectedOlt] = useState('');
  const [operation, setOperation] = useState('get');
  const [oid, setOid] = useState('');
  const [value, setValue] = useState('');
  const [results, setResults] = useState<string>('');

  const { configurations } = useOltConfigurations();
  const { executeSNMP, isLoading } = useSNMPOperations();

  const handleExecute = async () => {
    if (!selectedOlt || !oid) return;

    const result = await executeSNMP({
      oltConfigId: selectedOlt,
      operation: operation as 'get' | 'set' | 'walk',
      oid,
      value: operation === 'set' ? value : undefined,
    });

    if (result) {
      setResults(prev => `${prev}\n[${new Date().toLocaleTimeString()}] ${operation.toUpperCase()} ${oid}: ${JSON.stringify(result, null, 2)}`);
    }
  };

  const clearResults = () => setResults('');

  const commonOids = [
    { label: 'System Description', value: '1.3.6.1.2.1.1.1.0' },
    { label: 'System Uptime', value: '1.3.6.1.2.1.1.3.0' },
    { label: 'System Name', value: '1.3.6.1.2.1.1.5.0' },
    { label: 'Interface Table', value: '1.3.6.1.2.1.2.2.1' },
    { label: 'ONT Status', value: '1.3.6.1.4.1.2011.6.128.1.1.2.43.1.9' },
    { label: 'PON Port Status', value: '1.3.6.1.4.1.2011.6.128.1.1.2.21.1.10' },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Terminal className="h-5 w-5" />
            Console SNMP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="olt-select" className="text-white">Selecionar OLT</Label>
              <Select value={selectedOlt} onValueChange={setSelectedOlt}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma OLT" />
                </SelectTrigger>
                <SelectContent>
                  {configurations.map((config) => (
                    <SelectItem key={config.id} value={config.id!}>
                      {config.name} ({config.brand} {config.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="operation" className="text-white">Operação</Label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="get">GET</SelectItem>
                  <SelectItem value="set">SET</SelectItem>
                  <SelectItem value="walk">WALK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="oid" className="text-white">OID</Label>
            <Input
              id="oid"
              value={oid}
              onChange={(e) => setOid(e.target.value)}
              placeholder="1.3.6.1.2.1.1.1.0"
            />
          </div>

          {operation === 'set' && (
            <div>
              <Label htmlFor="value" className="text-white">Valor</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Valor para SET"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleExecute} disabled={isLoading || !selectedOlt || !oid} className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Executar
            </Button>
            <Button variant="outline" onClick={clearResults} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Trash2 className="h-4 w-4" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">OIDs Comuns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {commonOids.map((oidItem) => (
              <Badge
                key={oidItem.value}
                variant="outline"
                className="cursor-pointer hover:bg-white/20 justify-start border-white/30 text-white"
                onClick={() => setOid(oidItem.value)}
              >
                {oidItem.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={results}
            readOnly
            className="font-mono text-sm min-h-64 bg-black/20 border-white/20 text-white placeholder:text-white/50"
            placeholder="Os resultados dos comandos SNMP aparecerão aqui..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SNMPConsole;

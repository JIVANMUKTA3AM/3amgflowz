import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Filter, Search, Clock, Terminal, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSNMPData } from '@/hooks/useSNMPData';
import { useOltConfigurations } from '@/hooks/useOltConfigurations';

const SNMPOperationsTable = () => {
  const { snmpLogs, isLoading } = useSNMPData();
  const { configurations } = useOltConfigurations();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [oltFilter, setOltFilter] = useState('all');

  const filteredLogs = snmpLogs.filter(log => {
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesSearch = !searchTerm || 
      log.oid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.operation_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOlt = oltFilter === 'all' || log.olt_configuration_id === oltFilter;
    
    return matchesStatus && matchesSearch && matchesOlt;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const exportToCSV = () => {
    const csvData = filteredLogs.map(log => ({
      Data: new Date(log.created_at).toLocaleString('pt-BR'),
      Operacao: log.operation_type.toUpperCase(),
      OID: log.oid || 'N/A',
      Status: log.status,
      Tempo: log.execution_time_ms ? `${log.execution_time_ms}ms` : 'N/A',
      Erro: log.error_message || 'N/A'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snmp-operations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg gradient-header flex items-center justify-center">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Logs Detalhados SNMP
              <div className="w-6 h-6 bg-3amg-purple rounded transform rotate-45 opacity-20"></div>
            </h1>
            <p className="text-muted-foreground">Histórico completo de operações SNMP</p>
          </div>
        </div>
        <Button onClick={exportToCSV} className="gradient-header text-white">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card className="card-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="OID ou operação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">OLT</label>
              <Select value={oltFilter} onValueChange={setOltFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {configurations.map((config) => (
                    <SelectItem key={config.id} value={config.id!}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setOltFilter('all');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de operações */}
      <Card className="card-dark">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Operações Recentes</CardTitle>
            <Badge variant="outline">{filteredLogs.length} registros</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Operação</TableHead>
                  <TableHead>OID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando operações...
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma operação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => {
                    const oltConfig = configurations.find(c => c.id === log.olt_configuration_id);
                    return (
                      <TableRow key={log.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {log.operation_type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm max-w-48 truncate">
                          {log.oid || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <Badge variant={getStatusColor(log.status)}>
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.execution_time_ms ? `${log.execution_time_ms}ms` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {oltConfig?.name || 'N/A'}
                        </TableCell>
                        <TableCell className="max-w-64">
                          {log.error_message ? (
                            <span className="text-destructive text-sm truncate block">
                              {log.error_message}
                            </span>
                          ) : log.response_data ? (
                            <span className="text-success text-sm">
                              Dados retornados
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Sem dados
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SNMPOperationsTable;
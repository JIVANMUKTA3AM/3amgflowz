
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Activity, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const IntegrationsLogs = () => {
  const { integrationLogs, integrations } = useIntegrations();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterIntegration, setFilterIntegration] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'trigger':
        return <Zap className="w-4 h-4 text-blue-500" />;
      case 'sync':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventBadge = (eventType: string) => {
    const variants = {
      trigger: "outline",
      sync: "secondary",
      error: "destructive",
      success: "default"
    } as const;
    
    const labels = {
      trigger: "Disparo",
      sync: "Sincronização",
      error: "Erro",
      success: "Sucesso"
    };
    
    return (
      <Badge variant={variants[eventType as keyof typeof variants] || "outline"}>
        {labels[eventType as keyof typeof labels] || eventType}
      </Badge>
    );
  };

  const getStatusCodeBadge = (statusCode?: number) => {
    if (!statusCode) return null;
    
    let variant: "default" | "secondary" | "destructive" = "secondary";
    if (statusCode >= 200 && statusCode < 300) variant = "default";
    else if (statusCode >= 400) variant = "destructive";
    
    return (
      <Badge variant={variant} className="text-xs">
        {statusCode}
      </Badge>
    );
  };

  const getIntegrationName = (integrationId: string) => {
    const integration = integrations?.find(i => i.id === integrationId);
    return integration?.name || 'Integração desconhecida';
  };

  const filteredLogs = integrationLogs?.filter(log => {
    const matchesType = filterType === 'all' || log.event_type === filterType;
    const matchesIntegration = filterIntegration === 'all' || log.integration_id === filterIntegration;
    const matchesSearch = searchTerm === '' || 
      getIntegrationName(log.integration_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.error_message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesIntegration && matchesSearch;
  }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Logs de Integrações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Evento</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="trigger">Disparo</SelectItem>
                <SelectItem value="sync">Sincronização</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Integração</label>
            <Select value={filterIntegration} onValueChange={setFilterIntegration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as integrações</SelectItem>
                {integrations?.map((integration) => (
                  <SelectItem key={integration.id} value={integration.id}>
                    {integration.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar</label>
            <Input
              placeholder="Buscar nos logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Logs */}
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum log encontrado</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <Collapsible key={log.id}>
                  <CollapsibleTrigger
                    className="w-full"
                    onClick={() => toggleLogExpansion(log.id)}
                  >
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        {expandedLogs.has(log.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        {getEventIcon(log.event_type)}
                        <div className="text-left">
                          <div className="font-medium text-sm">
                            {getIntegrationName(log.integration_id)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(log.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusCodeBadge(log.status_code)}
                        {getEventBadge(log.event_type)}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 ml-4 border-l-2 border-gray-200 space-y-3">
                      {log.error_message && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <div className="text-sm font-medium text-red-800 mb-1">Erro</div>
                          <div className="text-sm text-red-700">{log.error_message}</div>
                        </div>
                      )}
                      
                      {log.request_data && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Dados da Requisição</div>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.request_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {log.response_data && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Dados da Resposta</div>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.response_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default IntegrationsLogs;

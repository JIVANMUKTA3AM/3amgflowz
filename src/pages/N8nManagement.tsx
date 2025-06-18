
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useN8nIntegrations } from "@/hooks/useN8nIntegrations";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, Plus, Play, Settings, ExternalLink, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";

const N8nManagement = () => {
  const { user } = useAuth();
  const { integrations, executionLogs, loadingIntegrations, loadingLogs, createIntegration, executeIntegration } = useN8nIntegrations();
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isExecuteDialogOpen, setIsExecuteDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [executionPayload, setExecutionPayload] = useState('{}');

  const [newIntegration, setNewIntegration] = useState({
    nome: '',
    descricao: '',
    webhook_url: '',
    evento_associado: '',
    tipo_execucao: 'automatico' as const,
    is_active: true,
  });

  const handleCreateIntegration = () => {
    if (!user?.id) return;
    
    createIntegration({
      ...newIntegration,
      created_by: user.id,
    });
    
    setNewIntegration({
      nome: '',
      descricao: '',
      webhook_url: '',
      evento_associado: '',
      tipo_execucao: 'automatico',
      is_active: true,
    });
    setIsCreateDialogOpen(false);
  };

  const handleExecuteIntegration = () => {
    if (!selectedIntegration) return;
    
    let payload = {};
    try {
      payload = JSON.parse(executionPayload);
    } catch (e) {
      console.error('Invalid JSON payload');
      return;
    }

    executeIntegration({
      integrationId: selectedIntegration.id,
      payload,
    });
    
    setIsExecuteDialogOpen(false);
    setSelectedIntegration(null);
    setExecutionPayload('{}');
  };

  const eventos = [
    'novo_ticket',
    'conclusao_servico',
    'venda_concluida',
    'instalacao_agendada',
    'pagamento_recebido',
    'cliente_cadastrado'
  ];

  const getStatusIcon = (status?: number) => {
    if (!status) return <Clock className="h-4 w-4 text-gray-400" />;
    if (status >= 200 && status < 300) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Integrações n8n
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Configure e execute fluxos de automação com n8n
          </p>
        </div>

        <Tabs defaultValue="integrations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="logs">Logs de Execução</TabsTrigger>
            <TabsTrigger value="docs">Documentação</TabsTrigger>
          </TabsList>
          
          <TabsContent value="integrations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Fluxos n8n Configurados</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Integração
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Integração n8n</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome da Integração</Label>
                      <Input
                        id="nome"
                        value={newIntegration.nome}
                        onChange={(e) => setNewIntegration({...newIntegration, nome: e.target.value})}
                        placeholder="Ex: Processar Novo Ticket"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descricao">Descrição</Label>
                      <Textarea
                        id="descricao"
                        value={newIntegration.descricao}
                        onChange={(e) => setNewIntegration({...newIntegration, descricao: e.target.value})}
                        placeholder="Descreva o que esta integração faz..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="webhook_url">URL do Webhook n8n</Label>
                      <Input
                        id="webhook_url"
                        value={newIntegration.webhook_url}
                        onChange={(e) => setNewIntegration({...newIntegration, webhook_url: e.target.value})}
                        placeholder="https://n8n.exemplo.com/webhook/abc123"
                      />
                    </div>
                    <div>
                      <Label htmlFor="evento_associado">Evento Associado</Label>
                      <Select value={newIntegration.evento_associado} onValueChange={(value) => setNewIntegration({...newIntegration, evento_associado: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o evento" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventos.map(evento => (
                            <SelectItem key={evento} value={evento}>
                              {evento.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tipo_execucao">Tipo de Execução</Label>
                      <Select value={newIntegration.tipo_execucao} onValueChange={(value) => setNewIntegration({...newIntegration, tipo_execucao: value as any})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatico">Automático</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={newIntegration.is_active}
                        onCheckedChange={(checked) => setNewIntegration({...newIntegration, is_active: checked})}
                      />
                      <Label htmlFor="is_active">Integração Ativa</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateIntegration}>
                      Criar Integração
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loadingIntegrations ? (
              <div className="text-center py-8">Carregando integrações...</div>
            ) : (
              <div className="grid gap-4">
                {integrations?.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-purple-600" />
                          <div>
                            <CardTitle className="text-lg">{integration.nome}</CardTitle>
                            {integration.descricao && (
                              <p className="text-sm text-gray-600">{integration.descricao}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={integration.is_active ? "default" : "secondary"}>
                            {integration.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                          <Badge variant="outline">
                            {integration.evento_associado.replace('_', ' ')}
                          </Badge>
                          <Badge variant={integration.tipo_execucao === 'automatico' ? "default" : "secondary"}>
                            {integration.tipo_execucao}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Criado em {new Date(integration.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          {integration.tipo_execucao === 'manual' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedIntegration(integration);
                                setIsExecuteDialogOpen(true);
                              }}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Executar
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(integration.webhook_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Dialog de execução manual */}
            <Dialog open={isExecuteDialogOpen} onOpenChange={setIsExecuteDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Executar Integração: {selectedIntegration?.nome}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="execution_payload">Payload (JSON)</Label>
                    <Textarea
                      id="execution_payload"
                      value={executionPayload}
                      onChange={(e) => setExecutionPayload(e.target.value)}
                      placeholder='{"data": "exemplo", "timestamp": "2024-01-01T00:00:00Z"}'
                      rows={10}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Configure os dados que serão enviados para o fluxo n8n
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsExecuteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleExecuteIntegration}>
                    <Play className="h-4 w-4 mr-2" />
                    Executar Agora
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Execução n8n</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingLogs ? (
                  <div className="text-center py-8">Carregando logs...</div>
                ) : executionLogs?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum log encontrado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {executionLogs?.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status_resposta)}
                            <span className="font-medium">{log.integracoes_n8n?.nome}</span>
                            <Badge variant="outline">
                              {log.status_resposta || 'Pendente'}
                            </Badge>
                            <Badge variant="secondary">
                              {log.tipo_execucao}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(log.timestamp_execucao).toLocaleString()}
                          </span>
                        </div>
                        {log.erro_message && (
                          <div className="text-sm text-red-600 mb-2">
                            <strong>Erro:</strong> {log.erro_message}
                          </div>
                        )}
                        <details className="text-sm">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                            Ver detalhes da execução
                          </summary>
                          <div className="mt-2 space-y-2">
                            <div>
                              <strong>Payload enviado:</strong>
                              <pre className="p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                                {JSON.stringify(log.payload_enviado, null, 2)}
                              </pre>
                            </div>
                            {log.resposta_recebida && (
                              <div>
                                <strong>Resposta recebida:</strong>
                                <pre className="p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                                  {log.resposta_recebida}
                                </pre>
                              </div>
                            )}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuração no n8n
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <h3>Como configurar webhooks no n8n:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Crie um novo workflow no n8n</li>
                    <li>Adicione um nó "Webhook" como trigger</li>
                    <li>Configure o webhook para aceitar POST requests</li>
                    <li>Copie a URL do webhook gerada</li>
                    <li>Cole a URL no campo "URL do Webhook n8n" acima</li>
                    <li>Configure os nós seguintes para processar os dados recebidos</li>
                  </ol>

                  <h3 className="mt-6">Estrutura do payload enviado:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "evento": "novo_ticket",
  "timestamp": "2024-01-01T12:00:00Z",
  "dados": {
    "id": "uuid-do-ticket",
    "cliente_nome": "João Silva",
    "tipo_servico": "instalacao",
    "prioridade": "alta",
    "agente_id": "uuid-do-agente"
  },
  "sistema": {
    "origem": "sistema_provedor",
    "versao": "1.0"
  }
}`}
                  </pre>

                  <h3 className="mt-6">Eventos disponíveis:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><code>novo_ticket</code> - Quando um novo ticket técnico é criado</li>
                    <li><code>conclusao_servico</code> - Quando um serviço é concluído</li>
                    <li><code>venda_concluida</code> - Quando uma venda é fechada</li>
                    <li><code>instalacao_agendada</code> - Quando uma instalação é agendada</li>
                    <li><code>pagamento_recebido</code> - Quando um pagamento é confirmado</li>
                    <li><code>cliente_cadastrado</code> - Quando um novo cliente é registrado</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default N8nManagement;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebhooks } from "@/hooks/useWebhooks";
import { useAuth } from "@/contexts/AuthContext";
import { Webhook, Plus, Trash2, Edit, Play, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";

const WebhooksManagement = () => {
  const { user } = useAuth();
  const { webhooks, webhookLogs, loadingWebhooks, loadingLogs, createWebhook, updateWebhook, deleteWebhook } = useWebhooks();
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<any>(null);

  const [newWebhook, setNewWebhook] = useState({
    nome: '',
    url_destino: '',
    evento: '',
    headers: '{}',
    is_active: true,
  });

  const handleCreateWebhook = () => {
    if (!user?.id) return;
    
    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(newWebhook.headers || '{}');
    } catch (e) {
      console.error('Invalid JSON in headers');
      return;
    }

    createWebhook({
      ...newWebhook,
      headers: parsedHeaders,
      created_by: user.id,
    });
    
    setNewWebhook({
      nome: '',
      url_destino: '',
      evento: '',
      headers: '{}',
      is_active: true,
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditWebhook = (webhook: any) => {
    setEditingWebhook({
      ...webhook,
      headers: JSON.stringify(webhook.headers || {}, null, 2),
    });
  };

  const handleUpdateWebhook = () => {
    if (!editingWebhook) return;
    
    let parsedHeaders = {};
    try {
      parsedHeaders = JSON.parse(editingWebhook.headers || '{}');
    } catch (e) {
      console.error('Invalid JSON in headers');
      return;
    }

    updateWebhook({
      id: editingWebhook.id,
      nome: editingWebhook.nome,
      url_destino: editingWebhook.url_destino,
      evento: editingWebhook.evento,
      headers: parsedHeaders,
      is_active: editingWebhook.is_active,
    });
    
    setEditingWebhook(null);
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
            Gerenciamento de Webhooks
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Configure e monitore webhooks para automação de eventos do sistema
          </p>
        </div>

        <Tabs defaultValue="webhooks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="logs">Logs de Execução</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhooks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Webhooks Configurados</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Webhook</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome do Webhook</Label>
                      <Input
                        id="nome"
                        value={newWebhook.nome}
                        onChange={(e) => setNewWebhook({...newWebhook, nome: e.target.value})}
                        placeholder="Nome descritivo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="url_destino">URL de Destino</Label>
                      <Input
                        id="url_destino"
                        value={newWebhook.url_destino}
                        onChange={(e) => setNewWebhook({...newWebhook, url_destino: e.target.value})}
                        placeholder="https://exemplo.com/webhook"
                      />
                    </div>
                    <div>
                      <Label htmlFor="evento">Evento</Label>
                      <Select value={newWebhook.evento} onValueChange={(value) => setNewWebhook({...newWebhook, evento: value})}>
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
                      <Label htmlFor="headers">Headers (JSON)</Label>
                      <Textarea
                        id="headers"
                        value={newWebhook.headers}
                        onChange={(e) => setNewWebhook({...newWebhook, headers: e.target.value})}
                        placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={newWebhook.is_active}
                        onCheckedChange={(checked) => setNewWebhook({...newWebhook, is_active: checked})}
                      />
                      <Label htmlFor="is_active">Webhook Ativo</Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateWebhook}>
                      Criar Webhook
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loadingWebhooks ? (
              <div className="text-center py-8">Carregando webhooks...</div>
            ) : (
              <div className="grid gap-4">
                {webhooks?.map((webhook) => (
                  <Card key={webhook.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Webhook className="h-5 w-5 text-blue-600" />
                          <div>
                            <CardTitle className="text-lg">{webhook.nome}</CardTitle>
                            <p className="text-sm text-gray-600">{webhook.url_destino}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={webhook.is_active ? "default" : "secondary"}>
                            {webhook.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                          <Badge variant="outline">
                            {webhook.evento.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Criado em {new Date(webhook.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditWebhook(webhook)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteWebhook(webhook.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Dialog de edição */}
            <Dialog open={!!editingWebhook} onOpenChange={() => setEditingWebhook(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Editar Webhook</DialogTitle>
                </DialogHeader>
                {editingWebhook && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit_nome">Nome do Webhook</Label>
                      <Input
                        id="edit_nome"
                        value={editingWebhook.nome}
                        onChange={(e) => setEditingWebhook({...editingWebhook, nome: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_url_destino">URL de Destino</Label>
                      <Input
                        id="edit_url_destino"
                        value={editingWebhook.url_destino}
                        onChange={(e) => setEditingWebhook({...editingWebhook, url_destino: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit_evento">Evento</Label>
                      <Select value={editingWebhook.evento} onValueChange={(value) => setEditingWebhook({...editingWebhook, evento: value})}>
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label htmlFor="edit_headers">Headers (JSON)</Label>
                      <Textarea
                        id="edit_headers"
                        value={editingWebhook.headers}
                        onChange={(e) => setEditingWebhook({...editingWebhook, headers: e.target.value})}
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit_is_active"
                        checked={editingWebhook.is_active}
                        onCheckedChange={(checked) => setEditingWebhook({...editingWebhook, is_active: checked})}
                      />
                      <Label htmlFor="edit_is_active">Webhook Ativo</Label>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setEditingWebhook(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateWebhook}>
                    Atualizar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Execução</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingLogs ? (
                  <div className="text-center py-8">Carregando logs...</div>
                ) : webhookLogs?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum log encontrado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {webhookLogs?.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status_http)}
                            <span className="font-medium">{log.webhooks?.nome}</span>
                            <Badge variant="outline">
                              {log.status_http || 'Pendente'}
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
                            Ver payload
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                            {JSON.stringify(log.payload_enviado, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default WebhooksManagement;

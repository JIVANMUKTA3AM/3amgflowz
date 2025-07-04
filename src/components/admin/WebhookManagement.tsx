
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Webhook, Play, Trash2, Eye, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WebhookEvent {
  id: string;
  agent_id: string;
  agent_type: string;
  event_type: string;
  payload: any;
  source: string;
  timestamp: string;
  status: string;
  created_at: string;
}

const WebhookManagement = () => {
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testPayload, setTestPayload] = useState('{"message": "teste do webhook", "agent_type": "geral"}');

  // URL do endpoint webhook principal
  const webhookEndpointUrl = `https://llssfiurupclhpiaozug.supabase.co/functions/v1/webhook-receiver`;

  useEffect(() => {
    loadWebhookEvents();
  }, []);

  const loadWebhookEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setWebhookEvents(data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos de webhook:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos de webhook",
        variant: "destructive",
      });
    }
  };

  const testWebhook = async () => {
    setIsLoading(true);
    try {
      let payload;
      try {
        payload = JSON.parse(testPayload);
      } catch {
        throw new Error('JSON inválido no payload de teste');
      }

      const response = await fetch(webhookEndpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          test: true,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Teste realizado com sucesso!",
          description: "O webhook foi testado e processado corretamente.",
        });
        loadWebhookEvents(); // Recarregar eventos
      } else {
        throw new Error(result.error || 'Erro no teste do webhook');
      }
    } catch (error) {
      console.error('Erro no teste do webhook:', error);
      toast({
        title: "Erro no teste",
        description: error instanceof Error ? error.message : "Falha ao testar o webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyEndpointUrl = () => {
    navigator.clipboard.writeText(webhookEndpointUrl);
    toast({
      title: "URL copiada!",
      description: "A URL do endpoint foi copiada para a área de transferência",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      received: 'bg-blue-100 text-blue-800',
      processed: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-6 w-6" />
            Gerenciamento de Webhooks - Admin
          </CardTitle>
          <CardDescription>
            Configure e monitore webhooks para integração com N8N e outros sistemas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="endpoint" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="endpoint">Endpoint Principal</TabsTrigger>
              <TabsTrigger value="events">Eventos Recebidos</TabsTrigger>
              <TabsTrigger value="test">Testar Webhook</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoint" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">URL do Webhook</CardTitle>
                  <CardDescription>
                    Use esta URL nos seus workflows N8N para enviar dados para o sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={webhookEndpointUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={copyEndpointUrl} variant="outline">
                      Copiar
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Como usar:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Configure esta URL como webhook de destino no N8N</li>
                      <li>• Use método POST com Content-Type: application/json</li>
                      <li>• Inclua agent_type no payload para roteamento correto</li>
                      <li>• Os eventos serão processados automaticamente</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Exemplo de payload:</h4>
                    <pre className="text-xs text-gray-700 overflow-x-auto">
{`{
  "agent_type": "geral",
  "event_type": "customer_message",
  "message": "Cliente precisa de suporte",
  "customer_data": {
    "name": "João Silva",
    "phone": "+5511999999999"
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Eventos Recebidos</h3>
                <Button onClick={loadWebhookEvents} variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Agente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Origem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhookEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          Nenhum evento de webhook registrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      webhookEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="text-sm">
                            {formatTimestamp(event.timestamp)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {event.agent_type || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {event.event_type}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(event.status)}>
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {event.source}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Teste do Webhook</CardTitle>
                  <CardDescription>
                    Envie um payload de teste para verificar se o webhook está funcionando
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="test-payload">Payload JSON</Label>
                    <textarea
                      id="test-payload"
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      className="w-full h-32 p-3 border rounded-lg font-mono text-sm mt-2"
                      placeholder="Digite o JSON para teste..."
                    />
                  </div>
                  
                  <Button 
                    onClick={testWebhook}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      "Testando..."
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Testar Webhook
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookManagement;

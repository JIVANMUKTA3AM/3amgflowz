
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookTester } from "@/components/webhook/WebhookTester";
import { useWebhooks } from "@/hooks/useWebhooks";
import { Activity, Globe, TestTube, Clock, CheckCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const WebhookTesting = () => {
  const { webhooks, webhookLogs, loadingWebhooks, loadingLogs } = useWebhooks();
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);

  const getStatusIcon = (statusCode?: number) => {
    if (!statusCode) return <XCircle className="h-4 w-4 text-gray-400" />;
    if (statusCode >= 200 && statusCode < 300) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (statusCode?: number) => {
    if (!statusCode) return <Badge variant="secondary">Sem Resposta</Badge>;
    if (statusCode >= 200 && statusCode < 300) return <Badge variant="default" className="bg-green-100 text-green-800">Sucesso</Badge>;
    if (statusCode >= 400 && statusCode < 500) return <Badge variant="destructive">Erro Cliente</Badge>;
    if (statusCode >= 500) return <Badge variant="destructive">Erro Servidor</Badge>;
    return <Badge variant="secondary">HTTP {statusCode}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <TestTube className="h-8 w-8 text-blue-600" />
            Teste de Webhooks - Ambiente Live
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Verifique a conectividade e funcionalidade dos seus webhooks em tempo real. 
            Execute testes automatizados e monitore o histórico de execuções.
          </p>
        </div>

        <Tabs defaultValue="tester" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tester" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Testar URL
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Webhooks Cadastrados
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico de Testes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tester" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WebhookTester />
              
              <Card>
                <CardHeader>
                  <CardTitle>Dicas para Testes</CardTitle>
                  <CardDescription>
                    Como configurar e testar seus webhooks efetivamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">URLs HTTPS</h4>
                        <p className="text-sm text-gray-600">
                          Use sempre URLs HTTPS em produção para segurança
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Timeout Adequado</h4>
                        <p className="text-sm text-gray-600">
                          Configure um timeout de 15 segundos para respostas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Teste Regular</h4>
                        <p className="text-sm text-gray-600">
                          Execute testes regulares para garantir disponibilidade
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Monitoramento</h4>
                        <p className="text-sm text-gray-600">
                          Monitore os logs para identificar problemas rapidamente
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            {loadingWebhooks ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando webhooks...</p>
              </div>
            ) : webhooks && webhooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {webhooks.map((webhook) => (
                  <Card key={webhook.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{webhook.nome}</CardTitle>
                        <Badge variant={webhook.is_active ? "default" : "secondary"}>
                          {webhook.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <CardDescription className="break-all">
                        {webhook.url_destino}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>Evento:</strong> {webhook.evento}
                        </p>
                        <Button
                          onClick={() => setSelectedWebhook(webhook.id)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <TestTube className="h-4 w-4 mr-2" />
                          Testar Webhook
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum webhook cadastrado
                  </h3>
                  <p className="text-gray-600">
                    Configure seus webhooks primeiro para poder testá-los aqui.
                  </p>
                </CardContent>
              </Card>
            )}

            {selectedWebhook && (
              <Card>
                <CardHeader>
                  <CardTitle>Teste do Webhook Selecionado</CardTitle>
                  <CardDescription>
                    Testando o webhook: {webhooks?.find(w => w.id === selectedWebhook)?.nome}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WebhookTester
                    webhookId={selectedWebhook}
                    initialUrl={webhooks?.find(w => w.id === selectedWebhook)?.url_destino || ""}
                  />
                  <Button
                    onClick={() => setSelectedWebhook(null)}
                    variant="outline"
                    className="mt-4"
                  >
                    Cancelar Teste
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            {loadingLogs ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando logs...</p>
              </div>
            ) : webhookLogs && webhookLogs.length > 0 ? (
              <div className="space-y-4">
                {webhookLogs.map((log) => (
                  <Card key={log.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(log.status_http)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">
                                {(log as any).webhooks?.nome || 'Webhook'}
                              </h4>
                              {getStatusBadge(log.status_http)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {formatDistanceToNow(new Date(log.timestamp_execucao), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </p>
                            {log.erro_message && (
                              <p className="text-sm text-red-600 font-medium">
                                {log.erro_message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {log.status_http && `HTTP ${log.status_http}`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum log de teste encontrado
                  </h3>
                  <p className="text-gray-600">
                    Execute alguns testes de webhook para ver o histórico aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WebhookTesting;

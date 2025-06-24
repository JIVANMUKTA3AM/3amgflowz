
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Webhook, MessageCircle, Send, Settings, ExternalLink, Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface WebhookConfig {
  id: string;
  name: string;
  platform: string;
  webhookUrl: string;
  isActive: boolean;
  headers: Record<string, string>;
  settings: Record<string, any>;
  lastTriggered?: string;
}

const WebhookIntegrationPanel = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: "whatsapp-1",
      name: "WhatsApp Business",
      platform: "whatsapp",
      webhookUrl: "",
      isActive: false,
      headers: {},
      settings: { phoneNumber: "", accessToken: "" },
    },
    {
      id: "telegram-1",
      name: "Telegram Bot",
      platform: "telegram",
      webhookUrl: "",
      isActive: false,
      headers: {},
      settings: { botToken: "", chatId: "" },
    },
    {
      id: "custom-1",
      name: "Webhook Personalizado",
      platform: "custom",
      webhookUrl: "",
      isActive: false,
      headers: { "Content-Type": "application/json" },
      settings: {},
    },
  ]);

  const [selectedWebhook, setSelectedWebhook] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const saved = localStorage.getItem("webhook_integrations");
    if (saved) {
      try {
        setWebhooks(JSON.parse(saved));
      } catch (error) {
        console.error("Erro ao carregar webhooks:", error);
      }
    }
  }, []);

  const saveWebhooks = (updatedWebhooks: WebhookConfig[]) => {
    localStorage.setItem("webhook_integrations", JSON.stringify(updatedWebhooks));
    setWebhooks(updatedWebhooks);
  };

  const updateWebhook = (id: string, updates: Partial<WebhookConfig>) => {
    const updated = webhooks.map(webhook =>
      webhook.id === id ? { ...webhook, ...updates } : webhook
    );
    saveWebhooks(updated);
  };

  const testWebhook = async (webhookId: string) => {
    const webhook = webhooks.find(w => w.id === webhookId);
    if (!webhook?.webhookUrl) {
      toast({
        title: "URL não configurada",
        description: "Configure a URL do webhook antes de testá-lo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const testPayload = {
        type: "test",
        platform: webhook.platform,
        message: {
          text: "Teste de integração - webhook funcionando!",
          from: "sistema_agentes",
          timestamp: new Date().toISOString(),
        },
        webhook_id: webhookId,
      };

      await fetch(webhook.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...webhook.headers,
        },
        mode: "no-cors",
        body: JSON.stringify(testPayload),
      });

      updateWebhook(webhookId, { lastTriggered: new Date().toISOString() });

      toast({
        title: "Webhook testado!",
        description: `Teste enviado para ${webhook.name} com sucesso`,
      });
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o webhook. Verifique a URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return <MessageCircle className="h-5 w-5 text-green-600" />;
      case "telegram":
        return <Send className="h-5 w-5 text-blue-600" />;
      default:
        return <Webhook className="h-5 w-5 text-gray-600" />;
    }
  };

  const copyWebhookExample = (platform: string) => {
    const examples = {
      whatsapp: {
        incoming: {
          type: "message_received",
          platform: "whatsapp",
          message: {
            id: "wamid.xxx",
            from: "+5511999999999",
            text: "Olá, preciso de ajuda",
            timestamp: "2024-01-01T10:00:00Z",
          },
        },
        outgoing: {
          type: "send_message",
          to: "+5511999999999",
          message: {
            text: "Olá! Como posso ajudá-lo hoje?",
          },
        },
      },
      telegram: {
        incoming: {
          type: "message_received",
          platform: "telegram",
          message: {
            message_id: 123,
            from: { id: 12345, username: "usuario" },
            text: "Olá bot",
            date: 1640995200,
          },
        },
        outgoing: {
          type: "send_message",
          chat_id: 12345,
          text: "Olá! Como posso ajudá-lo?",
        },
      },
      custom: {
        incoming: {
          type: "message_received",
          platform: "custom",
          user_id: "user123",
          message: "Mensagem do usuário",
          metadata: { source: "website", session_id: "abc123" },
        },
        outgoing: {
          type: "agent_response",
          user_id: "user123",
          response: "Resposta do agente",
          agent_id: "agent_001",
        },
      },
    };

    const example = examples[platform as keyof typeof examples];
    navigator.clipboard.writeText(JSON.stringify(example, null, 2));
    toast({
      title: "Exemplo copiado!",
      description: "Formato de payload copiado para a área de transferência",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-6 w-6" />
            Integrações com Webhooks
          </CardTitle>
          <CardDescription>
            Configure webhooks para receber mensagens de plataformas externas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Configurações</TabsTrigger>
              <TabsTrigger value="docs">Documentação</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {webhooks.map((webhook) => (
                <Card key={webhook.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(webhook.platform)}
                        <div>
                          <h4 className="font-medium">{webhook.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{webhook.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={webhook.isActive ? "default" : "secondary"}>
                          {webhook.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                        <Switch
                          checked={webhook.isActive}
                          onCheckedChange={(checked) => updateWebhook(webhook.id, { isActive: checked })}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`url-${webhook.id}`}>URL do Webhook</Label>
                      <Input
                        id={`url-${webhook.id}`}
                        value={webhook.webhookUrl}
                        onChange={(e) => updateWebhook(webhook.id, { webhookUrl: e.target.value })}
                        placeholder={`https://seu-n8n.com/webhook/${webhook.platform}`}
                      />
                    </div>

                    {webhook.platform === "whatsapp" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Número do WhatsApp</Label>
                          <Input
                            value={webhook.settings.phoneNumber || ""}
                            onChange={(e) => updateWebhook(webhook.id, {
                              settings: { ...webhook.settings, phoneNumber: e.target.value }
                            })}
                            placeholder="+5511999999999"
                          />
                        </div>
                        <div>
                          <Label>Access Token</Label>
                          <Input
                            type="password"
                            value={webhook.settings.accessToken || ""}
                            onChange={(e) => updateWebhook(webhook.id, {
                              settings: { ...webhook.settings, accessToken: e.target.value }
                            })}
                            placeholder="EAAxxxxxxxx"
                          />
                        </div>
                      </div>
                    )}

                    {webhook.platform === "telegram" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Bot Token</Label>
                          <Input
                            type="password"
                            value={webhook.settings.botToken || ""}
                            onChange={(e) => updateWebhook(webhook.id, {
                              settings: { ...webhook.settings, botToken: e.target.value }
                            })}
                            placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                          />
                        </div>
                        <div>
                          <Label>Chat ID (opcional)</Label>
                          <Input
                            value={webhook.settings.chatId || ""}
                            onChange={(e) => updateWebhook(webhook.id, {
                              settings: { ...webhook.settings, chatId: e.target.value }
                            })}
                            placeholder="@meucanal ou 123456789"
                          />
                        </div>
                      </div>
                    )}

                    {webhook.lastTriggered && (
                      <p className="text-xs text-gray-500">
                        Último teste: {new Date(webhook.lastTriggered).toLocaleString()}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testWebhook(webhook.id)}
                        disabled={isLoading}
                      >
                        Testar Webhook
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyWebhookExample(webhook.platform)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Exemplo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documentação dos Webhooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">WhatsApp Business API</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Para configurar o WhatsApp, você precisa:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Criar uma conta no Meta Business Manager</li>
                      <li>• Configurar um app WhatsApp Business</li>
                      <li>• Obter o Access Token e Phone Number ID</li>
                      <li>• Configurar o webhook para receber mensagens</li>
                    </ul>
                    <Button variant="link" size="sm" asChild className="p-0 mt-2">
                      <a href="https://developers.facebook.com/docs/whatsapp" target="_blank">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Documentação WhatsApp
                      </a>
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Telegram Bot</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Para configurar o Telegram:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Crie um bot conversando com @BotFather</li>
                      <li>• Obtenha o Bot Token</li>
                      <li>• Configure o webhook usando a API do Telegram</li>
                    </ul>
                    <Button variant="link" size="sm" asChild className="p-0 mt-2">
                      <a href="https://core.telegram.org/bots/api" target="_blank">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Documentação Telegram
                      </a>
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Webhook Personalizado</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Use para integrar com qualquer plataforma que suporte webhooks.
                      O payload enviado seguirá o formato padrão com informações da mensagem.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookIntegrationPanel;

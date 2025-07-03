
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Copy, TestTube, Settings, Webhook, ExternalLink } from "lucide-react";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";

interface N8nWebhookConfig {
  id: string;
  agent_id: string;
  agent_name: string;
  webhook_url: string;
  event_types: string[];
  is_active: boolean;
  last_triggered?: string;
  description?: string;
}

const N8nWebhookManager = () => {
  const { configurations } = useAgentConfigurations();
  const [webhookConfigs, setWebhookConfigs] = useState<N8nWebhookConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<N8nWebhookConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // URL base do endpoint webhook
  const webhookEndpointUrl = `${window.location.origin.replace('https://', 'https://').replace('http://', 'https://')}/functions/v1/webhook-receiver`;

  useEffect(() => {
    loadWebhookConfigs();
  }, []);

  const loadWebhookConfigs = () => {
    const saved = localStorage.getItem("n8n_webhook_configs");
    if (saved) {
      try {
        setWebhookConfigs(JSON.parse(saved));
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    }
  };

  const saveWebhookConfigs = (configs: N8nWebhookConfig[]) => {
    localStorage.setItem("n8n_webhook_configs", JSON.stringify(configs));
    setWebhookConfigs(configs);
  };

  const createNewConfig = () => {
    const newConfig: N8nWebhookConfig = {
      id: Date.now().toString(),
      agent_id: "",
      agent_name: "",
      webhook_url: "",
      event_types: ["agent_response"],
      is_active: true,
      description: ""
    };
    setEditingConfig(newConfig);
  };

  const saveConfig = () => {
    if (!editingConfig) return;

    const agent = configurations?.find(c => c.id === editingConfig.agent_id);
    if (!agent) {
      toast({
        title: "Erro",
        description: "Selecione um agente válido",
        variant: "destructive"
      });
      return;
    }

    const updatedConfig = {
      ...editingConfig,
      agent_name: agent.name
    };

    const existingIndex = webhookConfigs.findIndex(c => c.id === editingConfig.id);
    let updatedConfigs;

    if (existingIndex >= 0) {
      updatedConfigs = [...webhookConfigs];
      updatedConfigs[existingIndex] = updatedConfig;
    } else {
      updatedConfigs = [...webhookConfigs, updatedConfig];
    }

    saveWebhookConfigs(updatedConfigs);
    setEditingConfig(null);

    toast({
      title: "Configuração salva",
      description: "Webhook configurado com sucesso"
    });
  };

  const testWebhook = async (config: N8nWebhookConfig) => {
    if (!config.webhook_url) {
      toast({
        title: "URL necessária",
        description: "Configure a URL do webhook n8n primeiro",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const testPayload = {
        agent_id: config.agent_id,
        agent_type: config.agent_name,
        event_type: "integration_test",
        data: {
          test: true,
          message: "Teste de integração com n8n",
          timestamp: new Date().toISOString(),
          source: "webhook_manager"
        },
        timestamp: new Date().toISOString(),
        source: "integration_test"
      };

      await fetch(config.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(testPayload),
      });

      // Atualizar timestamp do último teste
      const updatedConfigs = webhookConfigs.map(c =>
        c.id === config.id
          ? { ...c, last_triggered: new Date().toISOString() }
          : c
      );
      saveWebhookConfigs(updatedConfigs);

      toast({
        title: "Teste enviado",
        description: "Dados de teste enviados para o n8n. Verifique os logs no n8n.",
      });
    } catch (error) {
      console.error("Erro no teste:", error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível enviar o teste. Verifique a URL.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookEndpointUrl);
    toast({
      title: "URL copiada",
      description: "URL do endpoint copiada para a área de transferência"
    });
  };

  const copyExamplePayload = () => {
    const example = {
      agent_id: "seu-agent-id",
      agent_type: "atendimento",
      event_type: "agent_response",
      data: {
        user_message: "Mensagem do usuário",
        agent_response: "Resposta do agente",
        session_id: "sess_123",
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      source: "n8n"
    };

    navigator.clipboard.writeText(JSON.stringify(example, null, 2));
    toast({
      title: "Exemplo copiado",
      description: "Exemplo de payload copiado para a área de transferência"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Endpoint para Webhooks N8N
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">URL do Endpoint:</h4>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-white rounded border text-sm">
                {webhookEndpointUrl}
              </code>
              <Button size="sm" variant="outline" onClick={copyWebhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Use esta URL como destino dos webhooks no seu n8n
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={copyExamplePayload} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-1" />
              Copiar Exemplo de Payload
            </Button>
            <Button asChild variant="outline" size="sm">
              <a 
                href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/" 
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Docs N8N Webhook
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configurações de Webhook por Agente</CardTitle>
            <Button onClick={createNewConfig}>
              <Settings className="h-4 w-4 mr-2" />
              Nova Configuração
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editingConfig && (
            <Card className="mb-6 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingConfig.id === Date.now().toString() ? "Nova" : "Editar"} Configuração
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Agente</Label>
                  <Select
                    value={editingConfig.agent_id}
                    onValueChange={(value) => 
                      setEditingConfig({ ...editingConfig, agent_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um agente" />
                    </SelectTrigger>
                    <SelectContent>
                      {configurations?.map((config) => (
                        <SelectItem key={config.id} value={config.id}>
                          {config.name} ({config.agent_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>URL do Webhook N8N</Label>
                  <Input
                    value={editingConfig.webhook_url}
                    onChange={(e) => 
                      setEditingConfig({ ...editingConfig, webhook_url: e.target.value })
                    }
                    placeholder="https://seu-n8n.com/webhook/..."
                  />
                </div>

                <div>
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    value={editingConfig.description || ""}
                    onChange={(e) => 
                      setEditingConfig({ ...editingConfig, description: e.target.value })
                    }
                    placeholder="Descreva o propósito deste webhook..."
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveConfig}>Salvar</Button>
                  <Button variant="outline" onClick={() => setEditingConfig(null)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {webhookConfigs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Webhook className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma configuração de webhook encontrada.</p>
                <p className="text-sm">Clique em "Nova Configuração" para começar.</p>
              </div>
            ) : (
              webhookConfigs.map((config) => (
                <Card key={config.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{config.agent_name}</h4>
                          <Badge variant={config.is_active ? "default" : "secondary"}>
                            {config.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          URL: {config.webhook_url || "Não configurado"}
                        </p>
                        {config.description && (
                          <p className="text-sm text-gray-500">{config.description}</p>
                        )}
                        {config.last_triggered && (
                          <p className="text-xs text-gray-400 mt-2">
                            Último teste: {new Date(config.last_triggered).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testWebhook(config)}
                          disabled={isLoading}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingConfig(config)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default N8nWebhookManager;

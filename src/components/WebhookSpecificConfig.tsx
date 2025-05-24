
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Webhook, Copy, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AgentWebhookConfig = {
  agentType: string;
  agentName: string;
  webhookUrl: string;
  isActive: boolean;
  lastTriggered?: string;
};

const WebhookSpecificConfig = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [webhookConfigs, setWebhookConfigs] = useState<AgentWebhookConfig[]>([
    {
      agentType: "atendimento",
      agentName: "Agente de Atendimento",
      webhookUrl: "",
      isActive: false,
    },
    {
      agentType: "comercial",
      agentName: "Agente Comercial",
      webhookUrl: "",
      isActive: false,
    },
    {
      agentType: "suporte_tecnico",
      agentName: "Agente de Suporte Técnico",
      webhookUrl: "",
      isActive: false,
    },
  ]);

  useEffect(() => {
    loadWebhookConfigs();
  }, []);

  const loadWebhookConfigs = () => {
    // Carregar configurações salvas do localStorage
    const saved = localStorage.getItem("agent_webhook_configs");
    if (saved) {
      try {
        const configs = JSON.parse(saved);
        setWebhookConfigs(configs);
      } catch (error) {
        console.error("Erro ao carregar configurações de webhook:", error);
      }
    }
  };

  const saveWebhookConfigs = (configs: AgentWebhookConfig[]) => {
    localStorage.setItem("agent_webhook_configs", JSON.stringify(configs));
    setWebhookConfigs(configs);
  };

  const handleWebhookUrlChange = (agentType: string, url: string) => {
    const updatedConfigs = webhookConfigs.map(config =>
      config.agentType === agentType
        ? { ...config, webhookUrl: url }
        : config
    );
    setWebhookConfigs(updatedConfigs);
  };

  const handleSaveWebhook = (agentType: string) => {
    const config = webhookConfigs.find(c => c.agentType === agentType);
    if (!config?.webhookUrl) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira a URL do webhook n8n",
        variant: "destructive",
      });
      return;
    }

    const updatedConfigs = webhookConfigs.map(c =>
      c.agentType === agentType
        ? { ...c, isActive: true }
        : c
    );
    saveWebhookConfigs(updatedConfigs);

    toast({
      title: "Webhook configurado",
      description: `Webhook do ${config.agentName} foi configurado com sucesso`,
    });
  };

  const handleTestWebhook = async (agentType: string) => {
    const config = webhookConfigs.find(c => c.agentType === agentType);
    if (!config?.webhookUrl) {
      toast({
        title: "Webhook não configurado",
        description: "Configure o webhook antes de testá-lo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await fetch(config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          agent_type: agentType,
          test: true,
          timestamp: new Date().toISOString(),
          source: window.location.origin,
        }),
      });

      const updatedConfigs = webhookConfigs.map(c =>
        c.agentType === agentType
          ? { ...c, lastTriggered: new Date().toISOString() }
          : c
      );
      saveWebhookConfigs(updatedConfigs);

      toast({
        title: "Webhook testado",
        description: `O webhook do ${config.agentName} foi testado com sucesso`,
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

  const copyWebhookExample = (agentType: string) => {
    const examplePayload = {
      agent_type: agentType,
      data: {
        message: "Exemplo de dados do agente",
        timestamp: new Date().toISOString(),
      },
      source: "sistema_agentes"
    };

    navigator.clipboard.writeText(JSON.stringify(examplePayload, null, 2));
    toast({
      title: "Exemplo copiado",
      description: "Exemplo de payload foi copiado para a área de transferência",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Webhooks Específicos por Agente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {webhookConfigs.map((config) => (
          <div key={config.agentType} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{config.agentName}</h4>
                <p className="text-sm text-gray-500">Webhook dedicado para {config.agentType}</p>
              </div>
              <Badge variant={config.isActive ? "default" : "secondary"}>
                {config.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`webhook-${config.agentType}`}>URL do Webhook n8n</Label>
              <Input
                id={`webhook-${config.agentType}`}
                type="url"
                placeholder={`https://seu-n8n.com/webhook/${config.agentType}`}
                value={config.webhookUrl}
                onChange={(e) => handleWebhookUrlChange(config.agentType, e.target.value)}
              />
            </div>

            {config.lastTriggered && (
              <p className="text-xs text-gray-500">
                Último teste: {new Date(config.lastTriggered).toLocaleString()}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveWebhook(config.agentType)}
              >
                Salvar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestWebhook(config.agentType)}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                Testar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyWebhookExample(config.agentType)}
              >
                <Copy className="h-3 w-3 mr-1" />
                Exemplo
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Como usar os webhooks específicos:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Cada agente tem seu próprio webhook dedicado</li>
            <li>• Configure URLs diferentes no n8n para cada tipo de agente</li>
            <li>• Os dados enviados incluem o tipo de agente para filtragem</li>
            <li>• Use o botão "Exemplo" para ver o formato do payload</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookSpecificConfig;

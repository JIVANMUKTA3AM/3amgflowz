
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AgentConfiguration } from "@/hooks/useAgentConfigurations";
import { useAIProviders } from "@/hooks/useAIProviders";
import ModelSelector from "./ModelSelector";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AgentConfigurationFormProps {
  configuration?: AgentConfiguration;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const AgentConfigurationForm = ({ configuration, onSave, onCancel, isLoading }: AgentConfigurationFormProps) => {
  const { validateConfiguration, getRecommendedModels } = useAIProviders();
  
  const [formData, setFormData] = useState({
    name: "",
    agent_type: "",
    prompt: "",
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 1000,
    is_active: true,
    webhook_url: "",
  });

  const [webhookError, setWebhookError] = useState("");

  useEffect(() => {
    if (configuration) {
      setFormData({
        name: configuration.name || "",
        agent_type: configuration.agent_type || "",
        prompt: configuration.prompt || "",
        model: configuration.model || "gpt-4o-mini",
        temperature: configuration.temperature || 0.7,
        max_tokens: configuration.max_tokens || 1000,
        is_active: configuration.is_active !== undefined ? configuration.is_active : true,
        webhook_url: configuration.webhook_url || "",
      });
    } else {
      const recommendedModels = getRecommendedModels();
      if (recommendedModels.length > 0) {
        setFormData(prev => ({ ...prev, model: recommendedModels[0] }));
      }
    }
  }, [configuration, getRecommendedModels]);

  const validateWebhookUrl = (url: string) => {
    if (!url.trim()) {
      setWebhookError("");
      return true;
    }

    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setWebhookError("A URL deve começar com http:// ou https://");
        return false;
      }
      setWebhookError("");
      return true;
    } catch (error) {
      setWebhookError("Formato de URL inválido");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started:', formData);
    
    // Validar campos obrigatórios
    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o agente.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agent_type.trim()) {
      toast({
        title: "Tipo obrigatório",
        description: "Por favor, selecione um tipo de agente.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.prompt.trim()) {
      toast({
        title: "Prompt obrigatório",
        description: "Por favor, insira um prompt para o agente.",
        variant: "destructive",
      });
      return;
    }

    // Validar webhook URL
    if (!validateWebhookUrl(formData.webhook_url)) {
      return;
    }
    
    if (!validateConfiguration(formData.model, formData.temperature, formData.max_tokens)) {
      return;
    }
    
    console.log('Form validation passed, calling onSave');
    onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    console.log(`Changing ${field} to:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'webhook_url') {
      validateWebhookUrl(value);
    }
  };

  const agentTypes = [
    { value: "atendimento", label: "Atendimento ao Cliente" },
    { value: "comercial", label: "Vendas/Comercial" },
    { value: "suporte_tecnico", label: "Suporte Técnico" },
    { value: "personalizado", label: "Personalizado" },
  ];

  const testWebhook = async () => {
    if (!formData.webhook_url.trim()) {
      toast({
        title: "URL necessária",
        description: "Configure a URL do webhook antes de testar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const testPayload = {
        test: true,
        agent_type: formData.agent_type,
        agent_name: formData.name,
        timestamp: new Date().toISOString(),
        message: "Teste de conexão com webhook n8n"
      };

      console.log('Testing webhook:', formData.webhook_url, testPayload);

      await fetch(formData.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(testPayload),
      });

      toast({
        title: "Teste enviado!",
        description: "Dados de teste enviados para o n8n. Verifique os logs no seu workflow.",
      });
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível enviar o teste. Verifique a URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {configuration ? "Editar Agente" : "Novo Agente"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Agente *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Agente de Atendimento"
                required
              />
            </div>

            <div>
              <Label htmlFor="agent_type">Tipo de Agente *</Label>
              <Select value={formData.agent_type} onValueChange={(value) => handleInputChange("agent_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="prompt">Prompt do Sistema *</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => handleInputChange("prompt", e.target.value)}
              placeholder="Descreva como o agente deve se comportar..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="webhook_url">URL do Webhook N8N</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={testWebhook}
                disabled={!formData.webhook_url.trim() || !!webhookError}
              >
                Testar Webhook
              </Button>
            </div>
            <Input
              id="webhook_url"
              type="url"
              value={formData.webhook_url}
              onChange={(e) => handleInputChange("webhook_url", e.target.value)}
              placeholder="https://seu-n8n.com/webhook/..."
              className={webhookError ? "border-red-500" : ""}
            />
            {webhookError && (
              <p className="text-sm text-red-500">{webhookError}</p>
            )}
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Como configurar o webhook n8n:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>No N8N, crie um novo workflow</li>
                    <li>Adicione um nó "Webhook" como trigger</li>
                    <li>Configure o método como POST</li>
                    <li>Copie a URL do webhook gerada</li>
                    <li>Cole a URL no campo acima</li>
                  </ol>
                  <div className="flex items-center gap-2 mt-2">
                    <ExternalLink className="h-3 w-3" />
                    <a 
                      href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Documentação do N8N Webhook
                    </a>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          <ModelSelector
            selectedModel={formData.model}
            onModelChange={(model) => handleInputChange("model", model)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Temperatura: {formData.temperature}</Label>
              <Slider
                value={[formData.temperature]}
                onValueChange={([value]) => handleInputChange("temperature", value)}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                0 = Mais preciso, 2 = Mais criativo
              </p>
            </div>

            <div>
              <Label htmlFor="max_tokens">Max Tokens</Label>
              <Input
                id="max_tokens"
                type="number"
                min="100"
                max="8000"
                value={formData.max_tokens}
                onChange={(e) => handleInputChange("max_tokens", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Limite de resposta (100-8000)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
            <Label htmlFor="is_active">Agente ativo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !!webhookError} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Salvando..." : (configuration ? "Atualizar Agente" : "Criar Agente")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgentConfigurationForm;

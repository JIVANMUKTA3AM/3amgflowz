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
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    model: "gpt-4.1-2025-04-14",
    temperature: 0.7,
    max_tokens: 1000,
    is_active: true,
    webhook_url: "",
  });

  useEffect(() => {
    if (configuration) {
      setFormData({
        name: configuration.name || "",
        agent_type: configuration.agent_type || "",
        prompt: configuration.prompt || "",
        model: configuration.model || "gpt-4.1-2025-04-14",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Dados do formulário sendo enviados:", formData);
    
    if (!validateConfiguration(formData.model, formData.temperature, formData.max_tokens)) {
      return;
    }
    
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    console.log(`Atualizando campo ${field} com valor:`, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log("Novo estado do formData:", newData);
      return newData;
    });
  };

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Webhook URL alterada para:", value);
    console.log("Event target value:", e.target.value);
    console.log("Event atual:", e);
    
    setFormData(prev => ({
      ...prev,
      webhook_url: value
    }));
  };

  const copyWebhookUrl = () => {
    if (formData.webhook_url) {
      navigator.clipboard.writeText(formData.webhook_url);
      toast({
        title: "Webhook URL copiada!",
        description: "A URL do webhook foi copiada para a área de transferência.",
      });
    }
  };

  const openWebhookUrl = () => {
    if (formData.webhook_url) {
      window.open(formData.webhook_url, '_blank');
    }
  };

  const agentTypes = [
    { value: "atendimento", label: "Atendimento ao Cliente" },
    { value: "comercial", label: "Vendas/Comercial" },
    { value: "suporte_tecnico", label: "Suporte Técnico" },
    { value: "personalizado", label: "Personalizado" },
  ];

  // Debug: log do estado atual
  console.log("Estado atual do webhook_url:", formData.webhook_url);

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
              <Label htmlFor="name">Nome do Agente</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Agente de Atendimento"
                required
              />
            </div>

            <div>
              <Label htmlFor="agent_type">Tipo de Agente</Label>
              <Select value={formData.agent_type} onValueChange={(value) => handleChange("agent_type", value)}>
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
            <Label htmlFor="prompt">Prompt do Sistema</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => handleChange("prompt", e.target.value)}
              placeholder="Descreva como o agente deve se comportar..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="webhook_url">Webhook URL do N8N</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  id="webhook_url"
                  type="text"
                  value={formData.webhook_url}
                  onChange={handleWebhookChange}
                  onInput={handleWebhookChange}
                  onPaste={(e) => {
                    console.log("Evento de paste detectado");
                    setTimeout(() => {
                      const target = e.target as HTMLInputElement;
                      console.log("Valor após paste:", target.value);
                      handleWebhookChange(e as any);
                    }, 0);
                  }}
                  placeholder="https://seu-n8n.com/webhook/seu-agente"
                  className="flex-1 px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                  style={{ minHeight: '40px' }}
                />
                {formData.webhook_url && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyWebhookUrl}
                      className="gap-1"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openWebhookUrl}
                      className="gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                URL do webhook do N8N que será chamado quando o agente receber uma mensagem
              </p>
              <div className="text-xs bg-yellow-50 p-2 rounded border border-yellow-200">
                <strong>Debug:</strong> Valor atual: "{formData.webhook_url}"
              </div>
            </div>
          </div>

          <ModelSelector
            selectedModel={formData.model}
            onModelChange={(model) => handleChange("model", model)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Temperatura: {formData.temperature}</Label>
              <Slider
                value={[formData.temperature]}
                onValueChange={([value]) => handleChange("temperature", value)}
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
                onChange={(e) => handleChange("max_tokens", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Limite de resposta
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange("is_active", checked)}
            />
            <Label htmlFor="is_active">Agente ativo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
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

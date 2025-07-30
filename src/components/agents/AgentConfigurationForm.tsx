
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
    
    if (!validateConfiguration(formData.model, formData.temperature, formData.max_tokens)) {
      return;
    }
    
    onSave(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const agentTypes = [
    { value: "atendimento", label: "Atendimento ao Cliente" },
    { value: "comercial", label: "Vendas/Comercial" },
    { value: "suporte_tecnico", label: "Suporte Técnico" },
    { value: "personalizado", label: "Personalizado" },
  ];

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
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Agente de Atendimento"
                required
              />
            </div>

            <div>
              <Label htmlFor="agent_type">Tipo de Agente</Label>
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
            <Label htmlFor="prompt">Prompt do Sistema</Label>
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
            <Label htmlFor="webhook_url">URL do Webhook N8N</Label>
            <Input
              id="webhook_url"
              type="text"
              value={formData.webhook_url}
              onChange={(e) => handleInputChange("webhook_url", e.target.value)}
              placeholder="Cole aqui a URL do seu webhook do N8N"
              className="w-full"
            />
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p><strong>Como configurar:</strong></p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>No N8N, crie um novo workflow</li>
                <li>Adicione um nó "Webhook" como trigger</li>
                <li>Copie a URL do webhook gerada</li>
                <li>Cole a URL no campo acima</li>
                <li>Salve este agente</li>
              </ol>
              <p className="mt-2 text-xs text-gray-500">
                A URL deve começar com https:// e terminar com um ID único
              </p>
            </div>
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
                Limite de resposta
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
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Salvando..." : "Salvar Agente"}
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

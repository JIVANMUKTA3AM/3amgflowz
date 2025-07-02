
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
  });

  useEffect(() => {
    if (configuration) {
      setFormData({
        name: configuration.name,
        agent_type: configuration.agent_type,
        prompt: configuration.prompt,
        model: configuration.model,
        temperature: configuration.temperature,
        max_tokens: configuration.max_tokens,
        is_active: configuration.is_active,
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

  const handleChange = (field: string, value: any) => {
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

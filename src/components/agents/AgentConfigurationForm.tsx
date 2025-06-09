
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentConfiguration } from "@/hooks/useAgentConfigurations";

interface AgentConfigurationFormProps {
  configuration?: AgentConfiguration;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const AgentConfigurationForm = ({ configuration, onSave, onCancel, isLoading }: AgentConfigurationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    agent_type: "",
    prompt: "",
    model: "gemini-1.5-flash",
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
    }
  }, [configuration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const geminiModels = [
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash (Rápido)" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro (Avançado)" },
    { value: "gemini-1.0-pro", label: "Gemini 1.0 Pro (Estável)" },
  ];

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
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="model">Modelo Gemini</Label>
              <Select value={formData.model} onValueChange={(value) => handleChange("model", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {geminiModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="temperature">Temperatura</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => handleChange("temperature", parseFloat(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">
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
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              className="rounded"
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

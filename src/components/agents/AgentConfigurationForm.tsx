
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AgentConfiguration } from "@/hooks/useAgentConfigurations";

interface AgentConfigurationFormProps {
  configuration?: AgentConfiguration;
  onSave: (config: Omit<AgentConfiguration, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const AgentConfigurationForm = ({ 
  configuration, 
  onSave, 
  onCancel, 
  isLoading 
}: AgentConfigurationFormProps) => {
  const [formData, setFormData] = useState({
    agent_type: configuration?.agent_type || 'atendimento',
    name: configuration?.name || '',
    prompt: configuration?.prompt || '',
    model: configuration?.model || 'gpt-3.5-turbo',
    temperature: configuration?.temperature || 0.7,
    max_tokens: configuration?.max_tokens || 1000,
    is_active: configuration?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const agentTypes = [
    { value: 'atendimento', label: 'Atendimento ao Cliente' },
    { value: 'comercial', label: 'Vendas/Comercial' },
    { value: 'suporte_tecnico', label: 'Suporte Técnico' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'recursos_humanos', label: 'Recursos Humanos' },
    { value: 'personalizado', label: 'Personalizado' },
  ];

  const models = [
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Rápido)' },
    { value: 'gpt-4', label: 'GPT-4 (Avançado)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Otimizado)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {configuration ? 'Editar Agente' : 'Novo Agente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent_type">Tipo do Agente</Label>
              <Select 
                value={formData.agent_type} 
                onValueChange={(value) => setFormData({ ...formData, agent_type: value })}
              >
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

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Agente</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Assistente de Vendas"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt do Sistema</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="Defina como o agente deve se comportar e responder..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Modelo de IA</Label>
              <Select 
                value={formData.model} 
                onValueChange={(value) => setFormData({ ...formData, model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modelo" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_tokens">Máximo de Tokens</Label>
              <Input
                id="max_tokens"
                type="number"
                value={formData.max_tokens}
                onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
                min={100}
                max={4000}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Temperatura: {formData.temperature}</Label>
              <Slider
                value={[formData.temperature]}
                onValueChange={([value]) => setFormData({ ...formData, temperature: value })}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Menor = mais consistente, Maior = mais criativo
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Agente Ativo</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AgentConfigurationForm;

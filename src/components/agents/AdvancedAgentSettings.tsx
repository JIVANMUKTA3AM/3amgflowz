
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, DollarSign, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AdvancedSettings {
  agentId: string;
  fineTuningParams: {
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    maxTokens: number;
  };
  costLimits: {
    dailyLimit: number;
    monthlyLimit: number;
    enableAlerts: boolean;
    alertThreshold: number;
  };
  promptTemplate: string;
  customInstructions: string;
}

interface AdvancedAgentSettingsProps {
  agentId: string;
  onSave: (settings: AdvancedSettings) => void;
  initialSettings?: AdvancedSettings;
}

const AdvancedAgentSettings = ({ agentId, onSave, initialSettings }: AdvancedAgentSettingsProps) => {
  const [settings, setSettings] = useState<AdvancedSettings>({
    agentId,
    fineTuningParams: {
      temperature: 0.7,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      maxTokens: 2000,
    },
    costLimits: {
      dailyLimit: 10.0,
      monthlyLimit: 100.0,
      enableAlerts: true,
      alertThreshold: 80,
    },
    promptTemplate: "default",
    customInstructions: "",
    ...initialSettings,
  });

  const promptTemplates = [
    { value: "default", label: "Padrão", description: "Template básico para conversas gerais" },
    { value: "customer_service", label: "Atendimento", description: "Focado em suporte ao cliente" },
    { value: "sales", label: "Vendas", description: "Orientado para conversão e vendas" },
    { value: "technical", label: "Técnico", description: "Suporte técnico especializado" },
    { value: "custom", label: "Personalizado", description: "Template customizado pelo usuário" },
  ];

  const handleSave = () => {
    onSave(settings);
    toast({
      title: "Configurações salvas!",
      description: "As configurações avançadas foram atualizadas com sucesso.",
    });
  };

  const updateFineTuning = (param: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      fineTuningParams: {
        ...prev.fineTuningParams,
        [param]: value,
      },
    }));
  };

  const updateCostLimits = (param: string, value: number | boolean) => {
    setSettings(prev => ({
      ...prev,
      costLimits: {
        ...prev.costLimits,
        [param]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Ajuste Fino de Parâmetros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ajuste Fino de Parâmetros
          </CardTitle>
          <CardDescription>
            Configure parâmetros avançados para personalizar o comportamento do agente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Temperatura: {settings.fineTuningParams.temperature}</Label>
                <Slider
                  value={[settings.fineTuningParams.temperature]}
                  onValueChange={(value) => updateFineTuning('temperature', value[0])}
                  min={0}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Controla a criatividade das respostas (0 = conservador, 2 = criativo)
                </p>
              </div>

              <div>
                <Label>Top P: {settings.fineTuningParams.topP}</Label>
                <Slider
                  value={[settings.fineTuningParams.topP]}
                  onValueChange={(value) => updateFineTuning('topP', value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Controla a diversidade do vocabulário
                </p>
              </div>

              <div>
                <Label>Max Tokens: {settings.fineTuningParams.maxTokens}</Label>
                <Slider
                  value={[settings.fineTuningParams.maxTokens]}
                  onValueChange={(value) => updateFineTuning('maxTokens', value[0])}
                  min={100}
                  max={8000}
                  step={100}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Limite máximo de tokens por resposta
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Frequency Penalty: {settings.fineTuningParams.frequencyPenalty}</Label>
                <Slider
                  value={[settings.fineTuningParams.frequencyPenalty]}
                  onValueChange={(value) => updateFineTuning('frequencyPenalty', value[0])}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Penaliza repetições de palavras frequentes
                </p>
              </div>

              <div>
                <Label>Presence Penalty: {settings.fineTuningParams.presencePenalty}</Label>
                <Slider
                  value={[settings.fineTuningParams.presencePenalty]}
                  onValueChange={(value) => updateFineTuning('presencePenalty', value[0])}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Encoraja novos tópicos na conversa
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates de Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Templates de Prompts
          </CardTitle>
          <CardDescription>
            Escolha ou personalize templates de prompts pré-definidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="template-select">Template Base</Label>
            <Select value={settings.promptTemplate} onValueChange={(value) => setSettings(prev => ({ ...prev, promptTemplate: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {promptTemplates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    <div>
                      <div className="font-medium">{template.label}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {settings.promptTemplate === 'custom' && (
            <div>
              <Label htmlFor="custom-instructions">Instruções Personalizadas</Label>
              <Textarea
                id="custom-instructions"
                value={settings.customInstructions}
                onChange={(e) => setSettings(prev => ({ ...prev, customInstructions: e.target.value }))}
                placeholder="Digite suas instruções personalizadas para o agente..."
                rows={6}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Variável: {"{user_name}"}</Badge>
            <Badge variant="outline">Variável: {"{company_name}"}</Badge>
            <Badge variant="outline">Variável: {"{current_time}"}</Badge>
            <Badge variant="outline">Variável: {"{user_history}"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Controle de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Controle de Custos
          </CardTitle>
          <CardDescription>
            Configure limites de gastos e alertas para este agente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="daily-limit">Limite Diário ($)</Label>
              <Input
                id="daily-limit"
                type="number"
                value={settings.costLimits.dailyLimit}
                onChange={(e) => updateCostLimits('dailyLimit', parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="monthly-limit">Limite Mensal ($)</Label>
              <Input
                id="monthly-limit"
                type="number"
                value={settings.costLimits.monthlyLimit}
                onChange={(e) => updateCostLimits('monthlyLimit', parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Alertas de Custo</Label>
              <p className="text-sm text-gray-500">Receber notificações quando atingir limites</p>
            </div>
            <Switch
              checked={settings.costLimits.enableAlerts}
              onCheckedChange={(checked) => updateCostLimits('enableAlerts', checked)}
            />
          </div>

          {settings.costLimits.enableAlerts && (
            <div>
              <Label>Limite de Alerta (%): {settings.costLimits.alertThreshold}%</Label>
              <Slider
                value={[settings.costLimits.alertThreshold]}
                onValueChange={(value) => updateCostLimits('alertThreshold', value[0])}
                min={50}
                max={95}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Será alertado quando atingir esta porcentagem do limite
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default AdvancedAgentSettings;

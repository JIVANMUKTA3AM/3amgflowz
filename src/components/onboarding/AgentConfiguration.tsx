
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Users, Bot, MessageCircle } from "lucide-react";

interface AgentConfigurationProps {
  selectedServices: string[];
  agentConfigs: any;
  onUpdate: (configs: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AgentConfiguration = ({ selectedServices, agentConfigs, onUpdate, onNext, onPrevious }: AgentConfigurationProps) => {
  const [configs, setConfigs] = useState(agentConfigs);
  const [currentAgent, setCurrentAgent] = useState(0);

  const agentTemplates = {
    atendimento: {
      name: "Assistente de Atendimento",
      icon: Users,
      defaultPrompt: "Você é um assistente de atendimento ao cliente especializado em provedores de internet. Seja sempre cordial, prestativo e objetivo. Ajude com dúvidas sobre planos, faturas, problemas de conexão e direcionamento para setores específicos.",
      examples: [
        "Como posso ajudar com sua fatura?",
        "Vamos resolver seu problema de conexão",
        "Posso te ajudar a escolher o melhor plano"
      ]
    },
    tecnico: {
      name: "Suporte Técnico",
      icon: Bot,
      defaultPrompt: "Você é um especialista em suporte técnico para provedores de internet. Resolva problemas de conexão, configuração de equipamentos, diagnósticos de rede e orientações técnicas. Use linguagem clara e passo-a-passo.",
      examples: [
        "Vamos verificar sua conexão passo a passo",
        "Preciso de algumas informações sobre seu equipamento",
        "Vou te ajudar a configurar o Wi-Fi"
      ]
    },
    comercial: {
      name: "Agente Comercial", 
      icon: MessageCircle,
      defaultPrompt: "Você é um consultor comercial especializado em vendas de internet. Qualifique leads, apresente planos adequados ao perfil do cliente, esclareça dúvidas comerciais e agende visitas técnicas quando necessário.",
      examples: [
        "Qual seria o plano ideal para você?",
        "Posso apresentar nossa promoção especial",
        "Vamos agendar uma visita técnica?"
      ]
    }
  };

  const handleConfigChange = (field: string, value: any) => {
    const serviceId = selectedServices[currentAgent];
    const newConfigs = {
      ...configs,
      [serviceId]: {
        ...configs[serviceId],
        [field]: value
      }
    };
    setConfigs(newConfigs);
  };

  const handleNext = () => {
    // Validar configurações antes de prosseguir
    const allConfigured = selectedServices.every(serviceId => {
      const config = configs[serviceId];
      return config?.name && config?.prompt;
    });

    if (!allConfigured) {
      alert("Por favor, configure todos os agentes selecionados.");
      return;
    }

    onUpdate(configs);
    onNext();
  };

  const currentServiceId = selectedServices[currentAgent];
  const currentTemplate = agentTemplates[currentServiceId as keyof typeof agentTemplates];
  const currentConfig = configs[currentServiceId] || {};

  // Inicializar com valores padrão se não existir
  if (!configs[currentServiceId]) {
    setConfigs({
      ...configs,
      [currentServiceId]: {
        name: currentTemplate?.name || '',
        prompt: currentTemplate?.defaultPrompt || '',
        model: 'gpt-4o-mini',
        temperature: 0.7
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Configure seus Agentes</CardTitle>
          <p className="text-center text-gray-600">
            Personalize como cada agente deve se comportar e responder
          </p>
          
          {selectedServices.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {selectedServices.map((serviceId, index) => (
                <Button
                  key={serviceId}
                  variant={currentAgent === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentAgent(index)}
                >
                  {agentTemplates[serviceId as keyof typeof agentTemplates]?.name}
                </Button>
              ))}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {currentTemplate && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <currentTemplate.icon className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">{currentTemplate.name}</h3>
                  <p className="text-sm text-blue-700">Configure este agente conforme sua necessidade</p>
                </div>
              </div>

              <div className="grid gap-6">
                <div>
                  <Label htmlFor="agentName">Nome do Agente</Label>
                  <Input
                    id="agentName"
                    value={currentConfig.name || currentTemplate.name}
                    onChange={(e) => handleConfigChange('name', e.target.value)}
                    placeholder="Nome que será exibido para os clientes"
                  />
                </div>

                <div>
                  <Label htmlFor="agentPrompt">Instruções do Agente</Label>
                  <Textarea
                    id="agentPrompt"
                    value={currentConfig.prompt || currentTemplate.defaultPrompt}
                    onChange={(e) => handleConfigChange('prompt', e.target.value)}
                    rows={6}
                    placeholder="Como o agente deve se comportar..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Descreva como o agente deve responder e se comportar com os clientes
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="model">Modelo de IA</Label>
                    <Select 
                      value={currentConfig.model || 'gpt-4o-mini'} 
                      onValueChange={(value) => handleConfigChange('model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o-mini">GPT-4 Omni Mini (Rápido)</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4 Omni (Poderoso)</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Econômico)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="temperature">Criatividade</Label>
                    <Select 
                      value={String(currentConfig.temperature || 0.7)} 
                      onValueChange={(value) => handleConfigChange('temperature', parseFloat(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.3">Mais Preciso</SelectItem>
                        <SelectItem value="0.7">Balanceado</SelectItem>
                        <SelectItem value="1.0">Mais Criativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Exemplos de respostas:</h4>
                  <div className="space-y-2">
                    {currentTemplate.examples.map((example, index) => (
                      <div key={index} className="text-sm text-gray-600 italic">
                        "#{example}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onPrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <Button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentConfiguration;

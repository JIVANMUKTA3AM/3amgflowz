
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Users, Bot, MessageCircle, Sparkles, Settings, Zap } from "lucide-react";

interface AgentConfigurationProps {
  selectedServices: string[];
  agentConfigs: any;
  onUpdate: (configs: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AgentConfiguration = ({ selectedServices, agentConfigs, onUpdate, onNext, onPrevious }: AgentConfigurationProps) => {
  const [configs, setConfigs] = useState(agentConfigs || {});
  const [currentAgent, setCurrentAgent] = useState(0);

  console.log('AgentConfiguration - selectedServices:', selectedServices);
  console.log('AgentConfiguration - agentConfigs:', agentConfigs);

  const agentTemplates = {
    atendimento: {
      name: "Assistente de Atendimento",
      icon: Users,
      defaultPrompt: "Você é um assistente de atendimento ao cliente especializado em provedores de internet. Seja sempre cordial, prestativo e objetivo. Ajude com dúvidas sobre planos, faturas, problemas de conexão e direcionamento para setores específicos.",
      examples: [
        "Como posso ajudar com sua fatura?",
        "Vamos resolver seu problema de conexão",
        "Posso te ajudar a escolher o melhor plano"
      ],
      gradient: 'from-purple-400 to-purple-600'
    },
    comercial: {
      name: "Agente Comercial", 
      icon: MessageCircle,
      defaultPrompt: "Você é um consultor comercial especializado em vendas de internet. Qualifique leads, apresente planos adequados ao perfil do cliente, esclareça dúvidas comerciais e agende visitas técnicas quando necessário.",
      examples: [
        "Qual seria o plano ideal para você?",
        "Posso apresentar nossa promoção especial",
        "Vamos agendar uma visita técnica?"
      ],
      gradient: 'from-indigo-400 to-indigo-600'
    },
    suporte_tecnico: {
      name: "Suporte Técnico",
      icon: Bot,
      defaultPrompt: "Você é um especialista em suporte técnico para provedores de internet. Resolva problemas de conexão, configuração de equipamentos, diagnósticos de rede e orientações técnicas. Use linguagem clara e passo-a-passo.",
      examples: [
        "Vamos verificar sua conexão passo a passo",
        "Preciso de algumas informações sobre seu equipamento",
        "Vou te ajudar a configurar o Wi-Fi"
      ],
      gradient: 'from-blue-400 to-cyan-500'
    }
  };

  // Filtrar apenas serviços de agentes válidos
  const validAgentServices = selectedServices.filter(service => 
    service in agentTemplates
  );

  console.log('Valid agent services:', validAgentServices);

  // Inicializar configurações na montagem do componente
  useEffect(() => {
    const initialConfigs = { ...configs };
    let hasChanges = false;

    validAgentServices.forEach(serviceId => {
      if (!initialConfigs[serviceId]) {
        const template = agentTemplates[serviceId as keyof typeof agentTemplates];
        initialConfigs[serviceId] = {
          name: template?.name || '',
          prompt: template?.defaultPrompt || '',
          model: 'gpt-4o-mini',
          temperature: 0.7
        };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setConfigs(initialConfigs);
    }
  }, [validAgentServices]);

  // Garantir que currentAgent não seja maior que o número de serviços
  useEffect(() => {
    if (currentAgent >= validAgentServices.length && validAgentServices.length > 0) {
      setCurrentAgent(0);
    }
  }, [validAgentServices.length, currentAgent]);

  const handleConfigChange = (field: string, value: any) => {
    if (validAgentServices.length === 0) return;
    
    const serviceId = validAgentServices[currentAgent];
    if (!serviceId) return;

    const newConfigs = {
      ...configs,
      [serviceId]: {
        ...configs[serviceId],
        [field]: value
      }
    };
    setConfigs(newConfigs);
    console.log('Updated configs:', newConfigs);
  };

  const handleNext = () => {
    console.log('Attempting to proceed with configs:', configs);
    
    // Validação mais flexível - só precisa ter nome e prompt básicos
    const configuredServices = validAgentServices.filter(serviceId => {
      const config = configs[serviceId];
      return config && config.name && config.prompt;
    });

    console.log('Configured services:', configuredServices);
    console.log('Valid agent services:', validAgentServices);

    if (configuredServices.length !== validAgentServices.length) {
      alert(`Por favor, configure todos os agentes selecionados. Configurados: ${configuredServices.length}, Necessários: ${validAgentServices.length}`);
      return;
    }

    onUpdate(configs);
    onNext();
  };

  // Se não há serviços de agentes válidos, pular esta etapa
  if (validAgentServices.length === 0) {
    console.log('No valid agent services, proceeding to next step');
    onNext();
    return null;
  }

  const currentServiceId = validAgentServices[currentAgent];
  const currentTemplate = agentTemplates[currentServiceId as keyof typeof agentTemplates];
  const currentConfig = configs[currentServiceId] || {};

  if (!currentTemplate) {
    console.error('No template found for service:', currentServiceId);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <div>
              <CardTitle className="text-3xl font-bold">
                Configure seus Agentes
              </CardTitle>
              <p className="text-purple-100 mt-2">
                Personalize como cada agente do <span className="font-bold text-yellow-300">3AMG FLOWS</span> deve se comportar e responder
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {validAgentServices.length > 1 && (
            <div className="flex justify-center gap-2">
              {validAgentServices.map((serviceId, index) => (
                <Button
                  key={serviceId}
                  variant={currentAgent === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentAgent(index)}
                  className={`transition-all duration-300 ${
                    currentAgent === index 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
                  }`}
                >
                  {agentTemplates[serviceId as keyof typeof agentTemplates]?.name}
                </Button>
              ))}
            </div>
          )}

          <div className="space-y-8">
            <div className={`flex items-center gap-4 p-6 bg-gradient-to-r ${currentTemplate.gradient} rounded-2xl shadow-xl`}>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <currentTemplate.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h3 className="text-2xl font-bold">{currentTemplate.name}</h3>
                <p className="text-white/90 mt-1">Configure este agente conforme sua necessidade</p>
              </div>
            </div>

            <div className="grid gap-8">
              <Card className="border-2 border-purple-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Settings className="w-5 h-5" />
                    Configurações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <Label htmlFor="agentName" className="text-lg font-semibold text-gray-700">Nome do Agente</Label>
                    <Input
                      id="agentName"
                      value={currentConfig.name || currentTemplate.name}
                      onChange={(e) => handleConfigChange('name', e.target.value)}
                      placeholder="Nome que será exibido para os clientes"
                      className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="model" className="text-lg font-semibold text-gray-700">Modelo de IA</Label>
                      <Select 
                        value={currentConfig.model || 'gpt-4o-mini'} 
                        onValueChange={(value) => handleConfigChange('model', value)}
                      >
                        <SelectTrigger className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl p-4">
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
                      <Label htmlFor="temperature" className="text-lg font-semibold text-gray-700">Criatividade</Label>
                      <Select 
                        value={String(currentConfig.temperature || 0.7)} 
                        onValueChange={(value) => handleConfigChange('temperature', parseFloat(value))}
                      >
                        <SelectTrigger className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl p-4">
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
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Zap className="w-5 h-5" />
                    Personalidade e Comportamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div>
                    <Label htmlFor="agentPrompt" className="text-lg font-semibold text-gray-700">Instruções do Agente</Label>
                    <Textarea
                      id="agentPrompt"
                      value={currentConfig.prompt || currentTemplate.defaultPrompt}
                      onChange={(e) => handleConfigChange('prompt', e.target.value)}
                      rows={6}
                      placeholder="Como o agente deve se comportar..."
                      className="mt-2 border-2 border-blue-200 focus:border-blue-400 rounded-xl text-base p-4"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Descreva como o agente deve responder e se comportar com os clientes
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <MessageCircle className="w-5 h-5" />
                    Exemplos de Respostas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {currentTemplate.examples.map((example, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-green-800 italic">"{example}"</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Agente {currentAgent + 1} de {validAgentServices.length}
              </p>
            </div>
            
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentConfiguration;

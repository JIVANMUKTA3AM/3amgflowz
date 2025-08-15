
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, MessageCircle, Send, Users, Headphones, Wrench, Sparkles, Network } from "lucide-react";

interface ServiceSelectionProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ServiceSelection = ({ selectedServices, onServicesChange, onNext, onPrevious }: ServiceSelectionProps) => {
  const services = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Receba e responda mensagens do WhatsApp automaticamente',
      icon: <MessageCircle className="w-8 h-8 text-white" />,
      popular: true,
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Configure um bot no Telegram para atendimento automático',
      icon: <Send className="w-8 h-8 text-white" />,
      popular: true,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'olt',
      name: 'Monitoramento OLT',
      description: 'Configure OLTs para diagnósticos automáticos e suporte técnico',
      icon: <Network className="w-8 h-8 text-white" />,
      popular: false,
      gradient: 'from-cyan-500 to-cyan-600'
    }
  ];

  const agents = [
    {
      id: 'atendimento',
      name: 'Atendimento Geral',
      description: 'Atendimento ao cliente, dúvidas gerais e direcionamento',
      icon: <Users className="w-8 h-8 text-white" />,
      popular: true,
      gradient: 'from-3amg-orange to-orange-600'
    },
    {
      id: 'comercial',
      name: 'Comercial',
      description: 'Vendas, propostas e negociação de planos',
      icon: <Headphones className="w-8 h-8 text-white" />,
      popular: true,
      gradient: 'from-3amg-orange to-orange-600'
    },
    {
      id: 'suporte_tecnico',
      name: 'Suporte Técnico',
      description: 'Suporte técnico e resolução de problemas',
      icon: <Wrench className="w-8 h-8 text-white" />,
      popular: false,
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      onServicesChange(selectedServices.filter(id => id !== serviceId));
    } else {
      onServicesChange([...selectedServices, serviceId]);
    }
  };

  return (
    <div className="min-h-screen bg-3amg-dark p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-gray-900/90 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-3amg-orange to-orange-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <div>
              <CardTitle className="text-3xl font-bold">
                Configure sua Automação Inteligente
              </CardTitle>
              <p className="text-orange-100 mt-2">
                Bem-vindo ao <span className="font-bold text-yellow-300">3AMG FLOWS</span> - Selecione os canais e agentes que irão revolucionar seu atendimento
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-10 bg-gray-900/50">
          {/* Canais de Comunicação */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-3amg-orange to-orange-400 bg-clip-text text-transparent mb-2">
                Canais de Comunicação
              </h3>
              <p className="text-gray-300">Escolha onde seus clientes poderão falar com você</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    selectedServices.includes(service.id)
                      ? 'border-3amg-orange bg-gradient-to-br from-orange-900/20 to-gray-800/50 shadow-lg'
                      : 'border-gray-700 hover:border-3amg-orange bg-gray-800/50 hover:bg-gradient-to-br hover:from-orange-900/10 hover:to-gray-800/50'
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className={`bg-gradient-to-r ${service.gradient} text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg`}>
                        Popular ⭐
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${service.gradient} shadow-lg`}>
                          {service.icon}
                        </div>
                        <h4 className="font-bold text-lg text-white">{service.name}</h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tipos de Agentes */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-3amg-orange to-orange-400 bg-clip-text text-transparent mb-2">
                Agentes Inteligentes
              </h3>
              <p className="text-gray-300">Selecione os tipos de atendimento automatizado</p>
            </div>
            
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedServices.includes(agent.id)
                      ? 'border-3amg-orange bg-gradient-to-r from-orange-900/20 to-gray-800/50 shadow-lg'
                      : 'border-gray-700 hover:border-3amg-orange bg-gray-800/50 hover:bg-gradient-to-r hover:from-orange-900/10 hover:to-gray-800/50'
                  }`}
                  onClick={() => handleServiceToggle(agent.id)}
                >
                  {agent.popular && (
                    <div className="absolute top-4 right-4">
                      <span className={`bg-gradient-to-r ${agent.gradient} text-white text-xs px-2 py-1 rounded-full font-semibold`}>
                        Recomendado
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedServices.includes(agent.id)}
                      onChange={() => handleServiceToggle(agent.id)}
                    />
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${agent.gradient} shadow-lg`}>
                      {agent.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-white mb-2">{agent.name}</h4>
                      <p className="text-gray-300 leading-relaxed">{agent.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-gray-700">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:bg-gray-800 border-gray-600 text-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                {selectedServices.length} {selectedServices.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
            </div>
            
            <Button 
              onClick={onNext}
              disabled={selectedServices.length === 0}
              className="bg-gradient-to-r from-3amg-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
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

export default ServiceSelection;

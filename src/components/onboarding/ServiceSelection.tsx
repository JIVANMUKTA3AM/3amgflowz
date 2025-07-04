
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, MessageCircle, Send, Users, Headphones, Wrench, Sparkles } from "lucide-react";

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
      icon: <MessageCircle className="w-8 h-8 text-green-500" />,
      popular: true,
      gradient: 'from-green-400 to-green-600'
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Configure um bot no Telegram para atendimento automático',
      icon: <Send className="w-8 h-8 text-blue-500" />,
      popular: true,
      gradient: 'from-blue-400 to-blue-600'
    }
  ];

  const agents = [
    {
      id: 'atendimento',
      name: 'Atendimento Geral',
      description: 'Atendimento ao cliente, dúvidas gerais e direcionamento',
      icon: <Users className="w-8 h-8 text-purple-500" />,
      popular: true,
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      id: 'comercial',
      name: 'Comercial',
      description: 'Vendas, propostas e negociação de planos',
      icon: <Headphones className="w-8 h-8 text-indigo-500" />,
      popular: true,
      gradient: 'from-indigo-400 to-indigo-600'
    },
    {
      id: 'suporte_tecnico',
      name: 'Suporte Técnico',
      description: 'Suporte técnico e resolução de problemas',
      icon: <Wrench className="w-8 h-8 text-blue-500" />,
      popular: false,
      gradient: 'from-blue-400 to-cyan-500'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <div>
              <CardTitle className="text-3xl font-bold">
                Configure sua Automação Inteligente
              </CardTitle>
              <p className="text-purple-100 mt-2">
                Selecione os canais e agentes que irão revolucionar seu atendimento
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-10">
          {/* Canais de Comunicação */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Canais de Comunicação
              </h3>
              <p className="text-gray-600">Escolha onde seus clientes poderão falar com você</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    selectedServices.includes(service.id)
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-gradient-to-br hover:from-purple-25 hover:to-blue-25'
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
                        <h4 className="font-bold text-lg text-gray-800">{service.name}</h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tipos de Agentes */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Agentes Inteligentes
              </h3>
              <p className="text-gray-600">Selecione os tipos de atendimento automatizado</p>
            </div>
            
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedServices.includes(agent.id)
                      ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 bg-white hover:bg-gradient-to-r hover:from-purple-25 hover:to-blue-25'
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
                      <h4 className="font-bold text-xl text-gray-800 mb-2">{agent.name}</h4>
                      <p className="text-gray-600 leading-relaxed">{agent.description}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                {selectedServices.length} {selectedServices.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
            </div>
            
            <Button 
              onClick={onNext}
              disabled={selectedServices.length === 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
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

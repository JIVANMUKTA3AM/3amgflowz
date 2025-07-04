
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, MessageCircle, Users, Webhook, Send, Database } from "lucide-react";

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
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      popular: true
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Configure um bot no Telegram para atendimento automático',
      icon: <Send className="w-8 h-8 text-blue-600" />,
      popular: true
    },
    {
      id: 'crm',
      name: 'CRM Integrado',
      description: 'Use nosso CRM interno ou conecte com seu CRM externo',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      popular: false
    },
    {
      id: 'webhook',
      name: 'Webhooks Personalizados',
      description: 'Conecte com qualquer sistema através de webhooks',
      icon: <Webhook className="w-8 h-8 text-orange-600" />,
      popular: false
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
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-purple">
          Selecione os Serviços
        </CardTitle>
        <p className="text-gray-600">
          Escolha quais integrações você gostaria de configurar
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedServices.includes(service.id)
                  ? 'border-3amg-purple bg-gradient-to-br from-3amg-purple/5 to-3amg-blue/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleServiceToggle(service.id)}
            >
              {service.popular && (
                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-3amg text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedServices.includes(service.id)}
                  onChange={() => handleServiceToggle(service.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {service.icon}
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedServices.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-800">CRM Interno Incluído</h4>
            </div>
            <p className="text-sm text-blue-700">
              Seu sistema já inclui um CRM completo com todas as funcionalidades:
              gestão de leads, tickets de suporte, propostas comerciais e histórico de conversas.
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <Button 
            onClick={onPrevious}
            variant="outline"
            className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button 
            onClick={onNext}
            disabled={selectedServices.length === 0}
            className="bg-gradient-3amg hover:opacity-90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelection;

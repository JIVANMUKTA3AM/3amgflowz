
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Users, Router, Webhook, ArrowRight } from "lucide-react";

interface ServiceSelectionProps {
  selectedServices: string[];
  onUpdate: (services: string[]) => void;
  onNext: () => void;
}

const ServiceSelection = ({ selectedServices, onUpdate, onNext }: ServiceSelectionProps) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedServices);

  const services = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Atendimento automatizado via WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      features: ['Mensagens automáticas', 'Chatbot inteligente', 'Integração com CRM']
    },
    {
      id: 'crm',
      name: 'CRM Integration',
      description: 'Conecte com Pipedrive, RD Station e outros',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      features: ['Sincronização de leads', 'Automação de vendas', 'Relatórios avançados']
    },
    {
      id: 'olt',
      name: 'OLT Management',
      description: 'Gestão automática de OLTs',
      icon: Router,
      color: 'from-purple-500 to-purple-600',
      features: ['Monitoramento 24/7', 'Alertas automáticos', 'Múltiplas OLTs']
    },
    {
      id: 'webhook',
      name: 'Webhooks & APIs',
      description: 'Integrações customizadas',
      icon: Webhook,
      color: 'from-orange-500 to-orange-600',
      features: ['APIs REST', 'Webhooks personalizados', 'Integrações customizadas']
    }
  ];

  const handleServiceToggle = (serviceId: string) => {
    const updated = localSelected.includes(serviceId)
      ? localSelected.filter(id => id !== serviceId)
      : [...localSelected, serviceId];
    setLocalSelected(updated);
  };

  const handleNext = () => {
    onUpdate(localSelected);
    onNext();
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-purple">
          Escolha os Serviços que Deseja Ativar
        </CardTitle>
        <p className="text-gray-600">
          Selecione os serviços que você gostaria de configurar. Você pode adicionar mais serviços depois.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = localSelected.includes(service.id);
            
            return (
              <div
                key={service.id}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected 
                    ? 'border-3amg-purple bg-gradient-to-br from-3amg-purple/5 to-3amg-blue/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleServiceToggle(service.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-3amg-purple"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleNext}
            disabled={localSelected.length === 0}
            className="bg-gradient-3amg hover:opacity-90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
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

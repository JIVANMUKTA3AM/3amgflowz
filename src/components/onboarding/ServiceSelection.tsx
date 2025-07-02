
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, Users, Bot } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ServiceSelectionProps {
  selectedServices: string[];
  onUpdate: (services: string[]) => void;
  onNext: () => void;
}

const ServiceSelection = ({ selectedServices, onUpdate, onNext }: ServiceSelectionProps) => {
  const [selected, setSelected] = useState<string[]>(selectedServices);

  const services = [
    {
      id: "atendimento",
      name: "Agente de Atendimento",
      description: "Atendimento geral ao cliente via chat, com respostas inteligentes e redirecionamento",
      icon: Users,
      features: ["Respostas automáticas", "Classificação de tickets", "Horário comercial", "Base de conhecimento"],
      recommended: true
    },
    {
      id: "tecnico", 
      name: "Suporte Técnico",
      description: "Agente especializado em resolver problemas técnicos e configurações",
      icon: Bot,
      features: ["Diagnósticos automatizados", "Scripts de solução", "Escalação inteligente", "Documentação técnica"],
      recommended: true
    },
    {
      id: "comercial",
      name: "Agente Comercial",
      description: "Vendas e qualificação de leads com foco em conversão",
      icon: MessageCircle,
      features: ["Qualificação de leads", "Apresentação de planos", "Agendamento", "Follow-up automático"],
      recommended: false
    }
  ];

  const handleServiceToggle = (serviceId: string) => {
    const newSelected = selected.includes(serviceId)
      ? selected.filter(id => id !== serviceId)
      : [...selected, serviceId];
    setSelected(newSelected);
  };

  const handleNext = () => {
    onUpdate(selected);
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Selecione os Agentes que deseja ativar</CardTitle>
          <p className="text-center text-gray-600">
            Você pode ativar quantos agentes precisar. Todos estão inclusos no seu plano.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              const isSelected = selected.includes(service.id);
              
              return (
                <div
                  key={service.id}
                  className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  {service.recommended && (
                    <div className="absolute -top-2 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Recomendado
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleServiceToggle(service.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, index) => (
                          <div key={index} className="text-sm text-gray-500 flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              onClick={handleNext}
              disabled={selected.length === 0}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continuar com {selected.length} agente{selected.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceSelection;

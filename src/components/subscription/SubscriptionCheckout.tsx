
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Crown, Loader2, Users } from "lucide-react";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";
import { useSubscriptionQuotas } from "@/hooks/useSubscriptionQuotas";
import { getPlanBySubscribers, getSubscriberRange } from "@/types/subscription";

interface SubscriptionCheckoutProps {
  selectedPlan?: string;
  onPlanSelect?: (planType: string) => void;
  showCurrentPlan?: boolean;
  subscriberCount?: number;
}

const SubscriptionCheckout = ({ 
  selectedPlan, 
  onPlanSelect, 
  showCurrentPlan = true,
  subscriberCount = 0
}: SubscriptionCheckoutProps) => {
  const { subscription, createCheckout, isCreatingCheckout } = useSubscriptionManagement();
  const { currentPlan } = useSubscriptionQuotas();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const isCurrentPlan = (planType: string) => {
    return subscription?.plan_type === planType || currentPlan === planType;
  };

  const handleSubscribe = async (planType: string) => {
    if (isCurrentPlan(planType)) return;
    
    setProcessingPlan(planType);
    try {
      if (onPlanSelect) {
        onPlanSelect(planType);
      } else {
        await createCheckout(planType);
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  const plans = [
    {
      id: 'free',
      type: 'free',
      name: 'Gratuito',
      description: 'Para testar a plataforma',
      price: 0,
      subscriberRange: '0 assinantes',
      features: [
        'Acesso limitado à plataforma',
        'Suporte básico por email',
        'Documentação completa'
      ]
    },
    {
      id: 'flow_start',
      type: 'flow_start',
      name: 'Flow Start',
      description: 'Até 1.000 clientes',
      price: 19900,
      subscriberRange: '1 - 1.000 assinantes',
      features: [
        'Até 1.000 clientes',
        'Agentes básicos',
        'Suporte por email',
        'Integrações básicas',
        'Dashboard básico'
      ]
    },
    {
      id: 'flow_pro',
      type: 'flow_pro',
      name: 'Flow Pro',
      description: '1.001 a 3.000 clientes',
      price: 49900,
      subscriberRange: '1.001 - 3.000 assinantes',
      features: [
        '1.001 a 3.000 clientes',
        'Todos os agentes',
        'Suporte prioritário',
        'Integrações avançadas',
        'Analytics básicos',
        'Relatórios mensais'
      ],
      popular: true
    },
    {
      id: 'flow_power',
      type: 'flow_power',
      name: 'Flow Power',
      description: '3.001 a 10.000 clientes',
      price: 89900,
      subscriberRange: '3.001 - 10.000 assinantes',
      features: [
        '3.001 a 10.000 clientes',
        'Todos os agentes',
        'Suporte 24/7',
        'Integrações ilimitadas',
        'Analytics avançados',
        'Relatórios customizados',
        'API completa'
      ]
    },
    {
      id: 'flow_enterprise',
      type: 'flow_enterprise',
      name: 'Flow Enterprise',
      description: '10.001 a 30.000 clientes',
      price: 149700,
      subscriberRange: '10.001 - 30.000 assinantes',
      features: [
        '10.001 a 30.000 clientes',
        'Todos os agentes',
        'Suporte dedicado',
        'Integrações customizadas',
        'Analytics completos',
        'API completa',
        'White label',
        'Gerente de conta'
      ]
    },
    {
      id: 'flow_ultra',
      type: 'flow_ultra',
      name: 'Flow Ultra',
      description: 'Acima de 30.000 clientes',
      price: 0,
      subscriberRange: '30.000+ assinantes',
      features: [
        'Acima de 30.000 clientes',
        'Solução customizada',
        'Gerente dedicado',
        'Infraestrutura dedicada',
        'SLA garantido',
        'Suporte 24/7 premium',
        'Implementação personalizada'
      ],
      isCustom: true
    }
  ];

  const recommendedPlan = subscriberCount > 0 ? getPlanBySubscribers(subscriberCount) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Escolha seu Plano Flow
        </h2>
        <p className="text-gray-600 mb-4">
          Planos baseados no número de assinantes do seu provedor
        </p>
        {subscriberCount > 0 && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Users className="h-4 w-4" />
            <span className="font-medium">
              {subscriberCount.toLocaleString()} assinantes detectados
            </span>
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all hover:shadow-lg ${
              plan.popular ? 'border-blue-500 border-2 shadow-md scale-105' : ''
            } ${
              isCurrentPlan(plan.type) ? 'border-green-500 border-2' : ''
            } ${
              selectedPlan === plan.type ? 'ring-2 ring-blue-500' : ''
            } ${
              recommendedPlan === plan.type ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                <Crown className="w-3 h-3 mr-1" />
                Mais Popular
              </Badge>
            )}
            
            {recommendedPlan === plan.type && !plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500">
                <Users className="w-3 h-3 mr-1" />
                Recomendado
              </Badge>
            )}
            
            {isCurrentPlan(plan.type) && showCurrentPlan && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                <Check className="w-3 h-3 mr-1" />
                Seu Plano
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
              <div className="text-sm text-gray-500 mb-2">{plan.subscriberRange}</div>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {plan.isCustom ? 'Sob consulta' : plan.price === 0 ? 'Grátis' : `R$ ${(plan.price / 100).toFixed(0)}`}
                </span>
                {plan.price > 0 && !plan.isCustom && (
                  <span className="text-gray-500">/mês</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Separator className="mb-4" />
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleSubscribe(plan.type)}
                className="w-full"
                variant={isCurrentPlan(plan.type) ? "outline" : "default"}
                disabled={
                  isCurrentPlan(plan.type) || 
                  processingPlan === plan.type || 
                  isCreatingCheckout
                }
              >
                {processingPlan === plan.type ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processando...
                  </>
                ) : isCurrentPlan(plan.type) ? (
                  "Plano Atual"
                ) : plan.isCustom ? (
                  "Entrar em Contato"
                ) : plan.price === 0 ? (
                  "Começar Grátis"
                ) : (
                  "Assinar Agora"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Planos escaláveis baseados no tamanho do seu provedor</p>
        <p>Cancele a qualquer momento • Sem taxas de cancelamento</p>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;

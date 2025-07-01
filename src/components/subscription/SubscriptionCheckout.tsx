
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Crown, Loader2 } from "lucide-react";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";
import { useSubscriptionQuotas } from "@/hooks/useSubscriptionQuotas";

interface SubscriptionCheckoutProps {
  selectedPlan?: string;
  onPlanSelect?: (planType: string) => void;
  showCurrentPlan?: boolean;
}

const SubscriptionCheckout = ({ 
  selectedPlan, 
  onPlanSelect, 
  showCurrentPlan = true 
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
      features: [
        'Acesso limitado à plataforma',
        'Suporte básico por email',
        'Documentação completa'
      ]
    },
    {
      id: 'premium',
      type: 'premium',
      name: 'Plano Completo',
      description: 'Todos os agentes incluídos',
      price: 49900, // R$ 499,00 em centavos
      features: [
        'Todos os 3 agentes IA incluídos',
        'Chatbot, Voice e WhatsApp',
        'Integrações ilimitadas',
        'Analytics avançados',
        'Suporte prioritário 24/7',
        'Webhooks personalizados',
        'API completa',
        'Exportação de dados'
      ],
      popular: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Escolha seu Plano
        </h2>
        <p className="text-gray-600">
          Simples e direto: todos os agentes por um preço único
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all hover:shadow-lg ${
              plan.popular ? 'border-blue-500 border-2 shadow-md scale-105' : ''
            } ${
              isCurrentPlan(plan.type) ? 'border-green-500 border-2' : ''
            } ${
              selectedPlan === plan.type ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                <Crown className="w-3 h-3 mr-1" />
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
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? 'Grátis' : `R$ ${(plan.price / 100).toFixed(0)}`}
                </span>
                {plan.price > 0 && (
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
        <p>Todos os 3 agentes incluídos por apenas R$ 499/mês</p>
        <p>Cancele a qualquer momento • Sem taxas de cancelamento</p>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;

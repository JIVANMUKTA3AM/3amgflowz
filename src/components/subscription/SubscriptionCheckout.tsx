
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Crown, Zap, Star, Loader2 } from "lucide-react";
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
  const { plans, subscription, createCheckout, isCreatingCheckout } = useSubscriptionManagement();
  const { currentPlan } = useSubscriptionQuotas();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const formatPrice = (amount: number) => {
    return `R$ ${(amount / 100).toFixed(2).replace('.', ',')}`;
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'premium': return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'enterprise': return <Star className="h-5 w-5 text-purple-500" />;
      case 'basic': return <Zap className="h-5 w-5 text-blue-500" />;
      default: return <Zap className="h-5 w-5 text-gray-500" />;
    }
  };

  const isCurrentPlan = (planType: string) => {
    return subscription?.plan_type === planType || currentPlan === planType;
  };

  const isPopularPlan = (planType: string) => {
    return planType === 'premium';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Escolha seu Plano
        </h2>
        <p className="text-gray-600">
          Desbloqueie todo o potencial da plataforma com nossos planos flexíveis
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all hover:shadow-lg ${
              isPopularPlan(plan.plan_type) ? 'border-blue-500 border-2 shadow-md scale-105' : ''
            } ${
              isCurrentPlan(plan.plan_type) ? 'border-green-500 border-2' : ''
            } ${
              selectedPlan === plan.plan_type ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {isPopularPlan(plan.plan_type) && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                <Crown className="w-3 h-3 mr-1" />
                Mais Popular
              </Badge>
            )}
            
            {isCurrentPlan(plan.plan_type) && showCurrentPlan && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                <Check className="w-3 h-3 mr-1" />
                Seu Plano
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-2">
                {getPlanIcon(plan.plan_type)}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {plan.price_amount === 0 ? 'Grátis' : formatPrice(plan.price_amount)}
                </span>
                {plan.price_amount > 0 && (
                  <span className="text-gray-500">/{plan.billing_interval}</span>
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
                onClick={() => handleSubscribe(plan.plan_type)}
                className="w-full"
                variant={isCurrentPlan(plan.plan_type) ? "outline" : "default"}
                disabled={
                  isCurrentPlan(plan.plan_type) || 
                  processingPlan === plan.plan_type || 
                  isCreatingCheckout
                }
              >
                {processingPlan === plan.plan_type ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processando...
                  </>
                ) : isCurrentPlan(plan.plan_type) ? (
                  "Plano Atual"
                ) : plan.price_amount === 0 ? (
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
        <p>Todos os planos incluem período de teste gratuito</p>
        <p>Cancele a qualquer momento • Sem taxas de cancelamento</p>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;

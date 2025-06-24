
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from "lucide-react";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";

const SubscriptionPlans = () => {
  const { plans, subscription, createCheckout, isCreatingCheckout } = useSubscriptionManagement();

  const formatPrice = (amount: number) => {
    return `R$ ${(amount / 100).toFixed(2).replace('.', ',')}`;
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'premium': return <Crown className="h-5 w-5" />;
      case 'enterprise': return <Star className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const isCurrentPlan = (planType: string) => {
    return subscription?.plan_type === planType;
  };

  const isPopularPlan = (planType: string) => {
    return planType === 'premium';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative ${
            isPopularPlan(plan.plan_type) ? 'border-blue-500 border-2 shadow-lg' : ''
          } ${
            isCurrentPlan(plan.plan_type) ? 'border-green-500 border-2' : ''
          }`}
        >
          {isPopularPlan(plan.plan_type) && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
              <Crown className="w-3 h-3 mr-1" />
              Mais Popular
            </Badge>
          )}
          
          {isCurrentPlan(plan.plan_type) && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
              <Check className="w-3 h-3 mr-1" />
              Seu Plano
            </Badge>
          )}

          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              {getPlanIcon(plan.plan_type)}
            </div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">
                {plan.price_amount === 0 ? 'Grátis' : formatPrice(plan.price_amount)}
              </span>
              {plan.price_amount > 0 && (
                <span className="text-gray-500">/{plan.billing_interval}</span>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              onClick={() => createCheckout(plan.plan_type)}
              className="w-full"
              variant={isCurrentPlan(plan.plan_type) ? "outline" : "default"}
              disabled={isCurrentPlan(plan.plan_type) || isCreatingCheckout}
            >
              {isCurrentPlan(plan.plan_type) 
                ? "Plano Atual" 
                : isCreatingCheckout 
                ? "Processando..." 
                : plan.price_amount === 0 
                ? "Começar Grátis" 
                : "Assinar Agora"
              }
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;

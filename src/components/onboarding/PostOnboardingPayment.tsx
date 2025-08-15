
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, Crown, Users, DollarSign, CreditCard, Loader2 } from "lucide-react";
import { getPlanBySubscribers, getPlanPrice } from "@/types/subscription";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";
import { toast } from "@/hooks/use-toast";

interface PostOnboardingPaymentProps {
  selectedServices: string[];
  subscriberCount: number;
  onPaymentComplete: () => void;
  onPrevious: () => void;
}

const PostOnboardingPayment = ({
  selectedServices,
  subscriberCount,
  onPaymentComplete,
  onPrevious
}: PostOnboardingPaymentProps) => {
  const { createCheckout, isCreatingCheckout } = useSubscriptionManagement();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  
  const recommendedPlan = getPlanBySubscribers(subscriberCount);
  const planPrice = getPlanPrice(recommendedPlan, subscriberCount);

  const planNames = {
    free: 'Gratuito',
    flow_start: 'Flow Start',
    flow_pro: 'Flow Pro', 
    flow_power: 'Flow Power',
    flow_enterprise: 'Flow Enterprise',
    flow_ultra: 'Flow Ultra'
  };

  const planFeatures = {
    free: ['Acesso limitado', 'Suporte básico', 'Teste por 7 dias'],
    flow_start: ['Até 1.000 clientes', 'Agentes básicos', 'Suporte email', 'Integrações básicas'],
    flow_pro: ['1.001 a 3.000 clientes', 'Todos os agentes', 'Suporte prioritário', 'Integrações avançadas'],
    flow_power: ['3.001 a 10.000 clientes', 'Suporte 24/7', 'Analytics avançados', 'API completa'],
    flow_enterprise: ['10.001 a 30.000 clientes', 'Suporte dedicado', 'White label', 'Gerente de conta'],
    flow_ultra: ['30.000+ clientes', 'Solução customizada', 'Infraestrutura dedicada', 'SLA garantido']
  };

  const handlePlanSelect = async (planType: string) => {
    if (planType === 'free') {
      // Para plano gratuito, pular pagamento
      toast({
        title: "Plano Gratuito Ativado",
        description: "Você pode fazer upgrade a qualquer momento.",
      });
      onPaymentComplete();
      return;
    }

    if (planType === 'flow_ultra') {
      // Para plano ultra, redirecionar para contato
      window.open('/contact?plan=flow_ultra', '_blank');
      return;
    }

    setProcessingPlan(planType);
    try {
      await createCheckout(planType);
      // O checkout abrirá em nova aba, então aguardamos retorno
      setTimeout(() => {
        onPaymentComplete();
      }, 3000);
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro no Pagamento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const plans = [
    {
      id: 'free',
      type: 'free',
      name: 'Gratuito',
      description: 'Teste por 7 dias',
      price: 0,
      features: planFeatures.free
    },
    {
      id: 'flow_start',
      type: 'flow_start', 
      name: 'Flow Start',
      description: 'Até 1.000 clientes',
      price: 19900,
      features: planFeatures.flow_start
    },
    {
      id: 'flow_pro',
      type: 'flow_pro',
      name: 'Flow Pro',
      description: '1.001 a 3.000 clientes', 
      price: 49900,
      features: planFeatures.flow_pro,
      popular: true
    },
    {
      id: 'flow_power',
      type: 'flow_power',
      name: 'Flow Power',
      description: '3.001 a 10.000 clientes',
      price: 89900,
      features: planFeatures.flow_power
    },
    {
      id: 'flow_enterprise',
      type: 'flow_enterprise',
      name: 'Flow Enterprise', 
      description: '10.001 a 30.000 clientes',
      price: 149700,
      features: planFeatures.flow_enterprise
    },
    {
      id: 'flow_ultra',
      type: 'flow_ultra',
      name: 'Flow Ultra',
      description: 'Acima de 30.000 clientes',
      price: 0,
      features: planFeatures.flow_ultra,
      isCustom: true
    }
  ];

  return (
    <div className="min-h-screen bg-3amg-dark p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Escolha seu Plano Flow
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Configuração concluída! Agora selecione o plano ideal para seu provedor
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-3amg-orange">
              <Users className="h-5 w-5" />
              <span className="font-medium">
                {subscriberCount.toLocaleString()} assinantes detectados
              </span>
            </div>
            <Badge className="bg-3amg-orange/20 text-3amg-orange border-3amg-orange/30">
              Plano {planNames[recommendedPlan]} recomendado
            </Badge>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative transition-all hover:shadow-lg bg-gray-900/90 border-gray-700 ${
                plan.popular ? 'border-3amg-orange border-2 shadow-lg scale-105' : ''
              } ${
                recommendedPlan === plan.type ? 'ring-2 ring-3amg-orange' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-3amg-orange">
                  <Crown className="w-3 h-3 mr-1" />
                  Mais Popular
                </Badge>
              )}
              
              {recommendedPlan === plan.type && !plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-3amg-orange">
                  <Users className="w-3 h-3 mr-1" />
                  Recomendado
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400 min-h-[40px]">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">
                    {plan.isCustom ? 'Sob consulta' : plan.price === 0 ? 'Grátis' : `R$ ${(plan.price / 100).toFixed(0)}`}
                  </span>
                  {plan.price > 0 && !plan.isCustom && (
                    <span className="text-gray-400">/mês</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Separator className="mb-4 bg-gray-700" />
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-3amg-orange mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handlePlanSelect(plan.type)}
                  className={`w-full ${
                    recommendedPlan === plan.type 
                      ? 'bg-3amg-orange hover:bg-orange-600' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  disabled={processingPlan === plan.type || isCreatingCheckout}
                >
                  {processingPlan === plan.type ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processando...
                    </>
                  ) : plan.isCustom ? (
                    "Entrar em Contato"
                  ) : plan.price === 0 ? (
                    "Começar Grátis"
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Assinar Agora
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-3amg-orange" />
              Resumo da Configuração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Serviços Selecionados</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedServices.map((service) => (
                    <Badge key={service} variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Base de Assinantes</h4>
                <p className="text-2xl font-bold text-3amg-orange">
                  {subscriberCount.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Plano Recomendado</h4>
                <p className="text-lg font-medium text-white">
                  {planNames[recommendedPlan]}
                </p>
                <p className="text-sm text-gray-400">
                  R$ {planPrice.toLocaleString('pt-BR')}{recommendedPlan !== 'free' ? '/mês' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar à Revisão
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            <p>Após o pagamento, seus agentes serão ativados automaticamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOnboardingPayment;

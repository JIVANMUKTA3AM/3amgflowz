
import { useSubscription } from "@/hooks/useSubscription";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionCard from "@/components/SubscriptionCard";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import { useWorkflow } from "@/hooks/useWorkflow";

const Subscription = () => {
  const { handleWorkflowTrigger, isLoading } = useWorkflow();
  const { subscriptionData, createCheckout } = useSubscription();

  const plans = [
    {
      title: "Basic",
      description: "Ideal para começar",
      price: "R$ 29",
      period: "mês",
      features: [
        "1 agente ativo",
        "1.000 execuções/mês",
        "Suporte por email",
        "Integrações básicas"
      ],
      priceId: "price_basic_monthly" // Substitua pelo ID real do Stripe
    },
    {
      title: "Premium",
      description: "Para negócios em crescimento",
      price: "R$ 79",
      period: "mês",
      features: [
        "5 agentes ativos",
        "10.000 execuções/mês",
        "Suporte prioritário",
        "Todas as integrações",
        "Analytics avançados"
      ],
      isPopular: true,
      priceId: "price_premium_monthly" // Substitua pelo ID real do Stripe
    },
    {
      title: "Enterprise",
      description: "Para grandes empresas",
      price: "R$ 199",
      period: "mês",
      features: [
        "Agentes ilimitados",
        "Execuções ilimitadas",
        "Suporte 24/7",
        "Integrações customizadas",
        "SLA garantido",
        "Gerente dedicado"
      ],
      priceId: "price_enterprise_monthly" // Substitua pelo ID real do Stripe
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desbloqueie todo o potencial da automação com nossos planos flexíveis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <SubscriptionStatus />
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Por que assinar?
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Automatize processos complexos</li>
              <li>• Integre com suas ferramentas favoritas</li>
              <li>• Escale seu negócio sem limites</li>
              <li>• Suporte especializado quando precisar</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <SubscriptionCard
              key={index}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              isPopular={plan.isPopular}
              isCurrentPlan={subscriptionData.subscription_tier === plan.title}
              onSubscribe={() => createCheckout(plan.priceId)}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscription;

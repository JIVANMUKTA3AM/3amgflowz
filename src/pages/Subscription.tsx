
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const Subscription = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();
  const { createCheckout } = useSubscription();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success) {
      toast({
        title: "Assinatura ativada!",
        description: "Sua assinatura foi ativada com sucesso.",
      });
    } else if (canceled) {
      toast({
        title: "Pagamento cancelado",
        description: "O processo de pagamento foi cancelado.",
        variant: "destructive",
      });
    }
  }, [location]);

  const plans = [
    {
      title: "Básico",
      description: "Perfeito para pequenas empresas",
      price: "R$ 49",
      period: "mês",
      features: [
        "5 agentes IA",
        "1.000 interações/mês",
        "Integrações básicas",
        "Suporte por email"
      ]
    },
    {
      title: "Premium",
      description: "Para empresas em crescimento",
      price: "R$ 149",
      period: "mês",
      features: [
        "20 agentes IA",
        "10.000 interações/mês",
        "Todas as integrações",
        "Analytics avançados",
        "Suporte prioritário"
      ],
      isPopular: true
    },
    {
      title: "Enterprise",
      description: "Para grandes organizações",
      price: "R$ 399",
      period: "mês",
      features: [
        "Agentes ilimitados",
        "Interações ilimitadas",
        "Integrações customizadas",
        "Suporte 24/7",
        "Gerente dedicado"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha seu Plano
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Desbloqueie todo o potencial da plataforma com nossos planos flexíveis
            </p>
            
            {/* Link para gerenciamento */}
            <Link to="/subscription-management">
              <Button variant="outline" className="mb-8">
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Assinatura
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="md:col-span-2">
              <SubscriptionStatus />
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
                onSubscribe={() => createCheckout(plan.title.toLowerCase())}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Subscription;

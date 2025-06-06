
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentStatus from "@/components/payment/PaymentStatus";
import PixPayment from "@/components/payment/PixPayment";
import BoletoPayment from "@/components/payment/BoletoPayment";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { useStripeIntegration } from "@/hooks/useStripeIntegration";
import { useWorkflow } from "@/hooks/useWorkflow";

// Para carregar o Stripe.js dinamicamente
declare global {
  interface Window {
    Stripe: any;
  }
}

const PagamentoMetodo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');
  const invoiceId = searchParams.get('invoice');
  const clientSecret = searchParams.get('clientSecret');
  const intentId = searchParams.get('intentId');

  // Hook para verificar o status do pagamento
  const { isPaid } = usePaymentVerification({ 
    invoiceId, 
    intentId,
  });

  // Hook para Stripe
  const { 
    isLoading,
    qrCodeUrl,
    copyText,
    boletoUrl
  } = useStripeIntegration({ clientSecret, method });

  // Hook para workflow
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  // Renderizar o conteúdo do método de pagamento
  const renderPaymentMethod = () => {
    if (isPaid) return null;

    switch (method) {
      case 'pix':
        return <PixPayment qrCodeUrl={qrCodeUrl} copyText={copyText} />;
      case 'boleto':
        return <BoletoPayment boletoUrl={boletoUrl} />;
      default:
        return <div className="text-center py-4">Método de pagamento não suportado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>
              {isPaid ? 'Pagamento Confirmado!' : 
                method === 'pix' ? 'Pagamento via PIX' : 
                method === 'boleto' ? 'Pagamento via Boleto' : 
                'Pagamento'}
            </CardTitle>
            <CardDescription>
              {isPaid ? 'Seu pagamento foi processado com sucesso' : 
                method === 'pix' ? 'Escaneie o QR Code ou copie o código' : 
                method === 'boleto' ? 'Gere seu boleto para pagamento' : 
                'Processando sua solicitação'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <PaymentStatus isLoading={isLoading} isPaid={isPaid} />
            {!isLoading && renderPaymentMethod()}
          </CardContent>
          
          <CardFooter>
            <Button 
              variant={isPaid ? "default" : "outline"} 
              className="w-full" 
              onClick={() => navigate('/pagamentos')}
            >
              {isPaid ? 'Voltar para Faturas' : 'Cancelar'}
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PagamentoMetodo;

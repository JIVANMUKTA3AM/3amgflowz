
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentStatus from "@/components/payment/PaymentStatus";
import PixPayment from "@/components/payment/PixPayment";
import BoletoPayment from "@/components/payment/BoletoPayment";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { useStripeIntegration } from "@/hooks/useStripeIntegration";
import { useWorkflow } from "@/hooks/useWorkflow";

// Script do Stripe carregado globalmente
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
    onPaymentConfirmed: () => {
      // Opcional: redirecionar após confirmação
      setTimeout(() => {
        navigate('/pagamentos');
      }, 3000);
    }
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
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Método de pagamento não suportado</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/pagamentos')}
              className="mt-4"
            >
              Voltar para Pagamentos
            </Button>
          </div>
        );
    }
  };

  const getMethodName = () => {
    switch (method) {
      case 'pix': return 'PIX';
      case 'boleto': return 'Boleto';
      default: return 'Pagamento';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Botão de voltar */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/pagamentos')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Pagamentos
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isPaid ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Pagamento Confirmado!
                  </>
                ) : (
                  `Pagamento via ${getMethodName()}`
                )}
              </CardTitle>
              <CardDescription>
                {isPaid ? 
                  'Seu pagamento foi processado com sucesso' : 
                  method === 'pix' ? 'Escaneie o QR Code ou copie o código PIX' : 
                  method === 'boleto' ? 'Baixe seu boleto para pagamento' : 
                  'Processando sua solicitação'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <PaymentStatus isLoading={isLoading} isPaid={isPaid} />
              {!isLoading && renderPaymentMethod()}
            </CardContent>
            
            {!isPaid && (
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/pagamentos')}
                >
                  Cancelar Pagamento
                </Button>
              </CardFooter>
            )}
          </Card>

          {/* Informações adicionais */}
          {!isPaid && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Está com dificuldades? Entre em contato com nosso suporte.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PagamentoMetodo;

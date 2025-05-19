
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copyText, setCopyText] = useState<string | null>(null);
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Carregar Stripe.js
  useEffect(() => {
    if (!clientSecret) return;
    
    const loadStripe = async () => {
      if (!window.Stripe) {
        console.error("Stripe.js não foi carregado");
        toast({
          title: "Erro",
          description: "Não foi possível carregar a biblioteca de pagamento",
          variant: "destructive",
        });
        return;
      }
      
      const stripeInstance = window.Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
      setStripe(stripeInstance);
      
      const elementsInstance = stripeInstance.elements({
        clientSecret,
        appearance: {
          theme: 'stripe',
        },
      });
      
      setElements(elementsInstance);
      setIsLoading(false);
    };
    
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => loadStripe();
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [clientSecret]);

  // Carregar detalhes do método de pagamento
  useEffect(() => {
    if (!stripe || !elements) return;
    
    const setupPaymentMethod = async () => {
      try {
        if (method === 'pix') {
          const pixElement = elements.create('payment', {
            fields: {
              billingDetails: {
                name: 'never',
                email: 'never',
                phone: 'never',
                address: 'never',
              },
            },
            wallets: {
              applePay: 'never',
              googlePay: 'never',
            },
          });
          
          pixElement.mount('#payment-element');
          
          pixElement.on('ready', async (event: any) => {
            const { error, value } = await pixElement.getValue();
            if (error) {
              console.error('Erro ao obter QR code:', error);
              return;
            }
            
            if (value && value.pix) {
              setQrCodeUrl(value.pix.qrCode);
              setCopyText(value.pix.pixcopiaecola);
            }
          });
        } else if (method === 'boleto') {
          const boletoElement = elements.create('payment', {
            fields: {
              billingDetails: {
                name: 'always',
                email: 'always',
              },
            },
            wallets: {
              applePay: 'never',
              googlePay: 'never',
            },
          });
          
          boletoElement.mount('#payment-element');
          
          boletoElement.on('ready', async (event: any) => {
            const { error, value } = await boletoElement.getValue();
            if (error) {
              console.error('Erro ao obter boleto:', error);
              return;
            }
            
            if (value && value.boleto) {
              setBoletoUrl(value.boleto.url);
            }
          });
        }
      } catch (error) {
        console.error(`Erro ao configurar ${method}:`, error);
        toast({
          title: "Erro",
          description: `Não foi possível carregar o ${method === 'pix' ? 'QR Code' : 'Boleto'}`,
          variant: "destructive",
        });
      }
    };
    
    setupPaymentMethod();
    
    // Iniciar verificação periódica de pagamento
    const interval = setInterval(() => {
      if (!verifying && !isPaid) {
        checkPaymentStatus();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [stripe, elements, method]);

  // Verificar status do pagamento
  const checkPaymentStatus = async () => {
    if (!invoiceId || !intentId || isPaid || verifying) return;
    
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { invoiceId, intentId },
      });

      if (error) throw error;

      if (data.isPaid) {
        setIsPaid(true);
        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento foi processado com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
    } finally {
      setVerifying(false);
    }
  };

  // Copiar código PIX para área de transferência
  const copyToClipboard = () => {
    if (!copyText) return;
    
    navigator.clipboard.writeText(copyText).then(() => {
      toast({
        title: "Código PIX copiado!",
        description: "Cole no seu aplicativo de banco para pagar.",
      });
    }).catch(err => {
      console.error('Erro ao copiar texto:', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código PIX",
        variant: "destructive",
      });
    });
  };

  // Imprimir boleto
  const printBoleto = () => {
    if (!boletoUrl) return;
    window.open(boletoUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Carregando informações de pagamento...</p>
              </div>
            ) : isPaid ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Check className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Pagamento aprovado!</h3>
                <p className="text-gray-600 text-center mb-4">
                  O pagamento foi confirmado e sua fatura foi atualizada.
                </p>
              </div>
            ) : (
              <>
                {method === 'pix' && (
                  <div className="flex flex-col items-center">
                    {qrCodeUrl ? (
                      <>
                        <div className="bg-white p-4 border rounded-lg mb-4">
                          <img 
                            src={qrCodeUrl} 
                            alt="QR Code PIX" 
                            className="max-w-xs"
                          />
                        </div>
                        <Button 
                          className="w-full mb-4" 
                          onClick={copyToClipboard}
                        >
                          Copiar Código PIX
                        </Button>
                        <p className="text-sm text-gray-500 text-center">
                          Abra o app do seu banco, escolha PIX, e escaneie o QR code 
                          ou cole o código copiado
                        </p>
                      </>
                    ) : (
                      <div id="payment-element" className="mb-4">
                        {/* Stripe PIX element will be mounted here */}
                      </div>
                    )}
                  </div>
                )}
                
                {method === 'boleto' && (
                  <div className="flex flex-col">
                    <div id="payment-element" className="mb-4">
                      {/* Stripe Boleto element will be mounted here */}
                    </div>
                    
                    {boletoUrl && (
                      <Button 
                        className="w-full mt-4" 
                        onClick={printBoleto}
                      >
                        Imprimir Boleto
                      </Button>
                    )}
                    
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Após o pagamento, pode levar até 3 dias úteis para a confirmação.
                    </p>
                  </div>
                )}
              </>
            )}
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


import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface UseStripeIntegrationProps {
  clientSecret: string | null;
  method: string | null;
}

export const useStripeIntegration = ({ clientSecret, method }: UseStripeIntegrationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copyText, setCopyText] = useState<string | null>(null);
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null);

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
  }, [stripe, elements, method]);

  return {
    isLoading,
    stripe,
    elements,
    qrCodeUrl,
    copyText,
    boletoUrl
  };
};

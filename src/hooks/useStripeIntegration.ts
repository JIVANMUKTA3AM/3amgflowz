
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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
    if (!clientSecret) {
      setIsLoading(false);
      return;
    }
    
    const loadStripe = async () => {
      try {
        if (!window.Stripe) {
          console.error("Stripe.js não foi carregado");
          toast({
            title: "Erro",
            description: "Não foi possível carregar a biblioteca de pagamento",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        const stripeInstance = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');
        setStripe(stripeInstance);
        
        const elementsInstance = stripeInstance.elements({
          clientSecret,
          appearance: {
            theme: 'stripe',
          },
        });
        
        setElements(elementsInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar Stripe:", error);
        toast({
          title: "Erro",
          description: "Erro ao inicializar pagamento",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    // Verificar se o script já foi carregado
    if (window.Stripe) {
      loadStripe();
    } else {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      script.onload = () => loadStripe();
      script.onerror = () => {
        console.error("Erro ao carregar script do Stripe");
        setIsLoading(false);
      };
      document.head.appendChild(script);
      
      return () => {
        try {
          document.head.removeChild(script);
        } catch (e) {
          // Script já foi removido
        }
      };
    }
  }, [clientSecret]);

  // Configurar método de pagamento específico
  useEffect(() => {
    if (!stripe || !elements || !method) return;
    
    const setupPaymentMethod = async () => {
      try {
        console.log(`Configurando ${method}...`);
        
        if (method === 'pix') {
          // Para PIX, criar elemento de pagamento
          const paymentElement = elements.create('payment', {
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
          
          const mountElement = document.getElementById('payment-element');
          if (mountElement) {
            paymentElement.mount('#payment-element');
            
            // Aguardar o elemento estar pronto e obter dados do PIX
            paymentElement.on('ready', async () => {
              console.log('Elemento PIX pronto');
              try {
                const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
                if (paymentIntent?.next_action?.pix_display_qr_code) {
                  const pixData = paymentIntent.next_action.pix_display_qr_code;
                  setQrCodeUrl(pixData.image_url_svg);
                  setCopyText(pixData.data);
                  console.log('Dados PIX carregados:', { qrCode: !!pixData.image_url_svg, copyText: !!pixData.data });
                }
              } catch (error) {
                console.error('Erro ao obter dados PIX:', error);
              }
            });
          }
        } else if (method === 'boleto') {
          // Para Boleto, criar elemento de pagamento
          const paymentElement = elements.create('payment', {
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
          
          const mountElement = document.getElementById('payment-element');
          if (mountElement) {
            paymentElement.mount('#payment-element');
            
            paymentElement.on('ready', async () => {
              console.log('Elemento Boleto pronto');
              try {
                const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
                if (paymentIntent?.next_action?.boleto_display_details) {
                  const boletoData = paymentIntent.next_action.boleto_display_details;
                  setBoletoUrl(boletoData.pdf);
                  console.log('Dados Boleto carregados:', { url: !!boletoData.pdf });
                }
              } catch (error) {
                console.error('Erro ao obter dados Boleto:', error);
              }
            });
          }
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
  }, [stripe, elements, method, clientSecret]);

  return {
    isLoading,
    stripe,
    elements,
    qrCodeUrl,
    copyText,
    boletoUrl
  };
};

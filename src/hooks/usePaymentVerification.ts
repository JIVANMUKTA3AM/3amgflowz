
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface UsePaymentVerificationProps {
  invoiceId: string | null;
  intentId: string | null;
  onPaymentConfirmed?: () => void;
}

export const usePaymentVerification = ({ 
  invoiceId, 
  intentId,
  onPaymentConfirmed
}: UsePaymentVerificationProps) => {
  const [isPaid, setIsPaid] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Verificar status do pagamento
  const checkPaymentStatus = async () => {
    if (!invoiceId || !intentId || isPaid || verifying) return;
    
    console.log('Verificando pagamento...', { invoiceId, intentId });
    setVerifying(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { invoiceId, intentId },
      });

      if (error) {
        console.error('Erro na função verify-payment:', error);
        throw error;
      }

      console.log('Resposta da verificação:', data);

      if (data?.isPaid) {
        setIsPaid(true);
        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento foi processado com sucesso.",
        });
        
        if (onPaymentConfirmed) {
          onPaymentConfirmed();
        }
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      // Não mostrar toast de erro para evitar spam
    } finally {
      setVerifying(false);
    }
  };

  // Verificação inicial e periódica
  useEffect(() => {
    if (!invoiceId || !intentId) return;

    // Verificação inicial
    checkPaymentStatus();
    
    // Verificação periódica a cada 5 segundos
    const interval = setInterval(() => {
      if (!isPaid) {
        checkPaymentStatus();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [invoiceId, intentId, isPaid]);

  return { isPaid, verifying, checkPaymentStatus };
};

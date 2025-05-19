
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        
        if (onPaymentConfirmed) {
          onPaymentConfirmed();
        }
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
    } finally {
      setVerifying(false);
    }
  };

  // Iniciar verificação periódica de pagamento
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaid) {
        checkPaymentStatus();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [invoiceId, intentId, isPaid]);

  return { isPaid, verifying, checkPaymentStatus };
};

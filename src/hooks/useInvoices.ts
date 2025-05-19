
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

// Definição de tipos
export interface Invoice {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  payment_method?: string;
  payment_date?: string;
  payment_url?: string;
}

export const useInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);

  const loadInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Erro ao carregar faturas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas faturas",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const verifyPayment = async (invoiceId: string, sessionId?: string, intentId?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { invoiceId, sessionId, intentId },
      });

      if (error) throw error;

      if (data.isPaid) {
        toast({
          title: "Pagamento confirmado!",
          description: "Sua fatura foi paga com sucesso.",
        });
        
        // Remover parâmetros da URL e recarregar faturas
        navigate('/pagamentos');
        loadInvoices();
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status do pagamento",
        variant: "destructive",
      });
    }
  };

  const handlePaymentClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const processPayment = async (paymentMethod: string) => {
    if (!selectedInvoice) return;
    
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("process-payment", {
        body: {
          invoiceId: selectedInvoice.id,
          paymentMethod,
          returnUrl: window.location.origin + "/pagamentos",
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.error || "Erro ao processar pagamento");
      }

      // Para cartão de crédito, redirecionamos para o checkout do Stripe
      if (paymentMethod === "card" && response.data.url) {
        window.location.href = response.data.url;
        return;
      }
      
      // Para Pix e Boleto, redirecionamos para página de pagamento específica
      if (["pix", "boleto"].includes(paymentMethod) && response.data.clientSecret) {
        navigate(`/pagamentos/metodo?method=${paymentMethod}&invoice=${selectedInvoice.id}&clientSecret=${response.data.clientSecret}&intentId=${response.data.intentId}`);
        return;
      }

      setIsPaymentModalOpen(false);
      
      // Se a fatura já estiver paga
      if (response.data.message === "Fatura já está paga") {
        toast({
          title: "Fatura já paga",
          description: "Esta fatura já foi paga anteriormente.",
        });
        loadInvoices();
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao processar pagamento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invoices,
    selectedInvoice,
    isPaymentModalOpen,
    isLoading,
    isLoadingInvoices,
    loadInvoices,
    verifyPayment,
    handlePaymentClick,
    processPayment,
    setIsPaymentModalOpen,
  };
};

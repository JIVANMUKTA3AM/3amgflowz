
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { LoaderCircle } from "lucide-react";

// Definição de tipos
interface Invoice {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: string;
  payment_method?: string;
  payment_date?: string;
  payment_url?: string;
}

const Pagamentos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);

  // Verificar parâmetros de URL para pagamentos bem-sucedidos
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const invoiceId = searchParams.get('invoice_id');
    
    if (sessionId && invoiceId) {
      verifyPayment(invoiceId, sessionId);
    }
    
    // Carregar faturas
    loadInvoices();
  }, [searchParams]);

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

  // Formatação de valores monetários
  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Formatação de datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Renderização de badge de status
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Pago</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Pendente</Badge>;
      case "canceled":
        return <Badge variant="destructive">Cancelado</Badge>;
      case "expired":
        return <Badge variant="secondary">Vencido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Minhas Faturas</h1>
          <p className="text-gray-600">
            Visualize suas faturas e realize pagamentos de forma rápida e segura.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Faturas</CardTitle>
            <CardDescription>
              Todas as suas faturas estão listadas abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingInvoices ? (
              <div className="flex justify-center items-center py-8">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Carregando faturas...</span>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Você não possui faturas no momento.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.description}</TableCell>
                        <TableCell>{formatDate(invoice.due_date)}</TableCell>
                        <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                        <TableCell>{renderStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          {invoice.status === 'pending' ? (
                            <Button 
                              onClick={() => handlePaymentClick(invoice)}
                              size="sm"
                            >
                              Pagar Agora
                            </Button>
                          ) : invoice.status === 'paid' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast({
                                title: "Fatura já paga",
                                description: `Pago via ${invoice.payment_method} em ${formatDate(invoice.payment_date || '')}`,
                              })}
                            >
                              Comprovante
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled
                            >
                              {invoice.status === 'canceled' ? 'Cancelada' : 'Vencida'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Seleção de Método de Pagamento */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Escolha o método de pagamento</DialogTitle>
              <DialogDescription>
                {selectedInvoice && (
                  <>
                    Fatura: {selectedInvoice.description}<br />
                    Valor: {formatCurrency(selectedInvoice.amount)}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <PaymentMethodSelector onSelect={processPayment} isLoading={isLoading} />
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsPaymentModalOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Pagamentos;

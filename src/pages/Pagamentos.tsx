
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvoicesTable from "@/components/payment/InvoicesTable";
import PaymentModal from "@/components/payment/PaymentModal";
import { useInvoices } from "@/hooks/useInvoices";
import { useWorkflow } from "@/hooks/useWorkflow";

const Pagamentos = () => {
  const [searchParams] = useSearchParams();
  const {
    invoices,
    selectedInvoice,
    isPaymentModalOpen,
    isLoading: isPaymentLoading,
    isLoadingInvoices,
    loadInvoices,
    verifyPayment,
    handlePaymentClick,
    processPayment,
    setIsPaymentModalOpen
  } = useInvoices();
  const { handleWorkflowTrigger, isLoading: isWorkflowLoading } = useWorkflow();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isWorkflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
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
            <InvoicesTable 
              invoices={invoices}
              isLoading={isLoadingInvoices}
              onPaymentClick={handlePaymentClick}
            />
          </CardContent>
        </Card>

        {/* Modal de Seleção de Método de Pagamento */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          invoice={selectedInvoice}
          onProcessPayment={processPayment}
          isLoading={isPaymentLoading}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Pagamentos;

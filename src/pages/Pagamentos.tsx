
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isWorkflowLoading} />
      
      {/* Hero Section */}
      <section className="bg-gradient-3amg relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Central de Pagamentos
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Gerencie suas faturas e realize pagamentos de forma rápida e segura
            </p>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Status Cards */}
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Faturas Pagas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {invoices.filter(inv => inv.status === 'paid').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {invoices.filter(inv => inv.status === 'pending').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Faturas</p>
                    <p className="text-2xl font-bold text-purple-600">{invoices.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="animate-fade-in hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Suas Faturas</CardTitle>
            <CardDescription className="text-purple-100">
              Todas as suas faturas estão listadas abaixo. Clique em "Pagar Agora" para realizar o pagamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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

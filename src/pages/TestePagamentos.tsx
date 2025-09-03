import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, CreditCard, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const TestePagamentos = () => {
  const { 
    subscription, 
    createCheckout, 
    isCreatingCheckout,
    manageSubscription,
    isManaging,
    checkSubscription,
    isChecking
  } = useSubscriptionManagement();
  
  const [testResults, setTestResults] = useState<any[]>([]);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      setTestResults(prev => [...prev, {
        name: testName,
        status: 'success',
        duration,
        result,
        timestamp: new Date().toISOString()
      }]);
      
      toast({
        title: `✅ ${testName}`,
        description: `Teste concluído com sucesso em ${duration}ms`,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      
      setTestResults(prev => [...prev, {
        name: testName,
        status: 'error',
        duration,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }]);
      
      toast({
        title: `❌ ${testName}`,
        description: `Erro: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    }
  };

  const testPlans = [
    { id: 'flow_start', name: 'Flow Start', price: 'R$ 199,00' },
    { id: 'flow_pro', name: 'Flow Pro', price: 'R$ 499,00' },
    { id: 'flow_power', name: 'Flow Power', price: 'R$ 899,00' },
    { id: 'flow_enterprise', name: 'Flow Enterprise', price: 'R$ 1.497,00' }
  ];

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Teste do Sistema de Pagamentos
            </h1>
            <p className="text-xl text-gray-600">
              Teste todas as funcionalidades do sistema de pagamentos Stripe
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status da Assinatura */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Status da Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Plano:</span>
                      <Badge variant="outline">{subscription.plan_type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                        {subscription.status}
                      </Badge>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex justify-between">
                        <span>Renovação:</span>
                        <span className="text-sm">
                          {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma assinatura ativa</p>
                )}
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => runTest("Verificar Status", async () => {
                      return new Promise((resolve) => {
                        checkSubscription();
                        setTimeout(() => resolve({ status: 'checked' }), 1000);
                      });
                    })}
                    disabled={isChecking}
                    className="w-full"
                    variant="outline"
                  >
                    {isChecking && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Verificar Status
                  </Button>
                  
                  {subscription?.stripe_customer_id && (
                    <Button 
                      onClick={() => runTest("Portal do Cliente", async () => {
                        return new Promise((resolve) => {
                          manageSubscription();
                          setTimeout(() => resolve({ portal: 'opened' }), 1000);
                        });
                      })}
                      disabled={isManaging}
                      className="w-full"
                      variant="outline"
                    >
                      {isManaging && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Abrir Portal do Cliente
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Testes de Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>Testes de Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testPlans.map((plan) => (
                  <Button
                    key={plan.id}
                    onClick={() => runTest(`Checkout ${plan.name}`, async () => {
                      return new Promise((resolve) => {
                        createCheckout(plan.id);
                        setTimeout(() => resolve({ plan: plan.id, checkout: 'created' }), 1000);
                      });
                    })}
                    disabled={isCreatingCheckout}
                    className="w-full justify-between"
                    variant="outline"
                  >
                    <span>{plan.name}</span>
                    <span className="text-sm font-normal">{plan.price}</span>
                    {isCreatingCheckout && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Resultados dos Testes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Resultados dos Testes</CardTitle>
                  <Button onClick={clearResults} variant="outline" size="sm">
                    Limpar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum teste executado ainda. Clique nos botões acima para testar.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {testResults.slice().reverse().map((test, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50"
                      >
                        {test.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : test.status === 'error' ? (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{test.name}</h4>
                            <span className="text-xs text-gray-500">
                              {test.duration}ms
                            </span>
                          </div>
                          
                          {test.status === 'success' && test.result && (
                            <pre className="text-xs bg-green-50 p-2 rounded border text-green-800 overflow-x-auto">
                              {JSON.stringify(test.result, null, 2)}
                            </pre>
                          )}
                          
                          {test.status === 'error' && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded border">
                              {test.error}
                            </p>
                          )}
                          
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(test.timestamp).toLocaleTimeString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TestePagamentos;
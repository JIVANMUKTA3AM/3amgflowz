
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Loader2, AlertCircle, TestTube } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface WebhookTest {
  name: string;
  endpoint: string;
  status: 'pending' | 'success' | 'error' | 'testing';
  message?: string;
  responseTime?: number;
}

const WebhookTester = () => {
  const [tests, setTests] = useState<WebhookTest[]>([
    {
      name: "Stripe Webhook",
      endpoint: "webhook-stripe",
      status: 'pending'
    },
    {
      name: "Payment Verification",
      endpoint: "verify-payment",
      status: 'pending'
    },
    {
      name: "Process Payment",
      endpoint: "process-payment",
      status: 'pending'
    },
    {
      name: "Subscription Checkout",
      endpoint: "create-subscription-checkout",
      status: 'pending'
    },
    {
      name: "Customer Portal",
      endpoint: "customer-portal",
      status: 'pending'
    }
  ]);

  const [isTestingAll, setIsTestingAll] = useState(false);

  const testWebhook = async (webhookTest: WebhookTest, index: number) => {
    const startTime = Date.now();
    
    // Update status to testing
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status: 'testing' } : test
    ));

    try {
      let testData = {};
      
      // Prepare test data based on webhook type
      switch (webhookTest.endpoint) {
        case 'verify-payment':
          testData = {
            test: true,
            invoiceId: 'test-invoice-' + Date.now(),
            // Remove sessionId to avoid Stripe API calls during testing
          };
          break;
        case 'process-payment':
          testData = {
            test: true,
            invoiceId: 'test-invoice-' + Date.now(),
            paymentMethod: 'pix',
            amount: 10000,
            returnUrl: window.location.origin
          };
          break;
        case 'create-subscription-checkout':
          testData = {
            test: true,
            planType: 'premium',
            successUrl: `${window.location.origin}/subscription?success=true`,
            cancelUrl: `${window.location.origin}/subscription?canceled=true`
          };
          break;
        case 'customer-portal':
          testData = {
            test: true,
            returnUrl: window.location.origin
          };
          break;
        case 'webhook-stripe':
          testData = {
            test: true,
            type: 'test.webhook',
            data: {
              object: {
                id: 'test_' + Date.now(),
                object: 'test'
              }
            }
          };
          break;
        default:
          testData = { test: true };
      }

      const { data, error } = await supabase.functions.invoke(webhookTest.endpoint, {
        body: testData
      });

      const responseTime = Date.now() - startTime;

      if (error) {
        setTests(prev => prev.map((test, i) => 
          i === index ? { 
            ...test, 
            status: 'error', 
            message: error.message || 'Erro desconhecido',
            responseTime 
          } : test
        ));
      } else {
        // Check if response indicates success
        const isSuccess = data && (
          data.success === true || 
          data.url || 
          data.message || 
          data.status === 'success' ||
          !data.error
        );

        setTests(prev => prev.map((test, i) => 
          i === index ? { 
            ...test, 
            status: isSuccess ? 'success' : 'error', 
            message: isSuccess ? 'Webhook respondeu com sucesso' : (data?.error || 'Resposta inesperada'),
            responseTime 
          } : test
        ));
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setTests(prev => prev.map((test, i) => 
        i === index ? { 
          ...test, 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          responseTime 
        } : test
      ));
    }
  };

  const testAllWebhooks = async () => {
    setIsTestingAll(true);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const })));
    
    try {
      // Test webhooks sequentially to avoid overwhelming the server
      for (let i = 0; i < tests.length; i++) {
        await testWebhook(tests[i], i);
        // Add a small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: "Testes concluídos",
        description: "Todos os webhooks foram testados.",
      });
    } catch (error) {
      toast({
        title: "Erro nos testes",
        description: "Erro ao executar os testes dos webhooks.",
        variant: "destructive",
      });
    } finally {
      setIsTestingAll(false);
    }
  };

  const getStatusIcon = (status: WebhookTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: WebhookTest['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testando...</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Teste de Webhooks
            </CardTitle>
            <CardDescription>
              Verifique se todos os webhooks estão funcionando corretamente
            </CardDescription>
          </div>
          <Button
            onClick={testAllWebhooks}
            disabled={isTestingAll}
            className="min-w-[120px]"
          >
            {isTestingAll ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Testando...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Testar Todos
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {tests.map((test, index) => (
          <div key={test.endpoint}>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <h4 className="font-medium">{test.name}</h4>
                  <p className="text-sm text-gray-500">/{test.endpoint}</p>
                  {test.message && (
                    <p className="text-xs text-gray-400 mt-1">{test.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {test.responseTime && (
                  <span className="text-xs text-gray-500">
                    {test.responseTime}ms
                  </span>
                )}
                {getStatusBadge(test.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testWebhook(test, index)}
                  disabled={test.status === 'testing' || isTestingAll}
                >
                  {test.status === 'testing' ? 'Testando...' : 'Testar'}
                </Button>
              </div>
            </div>
            
            {index < tests.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Como interpretar os resultados:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Sucesso:</strong> Webhook respondeu sem erros</li>
            <li>• <strong>Erro:</strong> Webhook retornou erro ou não respondeu</li>
            <li>• <strong>Tempo de resposta:</strong> Velocidade de resposta em milissegundos</li>
            <li>• <strong>Modo de teste:</strong> Testes usam dados fictícios para não afetar APIs reais</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookTester;

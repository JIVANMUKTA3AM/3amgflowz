
import { useWorkflow } from "@/hooks/useWorkflow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WebhookTester from "@/components/admin/WebhookTester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TestTube, CheckCircle } from "lucide-react";

const WebhookTesting = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Teste de Webhooks
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Verifique se todos os webhooks do sistema estão funcionando corretamente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Todos os webhooks são testados de forma segura sem afetar dados reais
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-green-500" />
                Testes Automatizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Execute testes individuais ou teste todos os webhooks de uma vez
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                Relatórios Detalhados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Veja tempo de resposta, status e mensagens de erro detalhadas
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <WebhookTester />
      </main>

      <Footer />
    </div>
  );
};

export default WebhookTesting;

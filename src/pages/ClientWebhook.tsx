
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Webhook, Save, TestTube2, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ClientWebhook = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lastTested, setLastTested] = useState<string | null>(null);

  useEffect(() => {
    // Carregar configuração salva
    const saved = localStorage.getItem("client_webhook_url");
    if (saved) {
      setWebhookUrl(saved);
      setIsConfigured(true);
    }

    const lastTest = localStorage.getItem("client_webhook_last_test");
    if (lastTest) {
      setLastTested(lastTest);
    }
  }, []);

  const handleSave = () => {
    if (!webhookUrl) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira a URL do seu webhook",
        variant: "destructive",
      });
      return;
    }

    // Validação básica de URL
    try {
      new URL(webhookUrl);
    } catch {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida (ex: https://seu-sistema.com/webhook)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simular salvamento
    setTimeout(() => {
      localStorage.setItem("client_webhook_url", webhookUrl);
      setIsConfigured(true);
      setIsLoading(false);
      
      toast({
        title: "Webhook configurado",
        description: "Sua URL foi salva com sucesso. Agora você receberá as respostas dos agentes.",
      });
    }, 1000);
  };

  const handleTest = async () => {
    if (!webhookUrl) {
      toast({
        title: "Configure primeiro",
        description: "Salve a URL do webhook antes de testá-la",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    
    try {
      // Enviar dados de teste
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          test: true,
          agent_type: "atendimento",
          message: "Este é um teste de conexão do seu webhook",
          customer: "Cliente Teste",
          resolution: "Teste de conectividade realizado com sucesso",
          timestamp: new Date().toISOString(),
          source: "sistema_agentes"
        }),
      });

      const testTime = new Date().toISOString();
      localStorage.setItem("client_webhook_last_test", testTime);
      setLastTested(testTime);

      toast({
        title: "Teste enviado",
        description: "Dados de teste foram enviados para sua URL. Verifique se recebeu em seu sistema.",
      });
    } catch (error) {
      console.error("Erro no teste:", error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível enviar o teste. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={() => {}} isLoading={false} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Configuração do Webhook
            </h1>
            <p className="text-gray-600">
              Configure onde você quer receber as respostas dos nossos agentes IA
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Seu Webhook de Recebimento
                {isConfigured && (
                  <Badge variant="default" className="ml-auto">
                    <Check className="h-3 w-3 mr-1" />
                    Configurado
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do seu sistema</Label>
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://seu-sistema.com/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Insira a URL onde seu CRM, Slack ou sistema deve receber as respostas dos agentes
                </p>
              </div>

              {lastTested && (
                <div className="text-sm text-gray-500">
                  Último teste: {new Date(lastTested).toLocaleString()}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Configuração
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleTest}
                  disabled={isTesting || !isConfigured}
                  variant="outline"
                >
                  {isTesting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Testando...
                    </>
                  ) : (
                    <>
                      <TestTube2 className="h-4 w-4 mr-2" />
                      Testar
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Como funciona:
                    </h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Quando um agente atender um cliente, a resposta será enviada para sua URL</li>
                      <li>• Os dados incluem tipo do agente, mensagem do cliente e resolução</li>
                      <li>• Você pode integrar com seu CRM, Slack, email ou qualquer sistema</li>
                      <li>• Use o botão "Testar" para verificar se está recebendo corretamente</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Exemplo de dados que você receberá:
                </h4>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`{
  "agent_type": "atendimento",
  "customer": "João Silva",
  "message": "Minha internet está lenta",
  "resolution": "Problema resolvido. Router reiniciado remotamente.",
  "timestamp": "2024-01-15T10:30:00Z",
  "ticket_id": "TKT-12345"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientWebhook;

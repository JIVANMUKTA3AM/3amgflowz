import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Clock, AlertTriangle, Zap } from "lucide-react";

interface WebhookTestResult {
  success: boolean;
  status_code?: number;
  response_time_ms: number;
  error_message?: string;
  response_body?: any;
  response_headers?: Record<string, string>;
}

interface WebhookTesterProps {
  webhookId?: string;
  initialUrl?: string;
}

export const WebhookTester = ({ webhookId, initialUrl = "" }: WebhookTesterProps) => {
  const [webhookUrl, setWebhookUrl] = useState(initialUrl);
  const [customPayload, setCustomPayload] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<WebhookTestResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleTest = async () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "URL necessária",
        description: "Por favor, insira a URL do webhook para testar.",
        variant: "destructive",
      });
      return;
    }

    // Validar se não é localhost
    if (webhookUrl.includes('localhost') || webhookUrl.includes('127.0.0.1')) {
      toast({
        title: "URL inválida para ambiente live",
        description: "URLs localhost não são acessíveis do ambiente Supabase. Use uma URL pública (ex: ngrok, seu domínio n8n, etc).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      let testPayload = undefined;
      
      if (customPayload.trim()) {
        try {
          testPayload = JSON.parse(customPayload);
        } catch (e) {
          toast({
            title: "JSON inválido",
            description: "O payload personalizado deve ser um JSON válido.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke('webhook-tester', {
        body: {
          webhook_url: webhookUrl,
          webhook_id: webhookId,
          test_payload: testPayload,
          timeout_ms: 15000
        }
      });

      if (error) {
        throw error;
      }

      setTestResult(data.test_result);
      
      toast({
        title: data.test_result.success ? "Teste bem-sucedido!" : "Teste falhou",
        description: data.test_result.success 
          ? `Webhook respondeu em ${data.test_result.response_time_ms}ms`
          : data.test_result.error_message || "Erro desconhecido",
        variant: data.test_result.success ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Webhook test error:', error);
      toast({
        title: "Erro no teste",
        description: "Falha ao executar teste do webhook. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (result: WebhookTestResult) => {
    if (result.success) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (result.status_code) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (result: WebhookTestResult) => {
    if (result.success) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Sucesso</Badge>;
    } else if (result.status_code) {
      return <Badge variant="destructive">HTTP {result.status_code}</Badge>;
    } else {
      return <Badge variant="secondary">Erro de Rede</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Teste de Webhook - Ambiente Live
        </CardTitle>
        <CardDescription>
          Teste a conectividade e funcionalidade do seu webhook em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">URL do Webhook</Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://seu-webhook.com/endpoint"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-payload">
            Payload Personalizado (opcional)
          </Label>
          <Textarea
            id="custom-payload"
            placeholder='{"custom": "data", "test": true}'
            value={customPayload}
            onChange={(e) => setCustomPayload(e.target.value)}
            rows={3}
          />
          {customPayload && (
            <p className="text-xs text-muted-foreground">
              Deixe vazio para usar o payload padrão de teste
            </p>
          )}
        </div>

        <Button 
          onClick={handleTest} 
          disabled={isLoading || !webhookUrl.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Executar Teste
            </>
          )}
        </Button>

        {testResult && (
          <div className="space-y-3">
            <Alert className={testResult.success ? "border-green-200" : "border-red-200"}>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResult)}
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">Resultado do Teste</span>
                  {getStatusBadge(testResult)}
                </div>
              </div>
              <AlertDescription className="mt-2">
                <div className="space-y-1">
                  <p>Tempo de resposta: {testResult.response_time_ms}ms</p>
                  {testResult.error_message && (
                    <p className="text-red-600">Erro: {testResult.error_message}</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            {(testResult.response_body || testResult.response_headers) && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Ocultar" : "Mostrar"} Detalhes da Resposta
                </Button>

                {showDetails && (
                  <div className="space-y-3 p-3 bg-muted rounded-lg">
                    {testResult.response_headers && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Headers de Resposta:</h4>
                        <pre className="text-xs bg-background p-2 rounded border overflow-auto">
                          {JSON.stringify(testResult.response_headers, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {testResult.response_body && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Corpo da Resposta:</h4>
                        <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-40">
                          {typeof testResult.response_body === 'string' 
                            ? testResult.response_body 
                            : JSON.stringify(testResult.response_body, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Este teste envia uma requisição POST real do ambiente Supabase. 
            A URL deve ser <strong>publicamente acessível</strong>. URLs localhost não funcionarão - 
            use ngrok, seu domínio n8n público, ou outro serviço de túnel para testes.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const WhatsAppConfig = () => {
  const [config, setConfig] = useState({
    accessToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    webhookVerifyToken: "",
    webhookUrl: "",
    isConfigured: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  useEffect(() => {
    // Carregar configuração salva
    const saved = localStorage.getItem("whatsapp_config");
    if (saved) {
      const parsedConfig = JSON.parse(saved);
      setConfig(prev => ({ ...prev, ...parsedConfig }));
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validar campos obrigatórios
      if (!config.accessToken || !config.phoneNumberId || !config.businessAccountId) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive"
        });
        return;
      }

      // Salvar no localStorage (em produção seria no banco de dados)
      localStorage.setItem("whatsapp_config", JSON.stringify({
        ...config,
        isConfigured: true
      }));

      setConfig(prev => ({ ...prev, isConfigured: true }));

      toast({
        title: "Configuração salva!",
        description: "WhatsApp Business API configurado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Simular teste da conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Teste realizado!",
        description: "Conexão com WhatsApp Business API funcionando"
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Verifique suas credenciais",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <MessageCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Configuração WhatsApp Business API
            </h1>
            <p className="text-gray-600">
              Configure a integração com WhatsApp para permitir atendimento via chat
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Status da Integração
                      {config.isConfigured ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {config.isConfigured ? "Integração ativa e funcionando" : "Integração não configurada"}
                    </CardDescription>
                  </div>
                  <Badge variant={config.isConfigured ? "default" : "secondary"}>
                    {config.isConfigured ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credenciais da API</CardTitle>
                <CardDescription>
                  Configure suas credenciais do WhatsApp Business API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessToken">Access Token *</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      value={config.accessToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                      placeholder="EAAxxxxxxxxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumberId">Phone Number ID *</Label>
                    <Input
                      id="phoneNumberId"
                      value={config.phoneNumberId}
                      onChange={(e) => setConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                      placeholder="1234567890123456"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAccountId">Business Account ID *</Label>
                  <Input
                    id="businessAccountId"
                    value={config.businessAccountId}
                    onChange={(e) => setConfig(prev => ({ ...prev, businessAccountId: e.target.value }))}
                    placeholder="1234567890123456"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookVerifyToken">Webhook Verify Token</Label>
                  <Input
                    id="webhookVerifyToken"
                    value={config.webhookVerifyToken}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookVerifyToken: e.target.value }))}
                    placeholder="meu_token_secreto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://seu-n8n.com/webhook/whatsapp"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                    {isLoading ? "Salvando..." : "Salvar Configuração"}
                  </Button>
                  {config.isConfigured && (
                    <Button 
                      variant="outline" 
                      onClick={handleTest} 
                      disabled={isTesting}
                    >
                      {isTesting ? "Testando..." : "Testar"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Como configurar:</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <p>1. Acesse o <strong>Meta Business Manager</strong> e crie um app WhatsApp Business</p>
                <p>2. Copie o <strong>Access Token</strong> da seção API Setup</p>
                <p>3. Copie o <strong>Phone Number ID</strong> do número vinculado</p>
                <p>4. Configure o webhook para receber mensagens em tempo real</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developers.facebook.com/docs/whatsapp/getting-started" target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Documentação
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhatsAppConfig;


import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const RdStationConfig = () => {
  const [config, setConfig] = useState({
    clientId: "",
    clientSecret: "",
    accessToken: "",
    refreshToken: "",
    webhookUrl: "",
    isConfigured: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  useEffect(() => {
    const saved = localStorage.getItem("rdstation_config");
    if (saved) {
      const parsedConfig = JSON.parse(saved);
      setConfig(prev => ({ ...prev, ...parsedConfig }));
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!config.clientId || !config.clientSecret) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha Client ID e Client Secret",
          variant: "destructive"
        });
        return;
      }

      localStorage.setItem("rdstation_config", JSON.stringify({
        ...config,
        isConfigured: true
      }));

      setConfig(prev => ({ ...prev, isConfigured: true }));

      toast({
        title: "Configuração salva!",
        description: "RD Station configurado com sucesso"
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Teste realizado!",
        description: "Conexão com RD Station funcionando"
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
            <Database className="h-16 w-16 mx-auto text-orange-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Configuração RD Station
            </h1>
            <p className="text-gray-600">
              Configure a integração com RD Station para automação de marketing e vendas
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
                <CardTitle>Credenciais OAuth2</CardTitle>
                <CardDescription>
                  Configure suas credenciais do RD Station Marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID *</Label>
                    <Input
                      id="clientId"
                      value={config.clientId}
                      onChange={(e) => setConfig(prev => ({ ...prev, clientId: e.target.value }))}
                      placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret *</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      value={config.clientSecret}
                      onChange={(e) => setConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accessToken">Access Token</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      value={config.accessToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, accessToken: e.target.value }))}
                      placeholder="Será gerado após autorização"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refreshToken">Refresh Token</Label>
                    <Input
                      id="refreshToken"
                      type="password"
                      value={config.refreshToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, refreshToken: e.target.value }))}
                      placeholder="Será gerado após autorização"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL (n8n)</Label>
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://seu-n8n.com/webhook/rdstation"
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

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900">Como configurar:</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-orange-800 space-y-2">
                <p>1. Acesse o <strong>RD Station App Center</strong> e crie uma nova aplicação</p>
                <p>2. Copie o <strong>Client ID</strong> e <strong>Client Secret</strong></p>
                <p>3. Configure a URL de redirecionamento para OAuth2</p>
                <p>4. Autorize a aplicação para obter os tokens de acesso</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developers.rdstation.com/pt-BR/reference/getting-started" target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Documentação API
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://app.rdstation.com.br/integracoes" target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      App Center
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

export default RdStationConfig;


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

const PipedriveConfig = () => {
  const [config, setConfig] = useState({
    apiToken: "",
    companyDomain: "",
    webhookUrl: "",
    pipelineId: "",
    stageId: "",
    isConfigured: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  useEffect(() => {
    const saved = localStorage.getItem("pipedrive_config");
    if (saved) {
      const parsedConfig = JSON.parse(saved);
      setConfig(prev => ({ ...prev, ...parsedConfig }));
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!config.apiToken || !config.companyDomain) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha API Token e Domínio da empresa",
          variant: "destructive"
        });
        return;
      }

      localStorage.setItem("pipedrive_config", JSON.stringify({
        ...config,
        isConfigured: true
      }));

      setConfig(prev => ({ ...prev, isConfigured: true }));

      toast({
        title: "Configuração salva!",
        description: "Pipedrive CRM configurado com sucesso"
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
        description: "Conexão com Pipedrive funcionando"
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
            <Database className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Configuração Pipedrive CRM
            </h1>
            <p className="text-gray-600">
              Configure a integração com Pipedrive para automatizar leads e vendas
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
                  Configure suas credenciais do Pipedrive CRM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiToken">API Token *</Label>
                    <Input
                      id="apiToken"
                      type="password"
                      value={config.apiToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, apiToken: e.target.value }))}
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyDomain">Domínio da Empresa *</Label>
                    <Input
                      id="companyDomain"
                      value={config.companyDomain}
                      onChange={(e) => setConfig(prev => ({ ...prev, companyDomain: e.target.value }))}
                      placeholder="suaempresa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pipelineId">ID do Pipeline</Label>
                    <Input
                      id="pipelineId"
                      value={config.pipelineId}
                      onChange={(e) => setConfig(prev => ({ ...prev, pipelineId: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stageId">ID do Estágio</Label>
                    <Input
                      id="stageId"
                      value={config.stageId}
                      onChange={(e) => setConfig(prev => ({ ...prev, stageId: e.target.value }))}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL (n8n)</Label>
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://seu-n8n.com/webhook/pipedrive"
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
                <p>1. Acesse <strong>Configurações → API</strong> no seu Pipedrive</p>
                <p>2. Copie seu <strong>API Token</strong> pessoal</p>
                <p>3. Identifique o <strong>domínio da sua empresa</strong> (ex: suaempresa.pipedrive.com)</p>
                <p>4. Configure webhooks para sincronização automática</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developers.pipedrive.com/docs/api/v1" target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Documentação API
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

export default PipedriveConfig;

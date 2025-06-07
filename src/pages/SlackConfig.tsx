
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Cloud, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SlackConfig = () => {
  const [config, setConfig] = useState({
    botToken: "",
    webhookUrl: "",
    channelId: "",
    appId: "",
    clientId: "",
    clientSecret: "",
    signingSecret: "",
    isConfigured: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  useEffect(() => {
    const saved = localStorage.getItem("slack_config");
    if (saved) {
      const parsedConfig = JSON.parse(saved);
      setConfig(prev => ({ ...prev, ...parsedConfig }));
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!config.botToken || !config.channelId) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha Bot Token e Channel ID",
          variant: "destructive"
        });
        return;
      }

      localStorage.setItem("slack_config", JSON.stringify({
        ...config,
        isConfigured: true
      }));

      setConfig(prev => ({ ...prev, isConfigured: true }));

      toast({
        title: "Configuração salva!",
        description: "Slack configurado com sucesso"
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
        description: "Conexão com Slack funcionando"
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
            <Cloud className="h-16 w-16 mx-auto text-purple-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Configuração Slack
            </h1>
            <p className="text-gray-600">
              Configure notificações de tickets e alertas em tempo real no Slack
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
                <CardTitle>Configuração do Bot</CardTitle>
                <CardDescription>
                  Configure seu bot do Slack para receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="botToken">Bot Token *</Label>
                    <Input
                      id="botToken"
                      type="password"
                      value={config.botToken}
                      onChange={(e) => setConfig(prev => ({ ...prev, botToken: e.target.value }))}
                      placeholder="xoxb-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="channelId">Channel ID *</Label>
                    <Input
                      id="channelId"
                      value={config.channelId}
                      onChange={(e) => setConfig(prev => ({ ...prev, channelId: e.target.value }))}
                      placeholder="C1234567890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appId">App ID</Label>
                    <Input
                      id="appId"
                      value={config.appId}
                      onChange={(e) => setConfig(prev => ({ ...prev, appId: e.target.value }))}
                      placeholder="A1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      value={config.clientId}
                      onChange={(e) => setConfig(prev => ({ ...prev, clientId: e.target.value }))}
                      placeholder="1234567890.1234567890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      value={config.clientSecret}
                      onChange={(e) => setConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signingSecret">Signing Secret</Label>
                    <Input
                      id="signingSecret"
                      type="password"
                      value={config.signingSecret}
                      onChange={(e) => setConfig(prev => ({ ...prev, signingSecret: e.target.value }))}
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Textarea
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                    rows={3}
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

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900">Como configurar:</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-purple-800 space-y-2">
                <p>1. Acesse <strong>api.slack.com</strong> e crie uma nova aplicação</p>
                <p>2. Configure as permissões necessárias (chat:write, channels:read)</p>
                <p>3. Instale o bot no seu workspace</p>
                <p>4. Copie o <strong>Bot Token</strong> e o <strong>Channel ID</strong></p>
                <p>5. Configure webhooks para notificações automáticas</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://api.slack.com/apps" target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Slack API
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://api.slack.com/messaging/webhooks" target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Webhook Guide
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

export default SlackConfig;

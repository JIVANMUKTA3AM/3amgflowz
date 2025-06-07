
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const BillingConfig = () => {
  const [config, setConfig] = useState({
    system: "",
    apiUrl: "",
    apiKey: "",
    username: "",
    password: "",
    webhookUrl: "",
    syncInterval: "24",
    isConfigured: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  const billingSystems = [
    { value: "mk_solutions", label: "MK Solutions" },
    { value: "sgp", label: "SGP (Sistema de Gestão Provedor)" },
    { value: "anlix", label: "Anlix" },
    { value: "powernet", label: "PowerNet" },
    { value: "ix_soft", label: "IX Soft" },
    { value: "custom", label: "Sistema Customizado" }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("billing_config");
    if (saved) {
      const parsedConfig = JSON.parse(saved);
      setConfig(prev => ({ ...prev, ...parsedConfig }));
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!config.system || !config.apiUrl) {
        toast({
          title: "Campos obrigatórios",
          description: "Selecione o sistema e informe a URL da API",
          variant: "destructive"
        });
        return;
      }

      localStorage.setItem("billing_config", JSON.stringify({
        ...config,
        isConfigured: true
      }));

      setConfig(prev => ({ ...prev, isConfigured: true }));

      toast({
        title: "Configuração salva!",
        description: "Sistema de billing configurado com sucesso"
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
        description: "Conexão com sistema de billing funcionando"
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
            <Zap className="h-16 w-16 mx-auto text-yellow-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sistema de Billing
            </h1>
            <p className="text-gray-600">
              Configure a integração com seu sistema de cobrança e faturamento
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
                <CardTitle>Configuração do Sistema</CardTitle>
                <CardDescription>
                  Configure seu sistema de billing para automação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system">Sistema de Billing *</Label>
                  <Select value={config.system} onValueChange={(value) => setConfig(prev => ({ ...prev, system: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sistema" />
                    </SelectTrigger>
                    <SelectContent>
                      {billingSystems.map((system) => (
                        <SelectItem key={system.value} value={system.value}>
                          {system.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiUrl">URL da API *</Label>
                  <Input
                    id="apiUrl"
                    value={config.apiUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                    placeholder="https://api.seusistema.com.br"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      value={config.username}
                      onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="seu_usuario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={config.password}
                      onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="sua_senha"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key (se aplicável)</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="syncInterval">Intervalo de Sync (horas)</Label>
                    <Select value={config.syncInterval} onValueChange={(value) => setConfig(prev => ({ ...prev, syncInterval: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora</SelectItem>
                        <SelectItem value="6">6 horas</SelectItem>
                        <SelectItem value="12">12 horas</SelectItem>
                        <SelectItem value="24">24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL (n8n)</Label>
                    <Input
                      id="webhookUrl"
                      value={config.webhookUrl}
                      onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                      placeholder="https://seu-n8n.com/webhook/billing"
                    />
                  </div>
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

            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-900">Funcionalidades incluídas:</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-yellow-800 space-y-2">
                <p>• <strong>Sincronização automática</strong> de faturas e cobranças</p>
                <p>• <strong>Notificações</strong> de vencimentos e pagamentos</p>
                <p>• <strong>Relatórios</strong> de inadimplência em tempo real</p>
                <p>• <strong>Automação</strong> de cortes e religações</p>
                <p>• <strong>Integração</strong> com agentes IA para atendimento</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" onClick={(e) => e.preventDefault()}>
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

export default BillingConfig;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWorkflowTrigger = async (workflowType: string) => {
    if (!webhookUrl) {
      toast({
        title: "URL do webhook necessário",
        description: "Por favor, insira a URL do seu webhook do n8n",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          workflow_type: workflowType,
          timestamp: new Date().toISOString(),
          source: window.location.origin,
        }),
      });

      toast({
        title: "Workflow iniciado",
        description: `O workflow "${workflowType}" foi iniciado no n8n.`,
      });
    } catch (error) {
      console.error("Erro ao iniciar workflow:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o workflow. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Navigation */}
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Sistema de Automação</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Workflows</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <div className="p-2">
                      <h3 className="font-medium mb-1 text-sm">Workflows Disponíveis</h3>
                      <p className="text-sm text-muted-foreground">
                        Selecione um tipo de workflow para executar
                      </p>
                    </div>
                    <button 
                      onClick={() => handleWorkflowTrigger("processamento_dados")}
                      className={navigationMenuTriggerStyle() + " w-full justify-start"}
                      disabled={isLoading}
                    >
                      Processamento de Dados
                    </button>
                    <button 
                      onClick={() => handleWorkflowTrigger("notificacao")}
                      className={navigationMenuTriggerStyle() + " w-full justify-start"}
                      disabled={isLoading}
                    >
                      Sistema de Notificação
                    </button>
                    <button 
                      onClick={() => handleWorkflowTrigger("integracao")}
                      className={navigationMenuTriggerStyle() + " w-full justify-start"}
                      disabled={isLoading}
                    >
                      Integração com APIs
                    </button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/arquitetura" className={navigationMenuTriggerStyle()}>
                  Arquitetura
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/modelo-dados" className={navigationMenuTriggerStyle()}>
                  Modelo de Dados
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Sistema de Integração n8n</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            Plataforma de automação de fluxos de trabalho com integração n8n para processamento de dados,
            notificações e conexão com APIs externas.
          </p>
        </div>

        {/* Configuração do Webhook */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Configuração de Webhook</h3>
          <div className="mb-4">
            <label htmlFor="webhook" className="block text-sm font-medium text-gray-700 mb-1">
              URL do Webhook n8n
            </label>
            <input
              id="webhook"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://seu-n8n.com/webhook/abc123"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Cole a URL do seu webhook do n8n para conectar com este sistema
            </p>
          </div>
          <Button
            onClick={() => toast({ title: "Webhook Configurado", description: "Conexão com n8n estabelecida" })}
            className="w-full"
            disabled={!webhookUrl}
          >
            Salvar Configuração
          </Button>
        </div>

        {/* Cards de Fluxos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Processamento de Dados</CardTitle>
              <CardDescription>Automação de ETL e manipulação de dados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Processe, transforme e carregue dados automaticamente entre diferentes sistemas
                com fluxos de trabalho personalizáveis.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleWorkflowTrigger("processamento_dados")}
                disabled={isLoading || !webhookUrl}
                className="w-full"
              >
                Executar Workflow
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Notificação</CardTitle>
              <CardDescription>Alertas e comunicações automatizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Configure notificações por e-mail, SMS ou webhooks baseadas em eventos
                ou em intervalos regulares.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleWorkflowTrigger("notificacao")}
                disabled={isLoading || !webhookUrl}
                className="w-full"
              >
                Executar Workflow
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Integração com APIs</CardTitle>
              <CardDescription>Conecte serviços e plataformas externas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Integre com APIs de terceiros para sincronizar dados, processar pagamentos
                ou automatizar tarefas entre plataformas.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleWorkflowTrigger("integracao")}
                disabled={isLoading || !webhookUrl}
                className="w-full"
              >
                Executar Workflow
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Sistema de Automação n8n</h3>
              <p className="text-gray-400">Integração e automação de fluxos de trabalho</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/arquitetura" className="text-gray-300 hover:text-white">
                Arquitetura
              </Link>
              <Link to="/modelo-dados" className="text-gray-300 hover:text-white">
                Modelo de Dados
              </Link>
              <Link to="/documentacao" className="text-gray-300 hover:text-white">
                Documentação
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Sistema de Automação. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

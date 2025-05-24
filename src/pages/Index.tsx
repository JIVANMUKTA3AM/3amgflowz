
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WebhookConfig from "@/components/WebhookConfig";
import WebhookSpecificConfig from "@/components/WebhookSpecificConfig";
import WorkflowCards from "@/components/WorkflowCards";
import AgentesResumo from "@/components/AgentesResumo";
import AgentServiceStatus from "@/components/AgentServiceStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      await fetch(webhookUrl, {
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
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Sistema de Integração n8n</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            Plataforma de automação de fluxos de trabalho com integração n8n para processamento de dados,
            notificações e conexão com APIs externas.
          </p>
        </div>

        {/* Resumo dos Agentes e Status de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AgentesResumo />
          <AgentServiceStatus />
        </div>

        {/* Configuração de Webhooks com Tabs */}
        <div className="mb-8">
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="global">Webhook Global</TabsTrigger>
              <TabsTrigger value="specific">Webhooks por Agente</TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="mt-6">
              <WebhookConfig webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} />
            </TabsContent>
            
            <TabsContent value="specific" className="mt-6">
              <WebhookSpecificConfig />
            </TabsContent>
          </Tabs>
        </div>

        {/* Cards de Fluxos */}
        <WorkflowCards 
          handleWorkflowTrigger={handleWorkflowTrigger} 
          isLoading={isLoading} 
          webhookUrl={webhookUrl} 
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;

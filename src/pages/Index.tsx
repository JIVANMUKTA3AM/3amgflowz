
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* Header com Navigation */}
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />

      {/* Hero Section with gradient background */}
      <section className="bg-gradient-3amg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Routine with 3AMG
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Solução inteligente para automatizar, monitorar e gerenciar processos de forma eficiente.
              Plataforma de automação com integração n8n para processamento de dados e conexão com APIs externas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center text-white/90">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Aumento da centralização da equipe por semana</span>
              </div>
              <div className="flex items-center text-white/90">
                <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                <span>Automação eficiente de tarefas rotineiras</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-12">
        {/* Resumo dos Agentes e Status de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <AgentesResumo />
          <AgentServiceStatus />
        </div>

        {/* Configuração de Webhooks com Tabs */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Configuração de Webhooks</h2>
            <p className="text-gray-600">Configure os webhooks para integração com n8n e automação de fluxos</p>
          </div>
          
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
              <TabsTrigger value="global" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
                Webhook Global
              </TabsTrigger>
              <TabsTrigger value="specific" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
                Webhooks por Agente
              </TabsTrigger>
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
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fluxos de Automação</h2>
            <p className="text-gray-600">Inicie workflows automatizados para diferentes processos</p>
          </div>
          <WorkflowCards 
            handleWorkflowTrigger={handleWorkflowTrigger} 
            isLoading={isLoading} 
            webhookUrl={webhookUrl} 
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;

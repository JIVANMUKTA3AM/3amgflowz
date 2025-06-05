
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WebhookConfig from "@/components/WebhookConfig";
import WebhookSpecificConfig from "@/components/WebhookSpecificConfig";
import WorkflowCards from "@/components/WorkflowCards";
import AgentesResumo from "@/components/AgentesResumo";
import AgentServiceStatus from "@/components/AgentServiceStatus";
import FiberOpticBackground from "@/components/FiberOpticBackground";
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

      {/* Hero Section with agents background and fiber optic animations */}
      <section className="bg-gradient-3amg relative overflow-hidden min-h-[600px]">
        {/* Background image of agents operating the system */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/lovable-uploads/0397339e-530f-4d97-99d5-4ba944cd434d.png)`,
          }}
        ></div>
        
        {/* Fiber optic overlay */}
        <FiberOpticBackground />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-20">
          <div className="text-center text-white max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Revolucione o <span className="text-cyan-400">Atendimento</span> do seu Provedor de Internet
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <strong className="text-cyan-300">Agentes IA especializados</strong> que eliminam filas de espera, resolvem problemas técnicos em tempo real 
              e oferecem suporte humanizado 24/7 para seus clientes.
            </p>
            
            {/* Pain Points Addressed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold mb-2 text-cyan-300">Atendimento Instantâneo</h3>
                <p className="text-sm opacity-90">Elimine filas de espera com agentes que respondem em segundos, não em horas</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-cyan-300">Suporte Técnico Especializado</h3>
                <p className="text-sm opacity-90">Agentes treinados para resolver problemas de conectividade, configuração e infraestrutura</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-lg font-semibold mb-2 text-cyan-300">Comunicação Humanizada</h3>
                <p className="text-sm opacity-90">Linguagem natural e empática que mantém seus clientes satisfeitos e engajados</p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center text-white/95 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="font-medium">Redução de 80% no tempo de resolução</span>
              </div>
              <div className="flex items-center text-white/95 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
                <span className="font-medium">Satisfação do cliente acima de 95%</span>
              </div>
              <div className="flex items-center text-white/95 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
                <span className="font-medium">Disponibilidade 24/7 sem pausas</span>
              </div>
            </div>

            {/* CTA Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <p className="text-lg mb-6 text-cyan-200">
                Transforme reclamações em elogios com nossa plataforma de automação inteligente
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                  Começar Agora
                </button>
                <button className="border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:bg-white/10">
                  Ver Demonstração
                </button>
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

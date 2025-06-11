
import { useState } from "react";
import { BarChart3, MessageCircle, Users, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientHeader from "@/components/client/ClientHeader";
import MetricsCards from "@/components/client/MetricsCards";
import AgentsOverview from "@/components/client/AgentsOverview";
import ChannelsOverview from "@/components/client/ChannelsOverview";
import ChatTab from "@/components/client/ChatTab";
import LogsTab from "@/components/client/LogsTab";
import SettingsTab from "@/components/client/SettingsTab";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Métricas simuladas do cliente
  const clientMetrics = {
    conversasHoje: 24,
    conversasMes: 456,
    tempoMedioResposta: "2.3s",
    taxaResolucao: "87%",
    agentesAtivos: 3,
    integracoesAtivas: 2
  };

  // Dados mock para os componentes - seguindo as interfaces corretas
  const mockConfigurations = [
    {
      id: "1",
      user_id: "user-123",
      name: "Atendimento Geral",
      agent_type: "customer_service",
      prompt: "Você é um assistente de atendimento geral especializado em ajudar clientes.",
      model: "gemini-1.5-flash",
      temperature: 0.7,
      max_tokens: 1000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2", 
      user_id: "user-123",
      name: "Suporte Técnico",
      agent_type: "technical_support",
      prompt: "Você é um especialista em suporte técnico para resolver problemas de internet e equipamentos.",
      model: "gpt-4-omni",
      temperature: 0.5,
      max_tokens: 1500,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const mockConversations = [
    {
      id: "1",
      user_id: "user-123",
      agent_configuration_id: "1",
      session_id: "session_1",
      user_message: "Preciso de ajuda com minha conta",
      agent_response: "Claro! Como posso ajudar você com sua conta?",
      response_time_ms: 1200,
      tokens_used: 45,
      model_used: "gemini-1.5-flash",
      created_at: new Date().toISOString()
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      <ClientHeader />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg border border-white/50">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-3amg-purple data-[state=active]:to-3amg-blue data-[state=active]:text-white transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-3amg-purple data-[state=active]:to-3amg-blue data-[state=active]:text-white transition-all duration-300"
            >
              <MessageCircle className="h-4 w-4" />
              Chat ao Vivo
            </TabsTrigger>
            <TabsTrigger 
              value="logs" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-3amg-purple data-[state=active]:to-3amg-blue data-[state=active]:text-white transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              Conversas
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-3amg-purple data-[state=active]:to-3amg-blue data-[state=active]:text-white transition-all duration-300"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <MetricsCards metrics={clientMetrics} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AgentsOverview />
              <ChannelsOverview />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-8">
            <ChatTab configurations={mockConfigurations} />
          </TabsContent>

          <TabsContent value="logs" className="mt-8">
            <LogsTab 
              conversations={mockConversations} 
              configurations={mockConfigurations} 
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;

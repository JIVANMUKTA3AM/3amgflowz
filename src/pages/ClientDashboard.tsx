import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BarChart3, MessageCircle, Users, Settings, Users2, Home, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientHeader from "@/components/client/ClientHeader";
import ClientDashboardOptions from "@/components/client/ClientDashboardOptions";
import AttendancePanel from "@/components/client/AttendancePanel";
import MetricsCards from "@/components/client/MetricsCards";
import AgentsOverview from "@/components/client/AgentsOverview";
import ChannelsOverview from "@/components/client/ChannelsOverview";
import MonitoringOverview from "@/components/client/MonitoringOverview";
import ChatTab from "@/components/client/ChatTab";
import LogsTab from "@/components/client/LogsTab";
import SettingsTab from "@/components/client/SettingsTab";
import CRMMetrics from "@/components/crm/CRMMetrics";
import ClientsList from "@/components/crm/ClientsList";
import SalesPipeline from "@/components/crm/SalesPipeline";
import InteractionHistory from "@/components/crm/InteractionHistory";
import ClientForm from "@/components/crm/ClientForm";
import FiscalApiConfig from "@/components/payment/FiscalApiConfig";
import FiscalNotesList from "@/components/payment/FiscalNotesList";

const ClientDashboard = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "home");
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const clientMetrics = {
    conversasHoje: 24,
    conversasMes: 456,
    tempoMedioResposta: "2.3s",
    taxaResolucao: "87%",
    agentesAtivos: 3,
    integracoesAtivas: 2
  };

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
    <div className="min-h-screen bg-3amg-dark">
      <ClientHeader />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-gray-900/80 backdrop-blur-sm border border-gray-700 p-1 rounded-lg shadow-lg">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background transition-all duration-300"
            >
              <Home className="h-4 w-4" />
              Início
            </TabsTrigger>
            <TabsTrigger 
              value="attendance" 
              className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              Atendimento
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background transition-all duration-300"
            >
              <MessageCircle className="h-4 w-4" />
              Chat ao Vivo
            </TabsTrigger>
            <TabsTrigger 
              value="logs" 
              className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4" />
              Conversas
            </TabsTrigger>
            <TabsTrigger 
              value="crm" 
              className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background transition-all duration-300"
            >
              <Users2 className="h-4 w-4" />
              CRM
            </TabsTrigger>
            <TabsTrigger 
              value="notas-fiscais" 
              className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background transition-all duration-300"
            >
              <FileText className="h-4 w-4" />
              Notas Fiscais
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background transition-all duration-300"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-8">
            <ClientDashboardOptions />
          </TabsContent>

          <TabsContent value="attendance" className="mt-8">
            <AttendancePanel />
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

          <TabsContent value="crm" className="mt-8">
            <div className="space-y-8">
              <CRMMetrics className="mb-8" />

              <Tabs defaultValue="clients" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-1">
                  <TabsTrigger value="clients" className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background">
                    <Users className="h-4 w-4" />
                    Clientes
                  </TabsTrigger>
                  <TabsTrigger value="pipeline" className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background">
                    <BarChart3 className="h-4 w-4" />
                    Pipeline
                  </TabsTrigger>
                  <TabsTrigger value="interactions" className="flex items-center gap-2 text-white data-[state=active]:text-foreground data-[state=active]:bg-background">
                    <MessageCircle className="h-4 w-4" />
                    Interações
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="clients" className="space-y-6">
                  <ClientsList 
                    onEditClient={(clientId) => {
                      setSelectedClientId(clientId);
                      setIsClientFormOpen(true);
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="pipeline" className="space-y-6">
                  <SalesPipeline />
                </TabsContent>
                
                <TabsContent value="interactions" className="space-y-6">
                  <InteractionHistory />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="notas-fiscais" className="mt-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Notas Fiscais Eletrônicas
                </h2>
                <p className="text-gray-400">
                  Gerencie a emissão de NF-e/NFS-e integrado com NFE.io ou eNotas
                </p>
              </div>

              <Tabs defaultValue="notas" className="space-y-6">
                <TabsList className="bg-gray-900/50 border border-gray-700/50">
                  <TabsTrigger value="notas" className="data-[state=active]:bg-purple-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Notas Emitidas
                  </TabsTrigger>
                  <TabsTrigger value="config" className="data-[state=active]:bg-purple-600">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notas" className="space-y-6">
                  <FiscalNotesList />
                </TabsContent>

                <TabsContent value="config" className="space-y-6">
                  <FiscalApiConfig />
                  
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <h3 className="text-blue-400 font-semibold mb-2">📌 Como configurar:</h3>
                    <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                      <li>Escolha seu provedor fiscal (NFE.io, eNotas ou outro)</li>
                      <li>Cole o token de API fornecido pelo provedor</li>
                      <li>Configure a URL da API (opcional, usa padrão se vazio)</li>
                      <li>Após salvar, você poderá emitir notas nas faturas pagas</li>
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>

      <ClientForm
        isOpen={isClientFormOpen}
        onClose={() => {
          setIsClientFormOpen(false);
          setSelectedClientId(null);
        }}
        clientId={selectedClientId}
      />
    </div>
  );
};

export default ClientDashboard;

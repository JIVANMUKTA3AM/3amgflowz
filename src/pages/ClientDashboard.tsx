
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, BarChart3, Settings, Users, Zap, Clock, TrendingUp, Shield, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentChat from "@/components/agents/AgentChat";
import ConversationLogs from "@/components/agents/ConversationLogs";

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
      {/* Header do Cliente com gradiente 3AMG */}
      <div className="relative bg-gradient-3amg shadow-xl border-b overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">Dashboard do Cliente</h1>
              <p className="text-white/90 text-lg">Gerencie seus agentes de IA e monitore atendimentos em tempo real</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                <Shield className="inline w-4 h-4 mr-2" />
                Plano Pro Ativo
              </div>
            </div>
          </div>
        </div>
      </div>

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
            {/* Cards de Métricas com gradientes e animações */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Conversas Hoje</CardTitle>
                  <MessageCircle className="h-5 w-5 text-white/80" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold mb-1">{clientMetrics.conversasHoje}</div>
                  <div className="flex items-center text-white/80 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% em relação a ontem
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-3amg-purple to-3amg-indigo text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Conversas do Mês</CardTitle>
                  <BarChart3 className="h-5 w-5 text-white/80" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold mb-1">{clientMetrics.conversasMes}</div>
                  <div className="flex items-center text-white/80 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +23% em relação ao mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-3amg-blue to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Tempo Médio</CardTitle>
                  <Clock className="h-5 w-5 text-white/80" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold mb-1">{clientMetrics.tempoMedioResposta}</div>
                  <div className="flex items-center text-white/80 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    Tempo de resposta
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Taxa de Resolução</CardTitle>
                  <Zap className="h-5 w-5 text-white/80" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold mb-1">{clientMetrics.taxaResolucao}</div>
                  <div className="flex items-center text-white/80 text-sm">
                    <Zap className="w-4 h-4 mr-1" />
                    Problemas resolvidos
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Agentes Ativos</CardTitle>
                  <Users className="h-5 w-5 text-white/80" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold mb-1">{clientMetrics.agentesAtivos}</div>
                  <div className="flex items-center text-white/80 text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    Funcionando perfeitamente
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Integrações</CardTitle>
                  <Globe className="h-5 w-5 text-white/80" />
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold mb-1">{clientMetrics.integracoesAtivas}</div>
                  <div className="flex items-center text-white/80 text-sm">
                    <Globe className="w-4 h-4 mr-1" />
                    WhatsApp, Website
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo dos Agentes e Canais com design melhorado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
                  <CardTitle className="text-2xl text-3amg-purple flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Seus Agentes de IA
                  </CardTitle>
                  <CardDescription className="text-gray-600">Agentes configurados para seu atendimento</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
                      <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="font-semibold text-emerald-800">Atendimento Geral</h4>
                        <p className="text-sm text-emerald-600 mt-1">Dúvidas e suporte básico</p>
                      </div>
                      <div className="mt-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">Ativo</div>
                    </div>
                    
                    <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="font-semibold text-blue-800">Suporte Técnico</h4>
                        <p className="text-sm text-blue-600 mt-1">Problemas de internet e equipamentos</p>
                      </div>
                      <div className="mt-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">Ativo</div>
                    </div>
                    
                    <div className="relative p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                      <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Comercial</h4>
                        <p className="text-sm text-purple-600 mt-1">Vendas e novos planos</p>
                      </div>
                      <div className="mt-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">Ativo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-3amg-blue/10 to-3amg-indigo/10 rounded-t-lg">
                  <CardTitle className="text-2xl text-3amg-blue flex items-center gap-2">
                    <Globe className="w-6 h-6" />
                    Canais Integrados
                  </CardTitle>
                  <CardDescription className="text-gray-600">Onde seus agentes estão atendendo</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                          W
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800">WhatsApp Business</h4>
                          <p className="text-sm text-green-600">+55 11 99999-9999</p>
                        </div>
                      </div>
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Conectado</div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                          S
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800">Site da Empresa</h4>
                          <p className="text-sm text-blue-600">Chat widget integrado</p>
                        </div>
                      </div>
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">Conectado</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
                <CardTitle className="text-2xl text-3amg-purple flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Teste seus Agentes
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Converse com seus agentes para testar respostas e configurações
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AgentChat configurations={mockConfigurations} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-3amg-blue/10 to-3amg-indigo/10 rounded-t-lg">
                <CardTitle className="text-2xl text-3amg-blue flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Histórico de Conversas
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Veja todas as conversas dos seus clientes com os agentes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ConversationLogs 
                  conversations={mockConversations} 
                  configurations={mockConfigurations} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
                  <CardTitle className="text-xl text-3amg-purple">Configurações da Empresa</CardTitle>
                  <CardDescription>Informações básicas do seu negócio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Nome da Empresa</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-purple focus:border-transparent transition-all duration-300"
                      placeholder="Sua Empresa Ltda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Horário de Funcionamento</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-purple focus:border-transparent transition-all duration-300"
                      placeholder="Segunda à Sexta, 8h às 18h"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Mensagem de Boas-vindas</label>
                    <textarea 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-purple focus:border-transparent transition-all duration-300"
                      rows={3}
                      placeholder="Olá! Sou seu assistente virtual. Como posso ajudar?"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-3amg-purple to-3amg-blue hover:from-3amg-purple-dark hover:to-3amg-blue-dark text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-3amg-blue/10 to-3amg-indigo/10 rounded-t-lg">
                  <CardTitle className="text-xl text-3amg-blue">Configurações de Atendimento</CardTitle>
                  <CardDescription>Como seus agentes devem se comportar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Transferir para humano quando:</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-blue focus:border-transparent transition-all duration-300">
                      <option>Cliente solicitar</option>
                      <option>Problema não resolvido em 3 tentativas</option>
                      <option>Questão muito complexa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Tom de voz</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-blue focus:border-transparent transition-all duration-300">
                      <option>Formal e profissional</option>
                      <option>Amigável e descontraído</option>
                      <option>Técnico e direto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Palavras-chave do seu negócio</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-blue focus:border-transparent transition-all duration-300"
                      placeholder="internet, fibra óptica, velocidade, suporte"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-3amg-blue to-3amg-indigo hover:from-3amg-blue-dark hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                    Atualizar Comportamento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;

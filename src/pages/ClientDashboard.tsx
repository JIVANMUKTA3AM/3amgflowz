
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, BarChart3, Settings, Users, Zap, Clock } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* Header do Cliente */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Cliente</h1>
              <p className="text-gray-600">Gerencie seus agentes de IA e monitore atendimentos</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Plano Pro Ativo
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat ao Vivo
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Conversas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientMetrics.conversasHoje}</div>
                  <p className="text-xs text-muted-foreground">+12% em relação a ontem</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversas do Mês</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientMetrics.conversasMes}</div>
                  <p className="text-xs text-muted-foreground">+23% em relação ao mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientMetrics.tempoMedioResposta}</div>
                  <p className="text-xs text-muted-foreground">Tempo de resposta</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientMetrics.taxaResolucao}</div>
                  <p className="text-xs text-muted-foreground">Problemas resolvidos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientMetrics.agentesAtivos}</div>
                  <p className="text-xs text-muted-foreground">Funcionando perfeitamente</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Integrações</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientMetrics.integracoesAtivas}</div>
                  <p className="text-xs text-muted-foreground">WhatsApp, Website</p>
                </CardContent>
              </Card>
            </div>

            {/* Resumo dos Agentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seus Agentes de IA</CardTitle>
                  <CardDescription>Agentes configurados para seu atendimento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Atendimento Geral</h4>
                        <p className="text-sm text-gray-600">Dúvidas e suporte básico</p>
                      </div>
                      <div className="bg-green-500 text-white px-2 py-1 rounded text-xs">Ativo</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Suporte Técnico</h4>
                        <p className="text-sm text-gray-600">Problemas de internet e equipamentos</p>
                      </div>
                      <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Ativo</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Comercial</h4>
                        <p className="text-sm text-gray-600">Vendas e novos planos</p>
                      </div>
                      <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs">Ativo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Canais Integrados</CardTitle>
                  <CardDescription>Onde seus agentes estão atendendo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                          W
                        </div>
                        <div>
                          <h4 className="font-medium">WhatsApp Business</h4>
                          <p className="text-sm text-gray-600">+55 11 99999-9999</p>
                        </div>
                      </div>
                      <div className="bg-green-500 text-white px-2 py-1 rounded text-xs">Conectado</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                          S
                        </div>
                        <div>
                          <h4 className="font-medium">Site da Empresa</h4>
                          <p className="text-sm text-gray-600">Chat widget integrado</p>
                        </div>
                      </div>
                      <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Conectado</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Teste seus Agentes</CardTitle>
                <CardDescription>
                  Converse com seus agentes para testar respostas e configurações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AgentChat />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Conversas</CardTitle>
                <CardDescription>
                  Veja todas as conversas dos seus clientes com os agentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConversationLogs />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações da Empresa</CardTitle>
                  <CardDescription>Informações básicas do seu negócio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Sua Empresa Ltda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Horário de Funcionamento</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Segunda à Sexta, 8h às 18h"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Mensagem de Boas-vindas</label>
                    <textarea 
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Olá! Sou seu assistente virtual. Como posso ajudar?"
                    />
                  </div>
                  <Button className="w-full">Salvar Configurações</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Atendimento</CardTitle>
                  <CardDescription>Como seus agentes devem se comportar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Transferir para humano quando:</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>Cliente solicitar</option>
                      <option>Problema não resolvido em 3 tentativas</option>
                      <option>Questão muito complexa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tom de voz</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      <option>Formal e profissional</option>
                      <option>Amigável e descontraído</option>
                      <option>Técnico e direto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Palavras-chave do seu negócio</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="internet, fibra óptica, velocidade, suporte"
                    />
                  </div>
                  <Button className="w-full">Atualizar Comportamento</Button>
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

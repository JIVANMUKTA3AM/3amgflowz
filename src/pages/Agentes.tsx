
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Settings, BarChart3, Zap, MessageSquare } from "lucide-react";
import AgentsTabContent from "@/components/agents/AgentsTabContent";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";

const Agentes = () => {
  const [activeTab, setActiveTab] = useState("agents");
  const { configurations, conversations, isLoading } = useAgentConfigurations();


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agentes IA</h1>
              <p className="text-gray-600">
                Configure e gerencie seus agentes inteligentes para automação de atendimento
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{configurations.length}</p>
                      <p className="text-sm text-gray-600">Total de Agentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {configurations.filter(c => c.is_active).length}
                      </p>
                      <p className="text-sm text-gray-600">Agentes Ativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{conversations.length}</p>
                      <p className="text-sm text-gray-600">Conversas Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {conversations.length > 0 
                          ? Math.round(conversations.reduce((acc, conv) => acc + (conv.response_time_ms || 0), 0) / conversations.length) + 'ms'
                          : '-'
                        }
                      </p>
                      <p className="text-sm text-gray-600">Tempo Médio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agents">Agentes</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="mt-6">
            <AgentsTabContent />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas e Performance</CardTitle>
                <CardDescription>
                  Análise detalhada da performance dos seus agentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Métricas em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Configure integrações com WhatsApp, Telegram e outras plataformas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Integrações em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflows e Automações</CardTitle>
                <CardDescription>
                  Configure fluxos automatizados e regras de negócio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Workflows em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Agentes;

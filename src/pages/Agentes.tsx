
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Settings, BarChart3, Zap, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AgentsTabContent from "@/components/agents/AgentsTabContent";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";

const Agentes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agents");
  const { configurations, conversations, isLoading } = useAgentConfigurations();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { 
        state: { 
          from: { pathname: '/agentes' },
          message: 'Você precisa estar logado para acessar os agentes.' 
        } 
      });
    }
  }, [user, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-3amg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-3amg-orange mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-3amg-dark flex items-center justify-center px-4">
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg max-w-md">
          <CardHeader className="text-center">
            <div className="p-3 bg-3amg-orange/20 rounded-full w-fit mx-auto mb-4">
              <Bot className="h-8 w-8 text-3amg-orange" />
            </div>
            <CardTitle className="text-white">Acesso Restrito</CardTitle>
            <CardDescription className="text-gray-300">
              Você precisa estar autenticado para acessar a gestão de agentes IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full bg-3amg-orange hover:bg-3amg-orange/90"
            >
              Fazer Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-3amg-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-3amg-orange/20 rounded-lg backdrop-blur-sm">
              <Bot className="h-6 w-6 text-3amg-orange" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Agentes IA</h1>
              <p className="text-gray-300">
                Configure e gerencie seus agentes inteligentes para automação de atendimento
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-3amg-orange" />
                    <div>
                      <p className="text-2xl font-bold text-white">{configurations.length}</p>
                      <p className="text-sm text-gray-300">Total de Agentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {configurations.filter(c => c.is_active).length}
                      </p>
                      <p className="text-sm text-gray-300">Agentes Ativos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-3amg-purple" />
                    <div>
                      <p className="text-2xl font-bold text-white">{conversations.length}</p>
                      <p className="text-sm text-gray-300">Conversas Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {conversations.length > 0 
                          ? Math.round(conversations.reduce((acc, conv) => acc + (conv.response_time_ms || 0), 0) / conversations.length) + 'ms'
                          : '-'
                        }
                      </p>
                      <p className="text-sm text-gray-300">Tempo Médio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <TabsTrigger value="agents" className="text-white data-[state=active]:bg-3amg-orange data-[state=active]:text-white">Agentes</TabsTrigger>
            <TabsTrigger value="metrics" className="text-white data-[state=active]:bg-3amg-orange data-[state=active]:text-white">Métricas</TabsTrigger>
            <TabsTrigger value="integrations" className="text-white data-[state=active]:bg-3amg-orange data-[state=active]:text-white">Integrações</TabsTrigger>
            <TabsTrigger value="workflows" className="text-white data-[state=active]:bg-3amg-orange data-[state=active]:text-white">Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="mt-6">
            <AgentsTabContent />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Métricas e Performance</CardTitle>
                <CardDescription className="text-gray-300">
                  Análise detalhada da performance dos seus agentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-400 py-8">
                  Métricas em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Integrações</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure integrações com WhatsApp, Telegram e outras plataformas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-400 py-8">
                  Integrações em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="mt-6">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Workflows e Automações</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure fluxos automatizados e regras de negócio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-400 py-8">
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

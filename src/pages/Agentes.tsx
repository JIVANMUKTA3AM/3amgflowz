
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Bot, MessageCircle, BarChart3, Settings, Play } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import AgentConfigurationForm from "@/components/agents/AgentConfigurationForm";
import ConversationLogs from "@/components/agents/ConversationLogs";
import AgentMetrics from "@/components/agents/AgentMetrics";
import AgentChat from "@/components/agents/AgentChat";

const Agentes = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();
  const {
    configurations,
    conversations,
    metrics,
    isLoading,
    createConfiguration,
    isCreating,
    updateConfiguration,
    isUpdating,
    deleteConfiguration,
    isDeleting,
  } = useAgentConfigurations();

  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);

  const handleSaveAgent = (agentData: any) => {
    if (editingAgent) {
      updateConfiguration({ id: editingAgent, ...agentData });
    } else {
      createConfiguration(agentData);
    }
    setShowForm(false);
    setEditingAgent(null);
  };

  const handleEditAgent = (agentId: string) => {
    setEditingAgent(agentId);
    setShowForm(true);
  };

  const editingConfiguration = editingAgent 
    ? configurations?.find(config => config.id === editingAgent)
    : undefined;

  const activeAgents = configurations?.filter(config => config.is_active).length || 0;
  const totalConversations = conversations?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando agentes...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Agentes de IA
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Configure, monitore e converse com seus agentes de inteligência artificial
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Agentes Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Conversas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Configurações</p>
                  <p className="text-2xl font-bold text-gray-900">{configurations?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="configurations" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Métricas
            </TabsTrigger>
            <TabsTrigger value="training" className="gap-2">
              <Play className="h-4 w-4" />
              Treinamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <AgentChat configurations={configurations || []} />
          </TabsContent>
          
          <TabsContent value="configurations">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Configurações dos Agentes</h2>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Agente
                </Button>
              </div>

              {showForm && (
                <AgentConfigurationForm
                  configuration={editingConfiguration}
                  onSave={handleSaveAgent}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingAgent(null);
                  }}
                  isLoading={isCreating || isUpdating}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {configurations?.map((config) => (
                  <Card key={config.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{config.name}</CardTitle>
                        <Badge variant={config.is_active ? "default" : "secondary"}>
                          {config.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div><strong>Tipo:</strong> {config.agent_type}</div>
                        <div><strong>Modelo:</strong> {config.model}</div>
                        <div><strong>Temperatura:</strong> {config.temperature}</div>
                        <div><strong>Max Tokens:</strong> {config.max_tokens}</div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {config.prompt}
                        </p>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditAgent(config.id)}
                        >
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => deleteConfiguration(config.id)}
                          disabled={isDeleting}
                        >
                          Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs">
            <ConversationLogs 
              conversations={conversations || []} 
              configurations={configurations || []}
            />
          </TabsContent>
          
          <TabsContent value="metrics">
            <AgentMetrics 
              metrics={metrics || []}
              configurations={configurations || []}
              conversations={conversations || []}
            />
          </TabsContent>
          
          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Sistema de Treinamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Em Desenvolvimento</h3>
                  <p className="text-gray-600 mb-4">
                    O sistema de treinamento de agentes estará disponível em breve.
                  </p>
                  <p className="text-sm text-gray-500">
                    Funcionalidades planejadas: Fine-tuning, feedback de conversas, 
                    otimização automática de prompts e treinamento com dados personalizados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Agentes;

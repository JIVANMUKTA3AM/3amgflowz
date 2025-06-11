
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Bot, MessageCircle, BarChart3, Settings, Play, Zap, Link } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import { useAgentIntegrations } from "@/hooks/useAgentIntegrations";
import { useWorkflowExecutions } from "@/hooks/useWorkflowExecutions";
import AgentConfigurationForm from "@/components/agents/AgentConfigurationForm";
import ConversationLogs from "@/components/agents/ConversationLogs";
import AgentMetrics from "@/components/agents/AgentMetrics";
import AgentChat from "@/components/agents/AgentChat";
import AgentIntegrations from "@/components/agents/AgentIntegrations";
import WorkflowExecutions from "@/components/agents/WorkflowExecutions";
import AgentTrainingSystem from "@/components/agents/AgentTrainingSystem";
import IntegrationConfigForm from "@/components/agents/IntegrationConfigForm";

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

  const { integrations } = useAgentIntegrations();
  const { executions } = useWorkflowExecutions();

  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [showIntegrationForm, setShowIntegrationForm] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<any>(null);

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

  const handleEditIntegration = (integration: any) => {
    setEditingIntegration(integration);
    setShowIntegrationForm(true);
  };

  const editingConfiguration = editingAgent 
    ? configurations?.find(config => config.id === editingAgent)
    : undefined;

  const activeAgents = configurations?.filter(config => config.is_active).length || 0;
  const totalConversations = conversations?.length || 0;
  const activeIntegrations = integrations?.filter(int => int.is_active).length || 0;
  const successfulExecutions = executions?.filter(exec => exec.status === 'success').length || 0;

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <Link className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Integrações Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{activeIntegrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Execuções Bem-sucedidas</p>
                  <p className="text-2xl font-bold text-gray-900">{successfulExecutions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="chat" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="configurations" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Link className="h-4 w-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="workflows" className="gap-2">
              <Zap className="h-4 w-4" />
              Workflows
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

          <TabsContent value="integrations">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Integrações</h2>
                <Button onClick={() => setShowIntegrationForm(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Integração
                </Button>
              </div>

              {showIntegrationForm && (
                <IntegrationConfigForm
                  integration={editingIntegration}
                  onClose={() => {
                    setShowIntegrationForm(false);
                    setEditingIntegration(null);
                  }}
                />
              )}

              <AgentIntegrations 
                integrations={integrations || []}
                onEdit={handleEditIntegration}
              />
            </div>
          </TabsContent>

          <TabsContent value="workflows">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Execuções de Workflow</h2>
              </div>
              <WorkflowExecutions executions={executions || []} />
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
            <AgentTrainingSystem />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Agentes;

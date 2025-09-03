import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Play, BarChart3, MessageSquare, Trash2, Edit } from "lucide-react";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import AgentConfigurationForm from "./AgentConfigurationForm";
import LiveChat from "./LiveChat";
import AgentMetrics from "./AgentMetrics";
import { toast } from "@/hooks/use-toast";

const AgentsTabContent = () => {
  const {
    configurations,
    conversations,
    metrics,
    isLoading,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
    isCreating,
    isUpdating,
    isDeleting
  } = useAgentConfigurations();

  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [selectedAgentForChat, setSelectedAgentForChat] = useState<string | null>(null);
  const [selectedAgentForMetrics, setSelectedAgentForMetrics] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingAgent(null);
    setShowForm(true);
  };

  const handleEdit = (agentId: string) => {
    setEditingAgent(agentId);
    setShowForm(true);
  };

  const handleSaveAgent = (agentData: any) => {
    console.log('Saving agent:', agentData);
    
    if (editingAgent) {
      updateConfiguration({ id: editingAgent, ...agentData });
    } else {
      createConfiguration(agentData);
    }
    
    setShowForm(false);
    setEditingAgent(null);
  };

  const handleDelete = async (agentId: string, agentName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o agente "${agentName}"?`)) {
      deleteConfiguration(agentId);
    }
  };

  const handleStartChat = (agentId: string) => {
    setSelectedAgentForChat(agentId);
  };

  const handleViewMetrics = (agentId: string) => {
    setSelectedAgentForMetrics(agentId);
  };

  const editingConfiguration = editingAgent 
    ? configurations.find(config => config.id === editingAgent)
    : undefined;

  const selectedChatAgent = selectedAgentForChat 
    ? configurations.find(config => config.id === selectedAgentForChat)
    : null;

  const selectedMetricsAgent = selectedAgentForMetrics 
    ? configurations.find(config => config.id === selectedAgentForMetrics)
    : null;

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {editingAgent ? "Editar Agente" : "Novo Agente"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure as preferências e comportamento do seu agente IA
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false);
              setEditingAgent(null);
            }}
          >
            Voltar
          </Button>
        </div>

        <AgentConfigurationForm
          configuration={editingConfiguration}
          onSave={handleSaveAgent}
          onCancel={() => {
            setShowForm(false);
            setEditingAgent(null);
          }}
          isLoading={isCreating || isUpdating}
        />
      </div>
    );
  }

  if (selectedChatAgent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Chat ao Vivo</h3>
            <p className="text-sm text-muted-foreground">
              Converse com {selectedChatAgent.name} em tempo real
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedAgentForChat(null)}
          >
            Voltar
          </Button>
        </div>

        <LiveChat agentConfig={selectedChatAgent} />
      </div>
    );
  }

  if (selectedMetricsAgent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Métricas do Agente</h3>
            <p className="text-sm text-muted-foreground">
              Análise de performance do {selectedMetricsAgent.name}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedAgentForMetrics(null)}
          >
            Voltar
          </Button>
        </div>

        <AgentMetrics 
          configurations={[selectedMetricsAgent]}
          conversations={conversations.filter(conv => conv.agent_configuration_id === selectedMetricsAgent.id)}
          metrics={metrics.filter(metric => metric.agent_configuration_id === selectedMetricsAgent.id)}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando agentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Agentes IA</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie seus agentes inteligentes para diferentes tipos de atendimento
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      {configurations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum agente configurado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro agente IA para começar a automatizar atendimentos
            </p>
            <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Agente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configurations.map((config) => (
            <Card key={config.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{config.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {config.agent_type.replace('_', ' ')}
                    </CardDescription>
                  </div>
                  <Badge variant={config.is_active ? "default" : "secondary"}>
                    {config.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="line-clamp-2">{config.prompt}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Modelo:</span>
                    <p className="text-muted-foreground">{config.model}</p>
                  </div>
                  <div>
                    <span className="font-medium">Temp:</span>
                    <p className="text-muted-foreground">{config.temperature}</p>
                  </div>
                </div>

                {config.webhook_url && (
                  <div className="text-sm">
                    <span className="font-medium">Webhook:</span>
                    <p className="text-muted-foreground text-xs truncate">
                      {config.webhook_url}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleStartChat(config.id)}
                    className="flex-1"
                    disabled={!config.is_active}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewMetrics(config.id)}
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(config.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(config.id, config.name)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {configurations.length > 0 && (
        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{configurations.length}</p>
                        <p className="text-sm text-muted-foreground">Agentes Configurados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Play className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">
                          {configurations.filter(c => c.is_active).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Agentes Ativos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold">{conversations.length}</p>
                        <p className="text-sm text-muted-foreground">Conversas Hoje</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="mt-6">
              <AgentMetrics 
                configurations={configurations}
                conversations={conversations}
                metrics={metrics}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AgentsTabContent;
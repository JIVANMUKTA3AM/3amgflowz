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
            <h3 className="text-lg font-semibold text-white">
              {editingAgent ? "Editar Agente" : "Novo Agente"}
            </h3>
            <p className="text-sm text-gray-300">
              Configure as preferências e comportamento do seu agente IA
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowForm(false);
              setEditingAgent(null);
            }}
            className="border-gray-600 text-white hover:bg-gray-700"
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
            <h3 className="text-lg font-semibold text-white">Chat ao Vivo</h3>
            <p className="text-sm text-gray-300">
              Converse com {selectedChatAgent.name} em tempo real
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedAgentForChat(null)}
            className="border-gray-600 text-white hover:bg-gray-700"
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
            <h3 className="text-lg font-semibold text-white">Métricas do Agente</h3>
            <p className="text-sm text-gray-300">
              Análise de performance do {selectedMetricsAgent.name}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedAgentForMetrics(null)}
            className="border-gray-600 text-white hover:bg-gray-700"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-3amg-orange mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando agentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Agentes IA</h3>
          <p className="text-sm text-gray-300">
            Gerencie seus agentes inteligentes para diferentes tipos de atendimento
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-3amg-orange hover:bg-3amg-orange/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agente
        </Button>
      </div>

      {configurations.length === 0 ? (
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-3amg-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-3amg-orange" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Nenhum agente configurado</h3>
            <p className="text-gray-300 mb-4">
              Crie seu primeiro agente IA para começar a automatizar atendimentos
            </p>
            <Button onClick={handleCreateNew} className="bg-3amg-orange hover:bg-3amg-orange/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Agente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {configurations.map((config) => (
            <Card key={config.id} className="group hover:shadow-lg transition-shadow bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-white">{config.name}</CardTitle>
                    <CardDescription className="capitalize text-gray-300">
                      {config.agent_type.replace('_', ' ')}
                    </CardDescription>
                  </div>
                  <Badge variant={config.is_active ? "default" : "secondary"} className={config.is_active ? "bg-green-500" : "bg-gray-500"}>
                    {config.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-sm text-gray-300">
                  <p className="line-clamp-2">{config.prompt}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-white">Modelo:</span>
                    <p className="text-gray-300">{config.model}</p>
                  </div>
                  <div>
                    <span className="font-medium text-white">Temp:</span>
                    <p className="text-gray-300">{config.temperature}</p>
                  </div>
                </div>

                {config.webhook_url && (
                  <div className="text-sm">
                    <span className="font-medium text-white">Webhook:</span>
                    <p className="text-gray-300 text-xs truncate">
                      {config.webhook_url}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleStartChat(config.id)}
                    className="flex-1 bg-3amg-orange hover:bg-3amg-orange/90"
                    disabled={!config.is_active}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewMetrics(config.id)}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEdit(config.id)}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(config.id, config.name)}
                    disabled={isDeleting}
                    className="border-gray-600 text-white hover:bg-gray-700"
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
            <TabsList className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-3amg-orange data-[state=active]:text-white">Visão Geral</TabsTrigger>
              <TabsTrigger value="metrics" className="text-white data-[state=active]:bg-3amg-orange data-[state=active]:text-white">Métricas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-3amg-orange" />
                      <div>
                        <p className="text-2xl font-bold text-white">{configurations.length}</p>
                        <p className="text-sm text-gray-300">Agentes Configurados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Play className="h-5 w-5 text-green-400" />
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
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-3amg-purple" />
                      <div>
                        <p className="text-2xl font-bold text-white">{conversations.length}</p>
                        <p className="text-sm text-gray-300">Conversas Hoje</p>
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
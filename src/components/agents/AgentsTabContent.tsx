
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, ExternalLink } from "lucide-react";
import AgentConfigurationForm from "./AgentConfigurationForm";
import ConversationLogs from "./ConversationLogs";
import AgentMetrics from "./AgentMetrics";
import AgentChat from "./AgentChat";
import AgentIntegrations from "./AgentIntegrations";
import WorkflowExecutions from "./WorkflowExecutions";
import AgentTrainingSystem from "./AgentTrainingSystem";
import IntegrationConfigForm from "./IntegrationConfigForm";
import WorkflowManagement from "./WorkflowManagement";
import { AgentConfiguration, AgentConversation, AgentMetric } from "@/hooks/useAgentConfigurations";
import { AgentIntegration } from "@/hooks/useAgentIntegrations";
import { WorkflowExecution } from "@/hooks/useWorkflowExecutions";
import { toast } from "@/components/ui/use-toast";

interface AgentsTabContentProps {
  configurations: AgentConfiguration[] | undefined;
  conversations: AgentConversation[] | undefined;
  metrics: AgentMetric[] | undefined;
  integrations: AgentIntegration[] | undefined;
  executions: WorkflowExecution[] | undefined;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  showIntegrationForm: boolean;
  setShowIntegrationForm: (show: boolean) => void;
  editingAgent: string | null;
  editingConfiguration: AgentConfiguration | undefined;
  editingIntegration: any;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  handleSaveAgent: (agentData: any) => void;
  handleEditAgent: (agentId: string) => void;
  handleEditIntegration: (integration: any) => void;
  deleteConfiguration: (id: string) => void;
  setEditingAgent: (id: string | null) => void;
  setEditingIntegration: (integration: any) => void;
}

const AgentsTabContent = ({
  configurations,
  conversations,
  metrics,
  integrations,
  executions,
  showForm,
  setShowForm,
  showIntegrationForm,
  setShowIntegrationForm,
  editingAgent,
  editingConfiguration,
  editingIntegration,
  isCreating,
  isUpdating,
  isDeleting,
  handleSaveAgent,
  handleEditAgent,
  handleEditIntegration,
  deleteConfiguration,
  setEditingAgent,
  setEditingIntegration,
}: AgentsTabContentProps) => {

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada!",
      description: "A URL do webhook foi copiada para a área de transferência.",
    });
  };

  const openWebhookUrl = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      
      <TabsContent value="chat">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <AgentChat configurations={configurations || []} />
        </div>
      </TabsContent>
      
      
      <TabsContent value="configurations">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-3amg-orange">Configurações dos Agentes</h2>
            <Button onClick={() => setShowForm(true)} className="gap-2 bg-3amg-orange hover:bg-3amg-orange/80">
              <Plus className="h-4 w-4" />
              Novo Agente
            </Button>
          </div>

          {showForm && (
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
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
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {configurations?.map((config) => (
              <Card key={config.id} className="bg-gray-900/90 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-3amg-orange">{config.name}</CardTitle>
                    <Badge variant={config.is_active ? "default" : "secondary"} 
                           className={config.is_active ? "bg-green-600 hover:bg-green-700" : ""}>
                      {config.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div><strong className="text-gray-200">Tipo:</strong> {config.agent_type}</div>
                    <div><strong className="text-gray-200">Modelo:</strong> {config.model}</div>
                    <div><strong className="text-gray-200">Temperatura:</strong> {config.temperature}</div>
                    <div><strong className="text-gray-200">Max Tokens:</strong> {config.max_tokens}</div>
                  </div>

                  {config.webhook_url && (
                    <div className="mt-3 p-2 bg-gray-800 rounded border border-gray-600">
                      <div className="text-xs font-medium text-gray-400 mb-1">Webhook N8N:</div>
                      <div className="flex items-center gap-1">
                        <div className="text-xs text-gray-300 truncate flex-1" title={config.webhook_url}>
                          {config.webhook_url}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyWebhookUrl(config.webhook_url!)}
                          className="h-6 w-6 p-0 hover:bg-gray-700"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openWebhookUrl(config.webhook_url!)}
                          className="h-6 w-6 p-0 hover:bg-gray-700"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {config.prompt}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditAgent(config.id)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
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

      <TabsContent value="workflows">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <WorkflowManagement />
        </div>
      </TabsContent>

      <TabsContent value="integrations">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-3amg-orange">Integrações</h2>
            <Button onClick={() => setShowIntegrationForm(true)} className="gap-2 bg-3amg-orange hover:bg-3amg-orange/80">
              <Plus className="h-4 w-4" />
              Nova Integração
            </Button>
          </div>

          {showIntegrationForm && (
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <IntegrationConfigForm
                integration={editingIntegration}
                onClose={() => {
                  setShowIntegrationForm(false);
                  setEditingIntegration(null);
                }}
              />
            </div>
          )}

          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <AgentIntegrations 
              integrations={integrations || []}
              onEdit={handleEditIntegration}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="executions">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-3amg-orange">Execuções de Workflow</h2>
          </div>
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <WorkflowExecutions executions={executions || []} />
          </div>
        </div>
      </TabsContent>
      
      
      <TabsContent value="logs">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <ConversationLogs 
            conversations={conversations || []} 
            configurations={configurations || []}
          />
        </div>
      </TabsContent>
      
      
      <TabsContent value="metrics">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <AgentMetrics 
            metrics={metrics || []}
            configurations={configurations || []}
            conversations={conversations || []}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="training">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <AgentTrainingSystem />
        </div>
      </TabsContent>
    </>
  );
};

export default AgentsTabContent;

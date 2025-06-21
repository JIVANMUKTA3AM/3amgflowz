
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import { useAgentIntegrations } from "@/hooks/useAgentIntegrations";
import { useWorkflowExecutions } from "@/hooks/useWorkflowExecutions";
import AgentsSummaryCards from "@/components/agents/AgentsSummaryCards";
import AgentsTabNavigation from "@/components/agents/AgentsTabNavigation";
import AgentsTabContent from "@/components/agents/AgentsTabContent";

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

        <AgentsSummaryCards
          activeAgents={activeAgents}
          totalConversations={totalConversations}
          activeIntegrations={activeIntegrations}
          successfulExecutions={successfulExecutions}
        />

        <Tabs defaultValue="chat" className="w-full">
          <AgentsTabNavigation />
          
          <AgentsTabContent
            configurations={configurations}
            conversations={conversations}
            metrics={metrics}
            integrations={integrations}
            executions={executions}
            showForm={showForm}
            setShowForm={setShowForm}
            showIntegrationForm={showIntegrationForm}
            setShowIntegrationForm={setShowIntegrationForm}
            editingAgent={editingAgent}
            editingConfiguration={editingConfiguration}
            editingIntegration={editingIntegration}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            handleSaveAgent={handleSaveAgent}
            handleEditAgent={handleEditAgent}
            handleEditIntegration={handleEditIntegration}
            deleteConfiguration={deleteConfiguration}
            setEditingAgent={setEditingAgent}
            setEditingIntegration={setEditingIntegration}
          />
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Agentes;

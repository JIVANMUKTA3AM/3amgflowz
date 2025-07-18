
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Zap, Activity, Database, Gauge } from "lucide-react";
import QuickWorkflowSetup from "./QuickWorkflowSetup";
import WorkflowProviderDashboard from "./WorkflowProviderDashboard";
import WorkflowForm from "./WorkflowForm";
import WorkflowExecutions from "./WorkflowExecutions";
import AgentIntegrations from "./AgentIntegrations";
import { useAgentWorkflows } from "@/hooks/useAgentWorkflows";

const WorkflowManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const { 
    workflows, 
    executions, 
    integrations,
    loadingWorkflows
  } = useAgentWorkflows();

  const handleEdit = (workflow: any) => {
    setEditingWorkflow(workflow);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <WorkflowForm
        workflow={editingWorkflow}
        onSave={() => setShowForm(false)}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Workflows</h2>
        <p className="text-gray-600">Configure e monitore workflows para atendimento de provedores</p>
      </div>

      <Tabs defaultValue="quick-setup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick-setup" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Setup Rápido
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="executions" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Execuções
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick-setup">
          <QuickWorkflowSetup />
        </TabsContent>

        <TabsContent value="dashboard">
          <WorkflowProviderDashboard />
        </TabsContent>

        <TabsContent value="executions">
          <WorkflowExecutions executions={executions} />
        </TabsContent>

        <TabsContent value="integrations">
          <AgentIntegrations 
            integrations={integrations} 
            onEdit={handleEdit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowManagement;

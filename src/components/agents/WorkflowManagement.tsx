
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, Settings, Zap, Activity, Database } from "lucide-react";
import { useAgentWorkflows } from "@/hooks/useAgentWorkflows";
import WorkflowForm from "./WorkflowForm";
import WorkflowExecutions from "./WorkflowExecutions";
import AgentIntegrations from "./AgentIntegrations";

const WorkflowManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const { 
    workflows, 
    executions, 
    integrations,
    loadingWorkflows,
    triggerWorkflow,
    isTriggeringWorkflow,
    deleteWorkflow 
  } = useAgentWorkflows();

  const handleCreateNew = () => {
    setEditingWorkflow(null);
    setShowForm(true);
  };

  const handleEdit = (workflow: any) => {
    setEditingWorkflow(workflow);
    setShowForm(true);
  };

  const handleTrigger = (workflowId: string, agentConfigId: string) => {
    triggerWorkflow({
      workflowId,
      triggerData: {
        agent_configuration_id: agentConfigId,
        triggered_by: 'manual',
        timestamp: new Date().toISOString()
      }
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500",
      inactive: "bg-gray-500",
      running: "bg-blue-500",
      error: "bg-red-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const getWorkflowTypeIcon = (type: string) => {
    switch (type) {
      case 'n8n': return <Zap className="w-4 h-4" />;
      case 'zapier': return <Activity className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflows dos Agentes</h2>
          <p className="text-gray-600">Gerencie automações e integrações por agente</p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Workflow
        </Button>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Workflows
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

        <TabsContent value="workflows" className="space-y-4">
          {loadingWorkflows ? (
            <div className="text-center py-8">
              <p>Carregando workflows...</p>
            </div>
          ) : workflows && workflows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getWorkflowTypeIcon(workflow.workflow_type)}
                        <CardTitle className="text-lg">{workflow.workflow_name}</CardTitle>
                      </div>
                      <Badge className={workflow.is_active ? "bg-green-500" : "bg-gray-500"}>
                        {workflow.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Agente: {workflow.agent_configurations?.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-xs text-gray-500">
                        Tipo: {workflow.workflow_type.toUpperCase()}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleTrigger(workflow.id, workflow.agent_configuration_id)}
                          disabled={!workflow.is_active || isTriggeringWorkflow}
                          className="flex-1"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Executar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(workflow)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Zap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum workflow configurado
                </h3>
                <p className="text-gray-600 mb-4">
                  Crie workflows para automatizar ações dos seus agentes.
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Workflow
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="executions">
          <WorkflowExecutions executions={executions} />
        </TabsContent>

        <TabsContent value="integrations">
          <AgentIntegrations integrations={integrations} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowManagement;

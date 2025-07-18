
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Play,
  Pause,
  BarChart3
} from "lucide-react";
import { useAgentWorkflows } from "@/hooks/useAgentWorkflows";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const WorkflowProviderDashboard = () => {
  const { 
    workflows, 
    executions, 
    loadingWorkflows,
    triggerWorkflow,
    updateWorkflow,
    isTriggeringWorkflow 
  } = useAgentWorkflows();

  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Estatísticas dos workflows
  const activeWorkflows = workflows?.filter(w => w.is_active).length || 0;
  const totalExecutions = executions?.length || 0;
  const successfulExecutions = executions?.filter(e => e.status === 'success').length || 0;
  const errorExecutions = executions?.filter(e => e.status === 'error').length || 0;
  const successRate = totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0;

  const handleToggleWorkflow = (workflowId: string, currentStatus: boolean) => {
    updateWorkflow({
      id: workflowId,
      is_active: !currentStatus
    });
  };

  const handleManualTrigger = (workflowId: string, agentConfigId: string) => {
    triggerWorkflow({
      workflowId,
      triggerData: {
        agent_configuration_id: agentConfigId,
        triggered_by: 'manual_dashboard',
        timestamp: new Date().toISOString(),
        test_mode: true
      }
    });
  };

  if (loadingWorkflows) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Workflows Ativos</p>
                <p className="text-2xl font-bold text-green-600">{activeWorkflows}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Execuções (7d)</p>
                <p className="text-2xl font-bold text-blue-600">{totalExecutions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Erros</p>
                <p className="text-2xl font-bold text-red-600">{errorExecutions}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workflows">Workflows Ativos</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {workflows && workflows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className={`border-l-4 ${workflow.is_active ? 'border-l-green-500' : 'border-l-gray-400'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {workflow.workflow_name}
                          <Badge variant={workflow.is_active ? "default" : "secondary"}>
                            {workflow.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Agente: {workflow.agent_configurations?.name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleWorkflow(workflow.id, workflow.is_active)}
                        >
                          {workflow.is_active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleManualTrigger(workflow.id, workflow.agent_configuration_id)}
                          disabled={!workflow.is_active || isTriggeringWorkflow}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-xs space-y-1">
                        <p><span className="font-medium">Tipo:</span> {workflow.workflow_type.toUpperCase()}</p>
                        <p><span className="font-medium">URL:</span> 
                          <span className="text-blue-600 font-mono text-xs ml-1">
                            {workflow.webhook_url ? `${workflow.webhook_url.substring(0, 40)}...` : 'Não configurado'}
                          </span>
                        </p>
                      </div>

                      {/* Estatísticas do workflow */}
                      <div className="flex gap-4 text-xs">
                        <div className="text-center">
                          <div className="font-bold text-green-600">
                            {executions?.filter(e => e.workflow_id === workflow.id && e.status === 'success').length || 0}
                          </div>
                          <div className="text-gray-500">Sucessos</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-red-600">
                            {executions?.filter(e => e.workflow_id === workflow.id && e.status === 'error').length || 0}
                          </div>
                          <div className="text-gray-500">Erros</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">
                            {executions?.filter(e => e.workflow_id === workflow.id).length || 0}
                          </div>
                          <div className="text-gray-500">Total</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum workflow configurado
                </h3>
                <p className="text-gray-600">
                  Use o Setup Rápido para configurar seus primeiros workflows.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Execuções Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {executions && executions.length > 0 ? (
                <div className="space-y-3">
                  {executions.slice(0, 10).map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          execution.status === 'success' ? 'bg-green-500' :
                          execution.status === 'error' ? 'bg-red-500' :
                          execution.status === 'running' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <div>
                          <p className="font-medium">{execution.agent_workflows?.workflow_name}</p>
                          <p className="text-xs text-gray-500">
                            {execution.trigger_type} • {formatDistanceToNow(new Date(execution.started_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={execution.status === 'success' ? 'default' : 
                                  execution.status === 'error' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {execution.status}
                        </Badge>
                        {execution.execution_time_ms && (
                          <p className="text-xs text-gray-500 mt-1">
                            {execution.execution_time_ms}ms
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Nenhuma execução encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowProviderDashboard;

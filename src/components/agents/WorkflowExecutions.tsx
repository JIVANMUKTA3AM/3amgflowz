
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WorkflowExecutionsProps {
  executions: any[];
}

const WorkflowExecutions = ({ executions }: WorkflowExecutionsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <Play className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      running: "bg-blue-500",
      pending: "bg-yellow-500",
      timeout: "bg-orange-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const formatExecutionTime = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (!executions || executions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma execução encontrada
          </h3>
          <p className="text-gray-600">
            Execute workflows para ver o histórico de execuções aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {executions.length} execução{executions.length !== 1 ? 'ões' : ''} encontrada{executions.length !== 1 ? 's' : ''}
      </div>
      
      {executions.map((execution) => (
        <Card key={execution.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(execution.status)}
                <div>
                  <CardTitle className="text-base">
                    {execution.agent_workflows?.workflow_name || 'Workflow Desconhecido'}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Agente: {execution.agent_configurations?.name}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(execution.status)}>
                {execution.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Trigger</p>
                <p className="font-medium">{execution.trigger_type}</p>
              </div>
              <div>
                <p className="text-gray-600">Tempo de Execução</p>
                <p className="font-medium">{formatExecutionTime(execution.execution_time_ms)}</p>
              </div>
              <div>
                <p className="text-gray-600">Iniciado</p>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(execution.started_at), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium">{execution.status}</p>
              </div>
            </div>
            
            {execution.error_message && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">
                  <strong>Erro:</strong> {execution.error_message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkflowExecutions;

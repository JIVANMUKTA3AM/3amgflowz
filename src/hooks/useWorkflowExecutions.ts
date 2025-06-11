
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  agent_configuration_id: string;
  trigger_type: string;
  trigger_data: any;
  status: 'pending' | 'running' | 'success' | 'error' | 'timeout';
  execution_time_ms: number | null;
  result_data: any;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  agent_configurations?: {
    name: string;
  };
  agent_workflows?: {
    workflow_name: string;
  };
}

export const useWorkflowExecutions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: executions, isLoading } = useQuery({
    queryKey: ['workflow-executions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('workflow_executions')
        .select(`
          *,
          agent_configurations!inner(name, user_id),
          agent_workflows(workflow_name)
        `)
        .eq('agent_configurations.user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as WorkflowExecution[];
    },
    enabled: !!user?.id,
  });

  const triggerWorkflow = useMutation({
    mutationFn: async ({ workflowId, triggerData }: { workflowId: string; triggerData: any }) => {
      const { data, error } = await supabase.functions.invoke('trigger-workflow', {
        body: { 
          workflow_id: workflowId,
          trigger_data: triggerData 
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-executions', user?.id] });
      toast({
        title: "Workflow iniciado!",
        description: "O workflow foi executado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error triggering workflow:', error);
      toast({
        title: "Erro ao executar workflow",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const retryExecution = useMutation({
    mutationFn: async (executionId: string) => {
      const { data, error } = await supabase.functions.invoke('retry-workflow', {
        body: { execution_id: executionId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-executions', user?.id] });
      toast({
        title: "Workflow reiniciado!",
        description: "O workflow foi executado novamente.",
      });
    },
    onError: (error) => {
      console.error('Error retrying workflow:', error);
      toast({
        title: "Erro ao reiniciar workflow",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    executions: executions || [],
    isLoading,
    triggerWorkflow: triggerWorkflow.mutate,
    isTriggering: triggerWorkflow.isPending,
    retryExecution: retryExecution.mutate,
    isRetrying: retryExecution.isPending,
  };
};

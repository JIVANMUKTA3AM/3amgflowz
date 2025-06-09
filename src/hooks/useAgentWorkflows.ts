
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface AgentWorkflow {
  id: string;
  agent_configuration_id: string;
  workflow_name: string;
  workflow_type: string;
  webhook_url?: string;
  webhook_secret?: string;
  is_active: boolean;
  configuration: any;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  agent_configuration_id: string;
  trigger_type: string;
  trigger_data: any;
  status: string;
  execution_time_ms?: number;
  result_data: any;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

export interface AgentIntegration {
  id: string;
  agent_configuration_id: string;
  integration_type: string;
  integration_name: string;
  api_credentials: any;
  webhook_endpoints: any;
  settings: any;
  is_active: boolean;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export const useAgentWorkflows = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar workflows dos agentes
  const { data: workflows, isLoading: loadingWorkflows } = useQuery({
    queryKey: ['agent-workflows', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_workflows')
        .select(`
          *,
          agent_configurations!inner(name, agent_type, user_id)
        `)
        .eq('agent_configurations.user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (AgentWorkflow & { agent_configurations: any })[];
    },
    enabled: !!user?.id,
  });

  // Buscar execuções dos workflows
  const { data: executions, isLoading: loadingExecutions } = useQuery({
    queryKey: ['workflow-executions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('workflow_executions')
        .select(`
          *,
          agent_workflows!inner(workflow_name, agent_configuration_id),
          agent_configurations!inner(name, user_id)
        `)
        .eq('agent_configurations.user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as (WorkflowExecution & { agent_workflows: any; agent_configurations: any })[];
    },
    enabled: !!user?.id,
  });

  // Buscar integrações dos agentes
  const { data: integrations, isLoading: loadingIntegrations } = useQuery({
    queryKey: ['agent-integrations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_integrations')
        .select(`
          *,
          agent_configurations!inner(name, agent_type, user_id)
        `)
        .eq('agent_configurations.user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (AgentIntegration & { agent_configurations: any })[];
    },
    enabled: !!user?.id,
  });

  // Criar workflow
  const createWorkflowMutation = useMutation({
    mutationFn: async (workflow: Omit<AgentWorkflow, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('agent_workflows')
        .insert(workflow)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-workflows', user?.id] });
      toast({
        title: "Workflow criado!",
        description: "Novo workflow foi configurado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating workflow:', error);
      toast({
        title: "Erro ao criar workflow",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Atualizar workflow
  const updateWorkflowMutation = useMutation({
    mutationFn: async ({ id, ...workflow }: Partial<AgentWorkflow> & { id: string }) => {
      const { data, error } = await supabase
        .from('agent_workflows')
        .update(workflow)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-workflows', user?.id] });
      toast({
        title: "Workflow atualizado!",
        description: "Configuração foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating workflow:', error);
      toast({
        title: "Erro ao atualizar workflow",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Deletar workflow
  const deleteWorkflowMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agent_workflows')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-workflows', user?.id] });
      toast({
        title: "Workflow removido!",
        description: "Workflow foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error deleting workflow:', error);
      toast({
        title: "Erro ao remover workflow",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Executar workflow manualmente
  const triggerWorkflowMutation = useMutation({
    mutationFn: async ({ workflowId, triggerData }: { workflowId: string; triggerData: any }) => {
      const { data, error } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_id: workflowId,
          agent_configuration_id: triggerData.agent_configuration_id,
          trigger_type: 'manual',
          trigger_data: triggerData,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-executions', user?.id] });
      toast({
        title: "Workflow disparado!",
        description: "Execução iniciada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error triggering workflow:', error);
      toast({
        title: "Erro ao disparar workflow",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    workflows,
    executions,
    integrations,
    loadingWorkflows,
    loadingExecutions,
    loadingIntegrations,
    createWorkflow: createWorkflowMutation.mutate,
    isCreatingWorkflow: createWorkflowMutation.isPending,
    updateWorkflow: updateWorkflowMutation.mutate,
    isUpdatingWorkflow: updateWorkflowMutation.isPending,
    deleteWorkflow: deleteWorkflowMutation.mutate,
    isDeletingWorkflow: deleteWorkflowMutation.isPending,
    triggerWorkflow: triggerWorkflowMutation.mutate,
    isTriggeringWorkflow: triggerWorkflowMutation.isPending,
  };
};

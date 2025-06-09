
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface AgentConfiguration {
  id: string;
  user_id: string;
  agent_type: string;
  name: string;
  prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentConversation {
  id: string;
  user_id: string;
  agent_configuration_id: string;
  session_id: string;
  user_message: string;
  agent_response: string;
  response_time_ms?: number;
  tokens_used?: number;
  model_used?: string;
  created_at: string;
}

export interface AgentMetric {
  id: string;
  agent_configuration_id: string;
  date: string;
  total_conversations: number;
  avg_response_time_ms?: number;
  total_tokens_used: number;
  user_satisfaction_avg?: number;
  created_at: string;
  updated_at: string;
}

export const useAgentConfigurations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar configurações dos agentes
  const { data: configurations, isLoading } = useQuery({
    queryKey: ['agent-configurations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_configurations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');
      
      if (error) throw error;
      return data as AgentConfiguration[];
    },
    enabled: !!user?.id,
  });

  // Buscar conversas dos agentes
  const { data: conversations } = useQuery({
    queryKey: ['agent-conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as AgentConversation[];
    },
    enabled: !!user?.id,
  });

  // Buscar métricas dos agentes
  const { data: metrics } = useQuery({
    queryKey: ['agent-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_metrics')
        .select(`
          *,
          agent_configurations!inner(name, agent_type, user_id)
        `)
        .eq('agent_configurations.user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as (AgentMetric & { agent_configurations: Pick<AgentConfiguration, 'name' | 'agent_type'> })[];
    },
    enabled: !!user?.id,
  });

  // Criar nova configuração
  const createConfigurationMutation = useMutation({
    mutationFn: async (config: Omit<AgentConfiguration, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_configurations')
        .insert({
          ...config,
          user_id: user.id,
          model: config.model || 'gemini-1.5-flash', // Default para Gemini
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-configurations', user?.id] });
      toast({
        title: "Agente criado!",
        description: "Nova configuração de agente foi criada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating agent configuration:', error);
      toast({
        title: "Erro ao criar agente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Atualizar configuração
  const updateConfigurationMutation = useMutation({
    mutationFn: async ({ id, ...config }: Partial<AgentConfiguration> & { id: string }) => {
      const { data, error } = await supabase
        .from('agent_configurations')
        .update(config)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-configurations', user?.id] });
      toast({
        title: "Agente atualizado!",
        description: "Configuração foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating agent configuration:', error);
      toast({
        title: "Erro ao atualizar agente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Deletar configuração
  const deleteConfigurationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agent_configurations')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-configurations', user?.id] });
      toast({
        title: "Agente removido!",
        description: "Configuração foi removida com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error deleting agent configuration:', error);
      toast({
        title: "Erro ao remover agente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    configurations,
    conversations,
    metrics,
    isLoading,
    createConfiguration: createConfigurationMutation.mutate,
    isCreating: createConfigurationMutation.isPending,
    updateConfiguration: updateConfigurationMutation.mutate,
    isUpdating: updateConfigurationMutation.isPending,
    deleteConfiguration: deleteConfigurationMutation.mutate,
    isDeleting: deleteConfigurationMutation.isPending,
  };
};

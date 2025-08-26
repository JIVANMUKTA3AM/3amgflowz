
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface AgentConfiguration {
  id: string;
  name: string;
  agent_type: string;
  prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  webhook_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AgentConversation {
  id: string;
  agent_configuration_id: string;
  session_id: string;
  user_message: string;
  agent_response: string;
  response_time_ms?: number;
  tokens_used?: number;
  created_at: string;
  user_id: string;
}

export interface AgentMetric {
  id: string;
  agent_configuration_id: string;
  total_conversations: number;
  total_tokens_used: number;
  average_response_time_ms: number;
  success_rate: number;
  date: string;
  user_id: string;
}

export const useAgentConfigurations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: configurations, isLoading, error } = useQuery({
    queryKey: ['agent-configurations', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for agent configurations query');
        return [];
      }

      console.log('Fetching agent configurations for user:', user.id);
      
      const { data, error } = await supabase
        .from('agent_configurations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching agent configurations:', error);
        throw error;
      }

      console.log('Agent configurations fetched:', data);
      return data as AgentConfiguration[];
    },
    enabled: !!user?.id,
  });

  // Query para conversas
  const { data: conversations } = useQuery({
    queryKey: ['agent-conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('agent_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      return data as AgentConversation[];
    },
    enabled: !!user?.id,
  });

  // Query para métricas
  const { data: metrics } = useQuery({
    queryKey: ['agent-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching metrics:', error);
        return [];
      }

      return data as AgentMetric[];
    },
    enabled: !!user?.id,
  });

  const createConfiguration = useMutation({
    mutationFn: async (configData: Omit<AgentConfiguration, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Creating agent configuration:', configData);

      // Validar webhook URL se fornecida
      if (configData.webhook_url && configData.webhook_url.trim()) {
        try {
          new URL(configData.webhook_url);
        } catch (error) {
          throw new Error('URL do webhook inválida. Verifique o formato da URL.');
        }
      }

      const newConfig = {
        ...configData,
        user_id: user.id,
        webhook_url: configData.webhook_url?.trim() || null,
      };

      const { data, error } = await supabase
        .from('agent_configurations')
        .insert(newConfig)
        .select()
        .single();

      if (error) {
        console.error('Error creating agent configuration:', error);
        throw error;
      }

      console.log('Agent configuration created successfully:', data);
      return data as AgentConfiguration;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['agent-configurations', user?.id] });
      toast({
        title: "Agente criado com sucesso!",
        description: `O agente "${data.name}" foi configurado e está pronto para uso.`,
      });
    },
    onError: (error) => {
      console.error('Error in createConfiguration:', error);
      toast({
        title: "Erro ao criar agente",
        description: error instanceof Error ? error.message : "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const updateConfiguration = useMutation({
    mutationFn: async (configData: Partial<AgentConfiguration> & { id: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Updating agent configuration:', configData);

      // Validar webhook URL se fornecida
      if (configData.webhook_url && configData.webhook_url.trim()) {
        try {
          new URL(configData.webhook_url);
        } catch (error) {
          throw new Error('URL do webhook inválida. Verifique o formato da URL.');
        }
      }

      const { id, ...updateData } = configData;
      const cleanData = {
        ...updateData,
        webhook_url: updateData.webhook_url?.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('agent_configurations')
        .update(cleanData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating agent configuration:', error);
        throw error;
      }

      console.log('Agent configuration updated successfully:', data);
      return data as AgentConfiguration;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['agent-configurations', user?.id] });
      toast({
        title: "Agente atualizado!",
        description: `As configurações do agente "${data.name}" foram salvas.`,
      });
    },
    onError: (error) => {
      console.error('Error in updateConfiguration:', error);
      toast({
        title: "Erro ao atualizar agente",
        description: error instanceof Error ? error.message : "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const deleteConfiguration = useMutation({
    mutationFn: async (configId: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('Deleting agent configuration:', configId);

      const { error } = await supabase
        .from('agent_configurations')
        .delete()
        .eq('id', configId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting agent configuration:', error);
        throw error;
      }

      console.log('Agent configuration deleted successfully');
      return configId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-configurations', user?.id] });
      toast({
        title: "Agente removido!",
        description: "O agente foi removido com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error in deleteConfiguration:', error);
      toast({
        title: "Erro ao remover agente",
        description: error instanceof Error ? error.message : "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    configurations: configurations || [],
    conversations: conversations || [],
    metrics: metrics || [],
    isLoading,
    error,
    createConfiguration: createConfiguration.mutate,
    updateConfiguration: updateConfiguration.mutate,
    deleteConfiguration: deleteConfiguration.mutate,
    isCreating: createConfiguration.isPending,
    isUpdating: updateConfiguration.isPending,
    isDeleting: deleteConfiguration.isPending,
  };
};


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'n8n' | 'zapier' | 'custom';
  status: 'active' | 'inactive' | 'error' | 'pending';
  config: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    auth_type?: 'none' | 'bearer' | 'basic' | 'api_key';
    credentials?: Record<string, string>;
    [key: string]: any;
  };
  description?: string;
  last_sync?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationLog {
  id: string;
  integration_id: string;
  event_type: 'trigger' | 'sync' | 'error' | 'success';
  request_data?: any;
  response_data?: any;
  status_code?: number;
  error_message?: string;
  created_at: string;
}

export const useIntegrations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar integrações do usuário
  const { data: integrations, isLoading: loadingIntegrations } = useQuery({
    queryKey: ['integrations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Integration[];
    },
    enabled: !!user?.id,
  });

  // Buscar logs de integrações
  const { data: integrationLogs, isLoading: loadingLogs } = useQuery({
    queryKey: ['integration-logs', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('integration_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as IntegrationLog[];
    },
    enabled: !!user?.id,
  });

  // Criar nova integração
  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: Omit<Integration, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('integrations')
        .insert({
          ...integration,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', user?.id] });
      toast({
        title: "Integração criada!",
        description: "A nova integração foi configurada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating integration:', error);
      toast({
        title: "Erro ao criar integração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Atualizar integração
  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Integration> }) => {
      const { data, error } = await supabase
        .from('integrations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', user?.id] });
      toast({
        title: "Integração atualizada",
        description: "As configurações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating integration:', error);
      toast({
        title: "Erro ao atualizar integração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Testar integração
  const testIntegrationMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { integration_id: integrationId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['integration-logs', user?.id] });
      toast({
        title: "Teste realizado",
        description: "A integração foi testada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error testing integration:', error);
      toast({
        title: "Erro no teste",
        description: "Falha ao testar a integração.",
        variant: "destructive",
      });
    },
  });

  // Deletar integração
  const deleteIntegrationMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations', user?.id] });
      toast({
        title: "Integração removida",
        description: "A integração foi deletada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error deleting integration:', error);
      toast({
        title: "Erro ao remover integração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    integrations,
    integrationLogs,
    isLoading: loadingIntegrations || loadingLogs,
    createIntegration: createIntegrationMutation.mutate,
    updateIntegration: updateIntegrationMutation.mutate,
    testIntegration: testIntegrationMutation.mutate,
    deleteIntegration: deleteIntegrationMutation.mutate,
    isCreating: createIntegrationMutation.isPending,
    isUpdating: updateIntegrationMutation.isPending,
    isTesting: testIntegrationMutation.isPending,
    isDeleting: deleteIntegrationMutation.isPending,
  };
};

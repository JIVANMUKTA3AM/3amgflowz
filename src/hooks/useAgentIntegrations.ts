
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface AgentIntegration {
  id: string;
  agent_configuration_id: string;
  integration_type: string;
  integration_name: string;
  api_credentials: any;
  webhook_endpoints: any;
  settings: any;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
  agent_configurations?: {
    name: string;
  };
}

export const useAgentIntegrations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['agent-integrations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('agent_integrations')
        .select(`
          *,
          agent_configurations!inner(name, user_id)
        `)
        .eq('agent_configurations.user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AgentIntegration[];
    },
    enabled: !!user?.id,
  });

  const createIntegration = useMutation({
    mutationFn: async (integrationData: Omit<AgentIntegration, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('agent_integrations')
        .insert(integrationData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-integrations', user?.id] });
      toast({
        title: "Integração criada!",
        description: "A integração foi configurada com sucesso.",
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

  const updateIntegration = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AgentIntegration> & { id: string }) => {
      const { data, error } = await supabase
        .from('agent_integrations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-integrations', user?.id] });
      toast({
        title: "Integração atualizada!",
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

  const deleteIntegration = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agent_integrations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-integrations', user?.id] });
      toast({
        title: "Integração removida!",
        description: "A integração foi removida com sucesso.",
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

  const testIntegration = useMutation({
    mutationFn: async (integrationId: string) => {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { integration_id: integrationId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Teste concluído!",
        description: data?.success ? "Integração funcionando corretamente." : "Falha na integração.",
        variant: data?.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      console.error('Error testing integration:', error);
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar a integração.",
        variant: "destructive",
      });
    },
  });

  return {
    integrations: integrations || [],
    isLoading,
    createIntegration: createIntegration.mutate,
    isCreating: createIntegration.isPending,
    updateIntegration: updateIntegration.mutate,
    isUpdating: updateIntegration.isPending,
    deleteIntegration: deleteIntegration.mutate,
    isDeleting: deleteIntegration.isPending,
    testIntegration: testIntegration.mutate,
    isTesting: testIntegration.isPending,
  };
};

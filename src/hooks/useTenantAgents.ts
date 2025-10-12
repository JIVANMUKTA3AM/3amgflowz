import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AgentProfile {
  id: string;
  tenant_id: string;
  nome: string;
  tipo: 'externo' | 'interno';
  setor: 'triagem' | 'tecnico' | 'comercial' | 'financeiro';
  prompt_ref: string;
  configuracoes: Record<string, any>;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useTenantAgents = (tenant_id?: string) => {
  const queryClient = useQueryClient();

  // Buscar agentes do tenant
  const { data: agents, isLoading } = useQuery({
    queryKey: ['tenant-agents', tenant_id],
    queryFn: async () => {
      if (!tenant_id) return [];

      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('tenant_id', tenant_id)
        .order('setor', { ascending: true });

      if (error) throw error;
      return data as AgentProfile[];
    },
    enabled: !!tenant_id,
  });

  // Criar agente
  const createAgentMutation = useMutation({
    mutationFn: async (newAgent: Omit<AgentProfile, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('agent_profiles')
        .insert(newAgent)
        .select()
        .single();

      if (error) throw error;
      return data as AgentProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-agents'] });
      toast({
        title: "Agente criado",
        description: "Agente configurado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar agente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Atualizar agente
  const updateAgentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AgentProfile> }) => {
      const { data, error } = await supabase
        .from('agent_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as AgentProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-agents'] });
      toast({
        title: "Agente atualizado",
        description: "Configurações salvas!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar agente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Deletar agente
  const deleteAgentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agent_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-agents'] });
      toast({
        title: "Agente removido",
        description: "Agente excluído com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover agente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    agents,
    isLoading,
    createAgent: createAgentMutation.mutate,
    updateAgent: updateAgentMutation.mutate,
    deleteAgent: deleteAgentMutation.mutate,
    isCreating: createAgentMutation.isPending,
    isUpdating: updateAgentMutation.isPending,
    isDeleting: deleteAgentMutation.isPending,
  };
};

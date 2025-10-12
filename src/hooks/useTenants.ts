import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Tenant {
  id: string;
  nome: string;
  cnpj: string;
  contato: Record<string, any>;
  owner_id: string;
  ativo: boolean;
  configuracoes: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useTenants = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar tenant do usuário
  const { data: userTenant, isLoading, error } = useQuery({
    queryKey: ['user-tenant', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: membership } = await supabase
        .from('tenant_memberships')
        .select('tenant_id')
        .eq('user_id', user.id)
        .single();

      if (!membership) return null;

      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', membership.tenant_id)
        .single();

      if (error) throw error;
      return tenant as Tenant;
    },
    enabled: !!user?.id,
  });

  // Criar tenant
  const createTenantMutation = useMutation({
    mutationFn: async (newTenant: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tenants')
        .insert(newTenant)
        .select()
        .single();

      if (error) throw error;

      // Criar membership automaticamente
      await supabase
        .from('tenant_memberships')
        .insert({
          tenant_id: data.id,
          user_id: user!.id,
          role: 'owner'
        });

      return data as Tenant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tenant'] });
      toast({
        title: "Provedor criado",
        description: "Seu provedor foi criado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar provedor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Atualizar tenant
  const updateTenantMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Tenant> }) => {
      const { data, error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Tenant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tenant'] });
      toast({
        title: "Provedor atualizado",
        description: "Informações atualizadas com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar provedor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    userTenant,
    isLoading,
    error,
    createTenant: createTenantMutation.mutate,
    updateTenant: updateTenantMutation.mutate,
    isCreating: createTenantMutation.isPending,
    isUpdating: updateTenantMutation.isPending,
  };
};

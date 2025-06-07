
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export const useOrganizations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar organizações do usuário
  const { data: organizations = [], isLoading: loadingOrganizations } = useQuery({
    queryKey: ['organizations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Organization[];
    },
    enabled: !!user?.id,
  });

  // Buscar memberships do usuário
  const { data: memberships = [], isLoading: loadingMemberships } = useQuery({
    queryKey: ['memberships', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('memberships')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Criar organização
  const createOrganizationMutation = useMutation({
    mutationFn: async (organizationData: { name: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('organizations')
        .insert({
          ...organizationData,
          owner_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['memberships', user?.id] });
      toast({
        title: "Organização criada",
        description: "Sua organização foi criada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating organization:', error);
      toast({
        title: "Erro ao criar organização",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Atualizar organização
  const updateOrganizationMutation = useMutation({
    mutationFn: async ({ 
      organizationId, 
      updates 
    }: { 
      organizationId: string; 
      updates: Partial<Organization>;
    }) => {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organizationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations', user?.id] });
      toast({
        title: "Organização atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating organization:', error);
      toast({
        title: "Erro ao atualizar organização",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Convidar membro
  const inviteMemberMutation = useMutation({
    mutationFn: async ({ 
      organizationId, 
      userId, 
      role 
    }: { 
      organizationId: string; 
      userId: string; 
      role: 'admin' | 'member';
    }) => {
      const { data, error } = await supabase
        .from('memberships')
        .insert({
          organization_id: organizationId,
          user_id: userId,
          role,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships', user?.id] });
      toast({
        title: "Membro convidado",
        description: "O convite foi enviado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error inviting member:', error);
      toast({
        title: "Erro ao convidar membro",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    organizations,
    memberships,
    isLoading: loadingOrganizations || loadingMemberships,
    createOrganization: createOrganizationMutation.mutate,
    isCreating: createOrganizationMutation.isPending,
    updateOrganization: updateOrganizationMutation.mutate,
    isUpdating: updateOrganizationMutation.isPending,
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
  };
};

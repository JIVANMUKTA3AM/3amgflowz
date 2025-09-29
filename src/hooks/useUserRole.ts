
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from './useProfile';

export const useUserRole = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  
  // Query user roles from database
  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }
      
      return data?.map(r => r.role) || [];
    },
    enabled: !!user?.id,
  });

  const isLoading = profileLoading || rolesLoading;
  
  // Determine primary role (admin takes precedence)
  const roles = userRoles || [];
  const isAdmin = roles.includes('admin');
  const role = isAdmin ? 'admin' : (profile?.user_role_type || 'client');
  
  const isTecnico = profile?.user_role_type === 'tecnico';
  const isComercial = profile?.user_role_type === 'comercial';
  const isGeral = profile?.user_role_type === 'geral';

  return {
    role,
    isAdmin,
    isTecnico,
    isComercial,
    isGeral,
    isLoading,
    loading: isLoading, // Alias para compatibilidade
    profile,
    roles
  };
};

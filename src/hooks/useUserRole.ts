
import { useUserProfile } from './useUserProfile';

export const useUserRole = () => {
  const { profile, isLoading } = useUserProfile();

  const role = profile?.user_role_type || 'geral';
  const isAdmin = profile?.role === 'admin';
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
    loading: isLoading, // Adicionar alias para compatibilidade
    profile
  };
};

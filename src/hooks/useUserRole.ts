
import { useProfile } from './useProfile';

// Lista de emails de admin - você pode adicionar mais emails aqui
const adminEmails = [
  'gustavo.steve@hotmail.com',
  'admin@agentflow.com'
];

export const useUserRole = () => {
  const { profile, isLoading } = useProfile();
  
  // Verificar se é admin baseado no email
  const user = profile; // O perfil já vem com os dados do usuário
  const userEmail = user?.id ? getUserEmailFromId(user.id) : null;
  
  // Determinar role baseado no email primeiro (para admins)
  const isAdminByEmail = userEmail && adminEmails.includes(userEmail);
  
  const role = isAdminByEmail ? 'admin' : (profile?.user_role_type || 'client');
  const isAdmin = isAdminByEmail || profile?.role === 'admin';
  const isTecnico = profile?.user_role_type === 'tecnico';
  const isComercial = profile?.user_role_type === 'comercial';
  const isGeral = profile?.user_role_type === 'geral';

  // Helper para obter email do ID (temporário - o ideal seria ter no perfil)
  function getUserEmailFromId(userId: string): string | null {
    // Como você é gustavo.steve@hotmail.com, vou mapear seu ID
    if (userId === '2b69092d-e637-4b82-ab5a-10d4c318c27a') {
      return 'gustavo.steve@hotmail.com';
    }
    return null;
  }

  return {
    role,
    isAdmin,
    isTecnico,
    isComercial,
    isGeral,
    isLoading,
    loading: isLoading, // Alias para compatibilidade
    profile
  };
};


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export type UserRole = 'admin' | 'client' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        // Verificar se o usuário é admin (você pode definir emails específicos ou usar uma tabela)
        const adminEmails = ['gustavo.steve@hotmail.com']; // Adicione seus emails de admin aqui
        
        if (adminEmails.includes(user.email || '')) {
          setRole('admin');
        } else {
          setRole('client');
        }
      } catch (error) {
        console.error('Erro ao verificar role do usuário:', error);
        setRole('client'); // Default para client em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { role, loading };
};

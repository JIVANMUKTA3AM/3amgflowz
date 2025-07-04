
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface SimpleProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  user_role_type?: string;
  plan: string;
  role: string;
}

export const useSimpleUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SimpleProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching simple profile for user:', user.id);
        
        // Buscar apenas dados básicos do perfil sem joins
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('id, user_role_type, plan, role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching simple profile:', error);
          // Criar perfil padrão se não encontrar
          setProfile({
            id: user.id,
            first_name: user.email?.split('@')[0] || 'Usuário',
            last_name: '',
            user_role_type: 'geral',
            plan: 'free',
            role: 'user'
          });
        } else {
          console.log('Simple profile fetched:', profileData);
          setProfile({
            id: profileData.id,
            first_name: user.email?.split('@')[0] || 'Usuário',
            last_name: '',
            user_role_type: profileData.user_role_type || 'geral',
            plan: profileData.plan || 'free',
            role: profileData.role || 'user'
          });
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        // Criar perfil de fallback
        setProfile({
          id: user.id,
          first_name: user.email?.split('@')[0] || 'Usuário',
          last_name: '',
          user_role_type: 'geral',
          plan: 'free',
          role: 'user'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, isLoading };
};

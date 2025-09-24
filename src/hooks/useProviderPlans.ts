import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProviderPlan {
  id: string;
  provedor_id: string;
  nome_plano: string;
  preco: number;
  promocao: string | null;
  condicoes: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  name: string;
  cnpj_id: string;
  contact: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useProviderPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<ProviderPlan[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProviders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Erro ao carregar provedores",
        description: "Não foi possível carregar a lista de provedores.",
        variant: "destructive"
      });
    }
  };

  const fetchPlans = async (providerId?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('planos_provedores')
        .select(`
          *,
          providers!inner(name, cnpj_id, contact, user_id)
        `)
        .eq('providers.user_id', user.id)
        .order('nome_plano');

      if (providerId) {
        query = query.eq('provedor_id', providerId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Erro ao carregar planos",
        description: "Não foi possível carregar a lista de planos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPlan = async (planData: Omit<ProviderPlan, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('planos_provedores')
        .insert(planData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Plano criado",
        description: "O plano foi criado com sucesso."
      });

      fetchPlans(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Erro ao criar plano",
        description: "Não foi possível criar o plano.",
        variant: "destructive"
      });
      return null;
    }
  };

  const updatePlan = async (id: string, planData: Partial<ProviderPlan>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('planos_provedores')
        .update(planData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Plano atualizado",
        description: "O plano foi atualizado com sucesso."
      });

      fetchPlans(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Não foi possível atualizar o plano.",
        variant: "destructive"
      });
      return null;
    }
  };

  const deletePlan = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('planos_provedores')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Plano excluído",
        description: "O plano foi excluído com sucesso."
      });

      fetchPlans(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Erro ao excluir plano",
        description: "Não foi possível excluir o plano.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProviders();
      fetchPlans();
    }
  }, [user]);

  return {
    plans,
    providers,
    isLoading,
    fetchPlans,
    fetchProviders,
    createPlan,
    updatePlan,
    deletePlan
  };
};
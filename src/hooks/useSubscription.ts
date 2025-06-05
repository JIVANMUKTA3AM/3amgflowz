
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface Subscription {
  id: string;
  email: string;
  user_id?: string;
  stripe_customer_id?: string;
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscriptionData, isLoading: loading, error } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id || !user?.email) {
        return {
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
        };
      }
      
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        throw error;
      }
      
      return data || {
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
      };
    },
    enabled: !!user?.id,
  });

  const checkSubscription = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        body: { userId: user.id },
      });

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
      
      return data;
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error);
      toast({
        title: "Erro ao verificar assinatura",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const manageSubscription = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: { userId: user.id },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Erro ao abrir portal do cliente:", error);
      toast({
        title: "Erro ao abrir portal",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const createSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionData: {
      email: string;
      subscription_tier: string;
      stripe_customer_id?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('subscribers')
        .insert({
          ...subscriptionData,
          user_id: user.id,
          subscribed: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
      toast({
        title: "Assinatura ativada!",
        description: "Sua assinatura foi configurada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating subscription:', error);
      toast({
        title: "Erro ao criar assinatura",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    subscriptionData: subscriptionData || {
      subscribed: false,
      subscription_tier: null,
      subscription_end: null,
    },
    loading,
    error,
    checkSubscription,
    manageSubscription,
    createSubscription: createSubscriptionMutation.mutate,
    isCreating: createSubscriptionMutation.isPending,
  };
};

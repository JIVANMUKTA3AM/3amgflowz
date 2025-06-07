
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_type: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  price_amount?: number;
  price_currency: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  plan_type: 'free' | 'basic' | 'premium' | 'enterprise';
  name: string;
  description?: string;
  price_amount: number;
  price_currency: string;
  billing_interval: string;
  stripe_price_id?: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export interface SubscriptionHistory {
  id: string;
  subscription_id: string;
  event_type: string;
  old_plan?: string;
  new_plan?: string;
  old_status?: string;
  new_status?: string;
  stripe_event_id?: string;
  event_data?: any;
  created_at: string;
}

export const useSubscriptionManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar assinatura atual do usuário
  const { data: subscription, isLoading: loadingSubscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!user?.id,
  });

  // Buscar planos disponíveis
  const { data: plans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  // Buscar histórico da assinatura
  const { data: history = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['subscription-history', subscription?.id],
    queryFn: async () => {
      if (!subscription?.id) return [];
      
      const { data, error } = await supabase
        .from('subscription_history')
        .select('*')
        .eq('subscription_id', subscription.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SubscriptionHistory[];
    },
    enabled: !!subscription?.id,
  });

  // Criar checkout para assinatura
  const createCheckoutMutation = useMutation({
    mutationFn: async (planType: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke("create-subscription-checkout", {
        body: { 
          planType,
          successUrl: `${window.location.origin}/subscription?success=true`,
          cancelUrl: `${window.location.origin}/subscription?canceled=true`
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error("Erro ao criar checkout:", error);
      toast({
        title: "Erro ao criar checkout",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Gerenciar assinatura (portal do cliente)
  const manageSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: { 
          returnUrl: `${window.location.origin}/subscription`
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      console.error("Erro ao abrir portal:", error);
      toast({
        title: "Erro ao abrir portal",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Cancelar assinatura
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (cancelAtPeriodEnd: boolean = true) => {
      if (!subscription?.stripe_subscription_id) {
        throw new Error('No subscription found');
      }
      
      const { data, error } = await supabase.functions.invoke("cancel-subscription", {
        body: { 
          subscriptionId: subscription.stripe_subscription_id,
          cancelAtPeriodEnd
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
      toast({
        title: "Assinatura atualizada",
        description: "Sua assinatura foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao cancelar assinatura:", error);
      toast({
        title: "Erro ao cancelar assinatura",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Verificar status da assinatura
  const checkSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.functions.invoke("check-subscription-status", {
        body: { userId: user.id },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
    },
    onError: (error) => {
      console.error("Erro ao verificar assinatura:", error);
      toast({
        title: "Erro ao verificar assinatura",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    subscription,
    plans,
    history,
    isLoading: loadingSubscription || loadingPlans,
    isLoadingHistory: loadingHistory,
    createCheckout: createCheckoutMutation.mutate,
    isCreatingCheckout: createCheckoutMutation.isPending,
    manageSubscription: manageSubscriptionMutation.mutate,
    isManaging: manageSubscriptionMutation.isPending,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    isCanceling: cancelSubscriptionMutation.isPending,
    checkSubscription: checkSubscriptionMutation.mutate,
    isChecking: checkSubscriptionMutation.isPending,
  };
};

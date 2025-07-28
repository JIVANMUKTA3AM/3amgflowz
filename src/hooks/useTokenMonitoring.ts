
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface TokenUsage {
  id: string;
  user_id: string;
  agent_configuration_id: string;
  date: string;
  tokens_used: number;
  cost_estimate: number;
  conversations_count: number;
  model_used: string;
  created_at: string;
}

export interface ModelPerformance {
  id: string;
  model_name: string;
  avg_response_time: number;
  total_tokens: number;
  success_rate: number;
  cost_per_token: number;
  conversations_count: number;
  date: string;
}

export interface UsageAlert {
  id: string;
  user_id: string;
  alert_type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  threshold_value: number;
  current_value: number;
  is_active: boolean;
  created_at: string;
}

export const useTokenMonitoring = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tokenUsage = [], isLoading: loadingTokenUsage } = useQuery({
    queryKey: ['token-usage', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('token_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as TokenUsage[];
    },
    enabled: !!user?.id,
  });

  const { data: modelPerformance = [], isLoading: loadingModelPerformance } = useQuery({
    queryKey: ['model-performance', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('model_performance')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as ModelPerformance[];
    },
    enabled: !!user?.id,
  });

  const { data: usageAlerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ['usage-alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('usage_alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UsageAlert[];
    },
    enabled: !!user?.id,
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['token-usage', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['model-performance', user?.id] });
    queryClient.invalidateQueries({ queryKey: ['usage-alerts', user?.id] });
  };

  return {
    tokenUsage,
    modelPerformance,
    usageAlerts,
    isLoading: loadingTokenUsage || loadingModelPerformance || loadingAlerts,
    refreshData,
  };
};

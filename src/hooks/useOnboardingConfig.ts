
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface OnboardingConfig {
  id: string;
  user_id: string;
  selected_services: string[];
  numero_assinantes: number;
  agent_configs: any;
  whatsapp_config?: any;
  olt_configs?: any[];
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useOnboardingConfig = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: config, isLoading, error } = useQuery({
    queryKey: ['onboarding-config', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('onboarding_configurations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as OnboardingConfig | null;
    },
    enabled: !!user?.id,
  });

  const saveConfigMutation = useMutation({
    mutationFn: async (configData: Partial<OnboardingConfig>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('onboarding_configurations')
        .upsert({
          ...configData,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-config', user?.id] });
    },
    onError: (error) => {
      console.error('Error saving onboarding config:', error);
      toast({
        title: "Erro ao salvar configuração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async (configData: Partial<OnboardingConfig>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('onboarding_configurations')
        .upsert({
          ...configData,
          user_id: user.id,
          is_completed: true,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-config', user?.id] });
      toast({
        title: "Onboarding concluído!",
        description: "Configuração salva com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erro ao completar onboarding",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    config,
    isLoading,
    error,
    saveConfig: saveConfigMutation.mutate,
    isSaving: saveConfigMutation.isPending,
    completeOnboarding: completeOnboardingMutation.mutate,
    isCompleting: completeOnboardingMutation.isPending,
  };
};

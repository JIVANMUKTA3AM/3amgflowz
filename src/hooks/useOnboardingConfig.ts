
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface OnboardingConfig {
  id?: string;
  user_id: string;
  selected_services: string[];
  numero_assinantes?: number;
  agent_configs: Record<string, any>;
  whatsapp_config?: {
    phoneNumberId?: string;
    accessToken?: string;
    webhookUrl?: string;
  };
  crm_config?: {
    type?: string;
    apiKey?: string;
    domain?: string;
  };
  webhook_config?: {
    url?: string;
    secret?: string;
  };
  olt_configs?: Array<{
    id?: string;
    name?: string;
    brand?: string;
    model?: string;
    ipAddress?: string;
    ip?: string;
    username?: string;
    password?: string;
  }>;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
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
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding config:', error);
        throw error;
      }
      
      return data as OnboardingConfig | null;
    },
    enabled: !!user?.id,
  });

  const saveConfigMutation = useMutation({
    mutationFn: async (configData: Partial<OnboardingConfig>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const dataToSave = {
        user_id: user.id,
        selected_services: configData.selected_services || [],
        numero_assinantes: configData.numero_assinantes || 0,
        agent_configs: configData.agent_configs || {},
        whatsapp_config: configData.whatsapp_config || null,
        crm_config: configData.crm_config || null,
        webhook_config: configData.webhook_config || null,
        olt_configs: configData.olt_configs || [],
        is_completed: configData.is_completed || false,
      };

      if (config?.id) {
        // Update existing config
        const { data, error } = await supabase
          .from('onboarding_configurations')
          .update(dataToSave)
          .eq('id', config.id)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new config
        const { data, error } = await supabase
          .from('onboarding_configurations')
          .insert(dataToSave)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-config', user?.id] });
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error saving onboarding config:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async (finalConfig: Partial<OnboardingConfig>) => {
      const completeConfig = {
        ...finalConfig,
        is_completed: true,
      };
      return saveConfigMutation.mutateAsync(completeConfig);
    },
    onSuccess: () => {
      toast({
        title: "Onboarding concluído!",
        description: "Suas configurações foram ativadas com sucesso.",
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

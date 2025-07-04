
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface OltConfiguration {
  id?: string;
  user_id: string;
  name: string;
  brand: string;
  model: string;
  ip_address: string;
  snmp_community: string;
  username?: string;
  password?: string;
  port: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useOltConfigurations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: configurations, isLoading, error } = useQuery({
    queryKey: ['olt-configurations', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('olt_configurations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching OLT configurations:', error);
        throw error;
      }
      
      return data as OltConfiguration[];
    },
    enabled: !!user?.id,
  });

  const saveConfigurationMutation = useMutation({
    mutationFn: async (config: Omit<OltConfiguration, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const configData = {
        user_id: user.id,
        name: config.name,
        brand: config.brand,
        model: config.model,
        ip_address: config.ip_address,
        snmp_community: config.snmp_community || 'public',
        username: config.username || null,
        password: config.password || null,
        port: config.port || '161',
        is_active: config.is_active
      };

      const { data, error } = await supabase
        .from('olt_configurations')
        .insert(configData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['olt-configurations', user?.id] });
      toast({
        title: "OLT configurada!",
        description: `${data.name} foi salva com sucesso no banco de dados.`,
      });
      
      // Trigger n8n webhook after successful save
      triggerN8nWebhook(data);
    },
    onError: (error) => {
      console.error('Error saving OLT configuration:', error);
      toast({
        title: "Erro ao salvar OLT",
        description: "Não foi possível salvar a configuração da OLT. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateConfigurationMutation = useMutation({
    mutationFn: async ({ id, ...config }: Partial<OltConfiguration> & { id: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('olt_configurations')
        .update(config)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['olt-configurations', user?.id] });
      toast({
        title: "OLT atualizada!",
        description: `${data.name} foi atualizada com sucesso.`,
      });
    },
    onError: (error) => {
      console.error('Error updating OLT configuration:', error);
      toast({
        title: "Erro ao atualizar OLT",
        description: "Não foi possível atualizar a configuração da OLT.",
        variant: "destructive",
      });
    },
  });

  const deleteConfigurationMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('olt_configurations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['olt-configurations', user?.id] });
      toast({
        title: "OLT removida",
        description: "Configuração deletada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error deleting OLT configuration:', error);
      toast({
        title: "Erro ao deletar OLT",
        description: "Não foi possível deletar a configuração da OLT.",
        variant: "destructive",
      });
    },
  });

  // Function to trigger n8n webhook with OLT data
  const triggerN8nWebhook = async (oltData: OltConfiguration) => {
    try {
      const webhookData = {
        event_type: 'olt_configured',
        user_id: user?.id,
        timestamp: new Date().toISOString(),
        olt_data: {
          id: oltData.id,
          name: oltData.name,
          brand: oltData.brand,
          model: oltData.model,
          ip_address: oltData.ip_address,
          snmp_community: oltData.snmp_community,
          port: oltData.port,
          is_active: oltData.is_active
        }
      };

      // Call edge function to trigger n8n webhook
      const { data, error } = await supabase.functions.invoke('trigger-n8n-webhook', {
        body: webhookData
      });

      if (error) {
        console.error('Error triggering n8n webhook:', error);
      } else {
        console.log('N8n webhook triggered successfully:', data);
      }
    } catch (error) {
      console.error('Error in triggerN8nWebhook:', error);
    }
  };

  return {
    configurations: configurations || [],
    isLoading,
    error,
    saveConfiguration: saveConfigurationMutation.mutate,
    isSaving: saveConfigurationMutation.isPending,
    updateConfiguration: updateConfigurationMutation.mutate,
    isUpdating: updateConfigurationMutation.isPending,
    deleteConfiguration: deleteConfigurationMutation.mutate,
    isDeleting: deleteConfigurationMutation.isPending,
  };
};

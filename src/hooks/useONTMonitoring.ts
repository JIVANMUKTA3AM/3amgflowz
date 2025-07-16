
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ONTData {
  id?: string;
  olt_configuration_id: string;
  user_id: string;
  ont_serial: string;
  ont_id: string;
  interface_id: string;
  status: string;
  optical_power_rx?: number;
  optical_power_tx?: number;
  temperature?: number;
  voltage?: number;
  last_seen?: string;
  created_at?: string;
  updated_at?: string;
}

export const useONTMonitoring = (oltConfigId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: ontData, isLoading, error } = useQuery({
    queryKey: ['ont-monitoring', user?.id, oltConfigId],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      let query = supabase
        .from('ont_monitoring')
        .select('*')
        .eq('user_id', user.id)
        .order('last_seen', { ascending: false });

      if (oltConfigId) {
        query = query.eq('olt_configuration_id', oltConfigId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as ONTData[];
    },
    enabled: !!user?.id,
  });

  const updateONTMutation = useMutation({
    mutationFn: async (ontData: Partial<ONTData> & { id: string }) => {
      const { id, ...updateData } = ontData;
      
      const { data, error } = await supabase
        .from('ont_monitoring')
        .update({
          ...updateData,
          last_seen: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ont-monitoring', user?.id] });
      toast({
        title: "ONT atualizada",
        description: "Dados da ONT foram atualizados com sucesso."
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar ONT",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const createONTMutation = useMutation({
    mutationFn: async (ontData: Omit<ONTData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ont_monitoring')
        .insert({
          ...ontData,
          user_id: user?.id,
          last_seen: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ont-monitoring', user?.id] });
      toast({
        title: "ONT cadastrada",
        description: "Nova ONT foi cadastrada para monitoramento."
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar ONT",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    ontData: ontData || [],
    isLoading,
    error,
    updateONT: updateONTMutation.mutate,
    createONT: createONTMutation.mutate,
    isUpdating: updateONTMutation.isPending,
    isCreating: createONTMutation.isPending
  };
};


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface N8nIntegration {
  id: string;
  nome: string;
  descricao?: string;
  webhook_url: string;
  evento_associado: string;
  tipo_execucao: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface N8nExecutionLog {
  id: string;
  integracao_id: string;
  status_resposta?: number;
  payload_enviado?: any;
  resposta_recebida?: any;
  timestamp_execucao: string;
  executado_por?: string;
  tipo_execucao?: string;
  erro_message?: string;
}

export const useN8nIntegrations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading: loadingIntegrations } = useQuery({
    queryKey: ['n8n-integrations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('integracoes_n8n')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as N8nIntegration[];
    },
    enabled: !!user?.id,
  });

  const { data: executionLogs, isLoading: loadingLogs } = useQuery({
    queryKey: ['n8n-execution-logs', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('n8n_execution_logs')
        .select('*, integracoes_n8n(nome)')
        .order('timestamp_execucao', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: Omit<N8nIntegration, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('integracoes_n8n')
        .insert(integration)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['n8n-integrations', user?.id] });
      toast({
        title: "Integração criada!",
        description: "Nova integração n8n foi configurada com sucesso.",
      });
    },
  });

  const executeIntegrationMutation = useMutation({
    mutationFn: async ({ integrationId, payload }: { integrationId: string; payload: any }) => {
      const integration = integrations?.find(i => i.id === integrationId);
      if (!integration) throw new Error('Integração não encontrada');

      // Fazer chamada para o webhook n8n
      const response = await fetch(integration.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.text();
      
      // Registrar log da execução
      const { error: logError } = await supabase
        .from('n8n_execution_logs')
        .insert({
          integracao_id: integrationId,
          status_resposta: response.status,
          payload_enviado: payload,
          resposta_recebida: responseData,
          executado_por: user?.id,
          tipo_execucao: 'manual',
          erro_message: response.ok ? null : `Erro HTTP ${response.status}`,
        });

      if (logError) console.error('Erro ao registrar log:', logError);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${responseData}`);
      }

      return { status: response.status, data: responseData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['n8n-execution-logs', user?.id] });
      toast({
        title: "Integração executada!",
        description: "A integração n8n foi executada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na execução",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    integrations,
    executionLogs,
    loadingIntegrations,
    loadingLogs,
    createIntegration: createIntegrationMutation.mutate,
    executeIntegration: executeIntegrationMutation.mutate,
    isCreating: createIntegrationMutation.isPending,
    isExecuting: executeIntegrationMutation.isPending,
  };
};

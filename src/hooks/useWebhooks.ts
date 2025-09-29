
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface Webhook {
  id: string;
  nome: string;
  url_destino: string;
  evento: string;
  headers: any;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  status_http?: number;
  payload_enviado?: any;
  resposta_recebida?: any;
  timestamp_execucao: string;
  erro_message?: string;
}

export const useWebhooks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: webhooks, isLoading: loadingWebhooks } = useQuery({
    queryKey: ['webhooks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Webhook[];
    },
    enabled: !!user?.id,
  });

  const { data: webhookLogs, isLoading: loadingLogs } = useQuery({
    queryKey: ['webhook-logs', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*, webhooks(nome)')
        .order('timestamp_execucao', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (webhook: Omit<Webhook, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('webhooks')
        .insert(webhook)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', user?.id] });
      toast({
        title: "Webhook criado!",
        description: "Novo webhook foi configurado com sucesso.",
      });
    },
  });

  const updateWebhookMutation = useMutation({
    mutationFn: async ({ id, ...webhook }: Partial<Webhook> & { id: string }) => {
      const { data, error } = await supabase
        .from('webhooks')
        .update(webhook)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', user?.id] });
      toast({
        title: "Webhook atualizado!",
        description: "Webhook foi atualizado com sucesso.",
      });
    },
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', user?.id] });
      toast({
        title: "Webhook removido!",
        description: "Webhook foi removido com sucesso.",
      });
    },
  });

  const testWebhookMutation = useMutation({
    mutationFn: async ({ webhookId, webhookUrl, customPayload }: { 
      webhookId: string; 
      webhookUrl: string; 
      customPayload?: any 
    }) => {
      const { data, error } = await supabase.functions.invoke('webhook-tester', {
        body: {
          webhook_url: webhookUrl,
          webhook_id: webhookId,
          test_payload: customPayload,
          timeout_ms: 15000
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['webhook-logs', user?.id] });
      toast({
        title: data.test_result.success ? "Teste bem-sucedido!" : "Teste falhou",
        description: data.test_result.success 
          ? `Webhook respondeu em ${data.test_result.response_time_ms}ms`
          : data.test_result.error_message || "Erro desconhecido",
        variant: data.test_result.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no teste",
        description: "Falha ao executar teste do webhook. Verifique a URL e tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    webhooks,
    webhookLogs,
    loadingWebhooks,
    loadingLogs,
    createWebhook: createWebhookMutation.mutate,
    updateWebhook: updateWebhookMutation.mutate,
    deleteWebhook: deleteWebhookMutation.mutate,
    testWebhook: testWebhookMutation.mutate,
    isCreating: createWebhookMutation.isPending,
    isUpdating: updateWebhookMutation.isPending,
    isDeleting: deleteWebhookMutation.isPending,
    isTesting: testWebhookMutation.isPending,
  };
};

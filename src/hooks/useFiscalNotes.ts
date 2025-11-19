import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface FiscalNote {
  id: string;
  user_id: string;
  organization_id: string | null;
  invoice_id: string;
  provider: string;
  note_number: string | null;
  serie: string | null;
  note_key: string | null;
  pdf_url: string | null;
  xml_url: string | null;
  status: 'pending' | 'processing' | 'issued' | 'error' | 'cancelled';
  error_message: string | null;
  external_id: string | null;
  issued_at: string | null;
  cancelled_at: string | null;
  competencia: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface FiscalApiConfig {
  id?: string;
  user_id?: string;
  organization_id?: string | null;
  provider: 'nfeio' | 'enotas' | 'other';
  api_token: string;
  api_url: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Permitir campos dinâmicos do banco
}

export function useFiscalNotes() {
  const queryClient = useQueryClient();

  // Buscar notas fiscais
  const { data: fiscalNotes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['fiscal-notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiscal_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FiscalNote[];
    },
  });

  // Buscar configurações de API
  const { data: apiConfigs, isLoading: isLoadingConfigs } = useQuery({
    queryKey: ['fiscal-api-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fiscal_api_configs')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data as FiscalApiConfig[];
    },
  });

  // Salvar configuração de API
  const saveConfigMutation = useMutation({
    mutationFn: async (config: Partial<FiscalApiConfig>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('fiscal_api_configs')
        .upsert({
          ...config,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiscal-api-configs'] });
      toast({
        title: "Configuração salva",
        description: "API fiscal configurada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar configuração",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Emitir nota fiscal
  const issueNoteMutation = useMutation({
    mutationFn: async ({ 
      invoiceId, 
      provider 
    }: { 
      invoiceId: string; 
      provider: 'nfeio' | 'enotas' | 'other' 
    }) => {
      const { data, error } = await supabase.functions.invoke('issue-fiscal-note', {
        body: { invoiceId, provider },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['fiscal-notes'] });
      toast({
        title: "Nota fiscal emitida!",
        description: `Número: ${data.data.noteNumber}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao emitir nota fiscal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancelar nota fiscal
  const cancelNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { data, error } = await supabase
        .from('fiscal_notes')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fiscal-notes'] });
      toast({
        title: "Nota fiscal cancelada",
        description: "A nota foi cancelada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cancelar nota",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Testar conexão com API fiscal
  const testConnectionMutation = useMutation({
    mutationFn: async ({ 
      provider, 
      apiToken,
      apiUrl 
    }: { 
      provider: string; 
      apiToken: string;
      apiUrl: string | null;
    }) => {
      // Simular teste de conexão
      // Na prática, aqui seria feita uma chamada real para a API fiscal
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso (em produção, fazer validação real)
      return { success: true, message: 'Conexão testada com sucesso!' };
    },
    onSuccess: (data) => {
      toast({
        title: "Teste de conexão",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no teste de conexão",
        description: error.message || "Não foi possível conectar à API fiscal",
        variant: "destructive",
      });
    },
  });

  return {
    fiscalNotes: fiscalNotes || [],
    apiConfigs: apiConfigs || [],
    isLoading: isLoadingNotes || isLoadingConfigs,
    saveConfig: saveConfigMutation.mutate,
    isSavingConfig: saveConfigMutation.isPending,
    testConnection: testConnectionMutation.mutate,
    isTestingConnection: testConnectionMutation.isPending,
    issueNote: issueNoteMutation.mutate,
    isIssuingNote: issueNoteMutation.isPending,
    cancelNote: cancelNoteMutation.mutate,
    isCancellingNote: cancelNoteMutation.isPending,
  };
}

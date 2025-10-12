import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ExecuteRequest {
  tenant_id: string;
  setor: 'triagem' | 'tecnico' | 'comercial' | 'financeiro';
  acao: string;
  parametros: Record<string, any>;
  tipo_agente?: 'externo' | 'interno';
}

interface ExecuteResponse {
  sucesso: boolean;
  resposta: string;
  dados?: Record<string, any>;
  proxima_acao?: string;
}

export const useAgentExecute = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const executeAction = async (request: ExecuteRequest): Promise<ExecuteResponse | null> => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('agents-execute', {
        body: request
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.sucesso && !data.resposta) {
        throw new Error('Resposta inválida do servidor');
      }

      console.log('✅ Execução bem-sucedida:', data);
      return data as ExecuteResponse;

    } catch (error: any) {
      console.error('❌ Erro na execução:', error);
      toast({
        title: "Erro na execução",
        description: error.message || 'Erro ao executar ação',
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeAction,
    isLoading
  };
};

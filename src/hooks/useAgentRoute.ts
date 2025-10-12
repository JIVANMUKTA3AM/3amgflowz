import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface RouteRequest {
  tenant_id: string;
  canal: string;
  mensagem: string;
  contexto?: Record<string, any>;
}

interface RouteResponse {
  setor_destino: 'triagem' | 'tecnico' | 'comercial' | 'financeiro';
  intencao: string;
  confianca: number;
  payload: Record<string, any>;
}

export const useAgentRoute = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const routeMessage = async (request: RouteRequest): Promise<RouteResponse | null> => {
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
      const { data, error } = await supabase.functions.invoke('agents-route', {
        body: request
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.setor_destino) {
        throw new Error('Resposta inválida do servidor');
      }

      console.log('✅ Roteamento bem-sucedido:', data);
      return data as RouteResponse;

    } catch (error: any) {
      console.error('❌ Erro no roteamento:', error);
      toast({
        title: "Erro no roteamento",
        description: error.message || 'Erro ao rotear mensagem',
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    routeMessage,
    isLoading
  };
};

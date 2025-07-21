
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface HTTPOperation {
  oltConfigId: string;
  operation: 'get' | 'post' | 'put' | 'delete';
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
}

interface HTTPResult {
  status: number;
  data: any;
  headers: Record<string, string>;
}

export const useHTTPOperations = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HTTPResult | null>(null);

  const executeHTTP = async (operation: HTTPOperation) => {
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
      const { data, error } = await supabase.functions.invoke('http-operations', {
        body: operation
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setResults(data.data || null);
        toast({
          title: "Comando HTTP executado",
          description: `Operação ${operation.operation.toUpperCase()} concluída com sucesso`
        });
        return data.data;
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }

    } catch (error) {
      console.error('HTTP operation error:', error);
      toast({
        title: "Erro na operação HTTP",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeHTTP,
    isLoading,
    results,
    setResults
  };
};

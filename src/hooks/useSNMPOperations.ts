
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SNMPOperation {
  oltConfigId: string;
  operation: 'get' | 'walk' | 'set';
  oid: string;
  value?: string;
  community?: string;
}

interface SNMPResult {
  oid: string;
  value: string;
  type: string;
}

export const useSNMPOperations = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SNMPResult[]>([]);

  const executeSNMP = async (operation: SNMPOperation) => {
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
      const { data, error } = await supabase.functions.invoke('snmp-operations', {
        body: operation
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setResults(data.data || []);
        toast({
          title: "Comando SNMP executado",
          description: `Operação ${operation.operation.toUpperCase()} concluída com sucesso`
        });
        return data.data;
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }

    } catch (error) {
      console.error('SNMP operation error:', error);
      toast({
        title: "Erro na operação SNMP",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeSNMP,
    isLoading,
    results,
    setResults
  };
};


import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";

export const useWorkflowSafe = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleWorkflowTrigger = async () => {
    setIsLoading(true);
    try {
      // Simulação de trigger de workflow
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Workflow acionado",
        description: "O workflow foi executado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao acionar workflow:', error);
      toast({
        title: "Erro no workflow",
        description: "Não foi possível executar o workflow.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleWorkflowTrigger,
    isLoading
  };
};

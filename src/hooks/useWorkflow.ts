
import { useState } from 'react';

export const useWorkflow = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleWorkflowTrigger = async (workflowType: string) => {
    setIsLoading(true);
    try {
      // Simular processamento do workflow
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Workflow ${workflowType} executado`);
    } catch (error) {
      console.error('Erro ao executar workflow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleWorkflowTrigger,
    isLoading
  };
};

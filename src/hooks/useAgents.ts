
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'chatbot' | 'voice' | 'email' | 'sms' | 'whatsapp';
  base_price: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface UserAgent {
  id: string;
  user_id: string;
  agent_type: 'chatbot' | 'voice' | 'email' | 'sms' | 'whatsapp';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAgents = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Buscar todos os tipos de agentes disponíveis
  const { data: availableAgents, isLoading: loadingAvailable } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('type');
      
      if (error) throw error;
      return data as Agent[];
    },
  });

  // Buscar agentes do usuário
  const { data: userAgents, isLoading: loadingUserAgents } = useQuery({
    queryKey: ['user-agents', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');
      
      if (error) throw error;
      return data as UserAgent[];
    },
    enabled: !!user?.id,
  });

  // Buscar modelos de IA disponíveis
  const getAvailableModels = () => {
    return [
      // Modelos OpenAI
      { value: 'gpt-4o', label: 'GPT-4 Omni (OpenAI)', provider: 'openai', description: 'Modelo mais avançado da OpenAI com capacidades multimodais' },
      { value: 'gpt-4o-mini', label: 'GPT-4 Omni Mini (OpenAI)', provider: 'openai', description: 'Versão mais rápida e econômica do GPT-4' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (OpenAI)', provider: 'openai', description: 'GPT-4 otimizado para velocidade' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (OpenAI)', provider: 'openai', description: 'Modelo rápido e eficiente para tarefas gerais' },
      
      // Modelos Gemini (Google)
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Google)', provider: 'gemini', description: 'Modelo mais avançado do Google Gemini' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Google)', provider: 'gemini', description: 'Versão rápida do Gemini para respostas instantâneas' },
      { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro (Google)', provider: 'gemini', description: 'Modelo estável e confiável' },
    ];
  };

  // Contratar um agente
  const contractAgentMutation = useMutation({
    mutationFn: async (agentType: 'chatbot' | 'voice' | 'email' | 'sms' | 'whatsapp') => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_agents')
        .insert({
          user_id: user.id,
          agent_type: agentType,
          is_active: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-agents', user?.id] });
      toast({
        title: "Agente contratado!",
        description: "Seu novo agente foi ativado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error contracting agent:', error);
      toast({
        title: "Erro ao contratar agente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  // Ativar/desativar agente
  const toggleAgentMutation = useMutation({
    mutationFn: async ({ agentId, isActive }: { agentId: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('user_agents')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', agentId)
        .eq('user_id', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-agents', user?.id] });
      toast({
        title: "Status atualizado",
        description: "O status do agente foi alterado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error toggling agent:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    availableAgents,
    userAgents,
    availableModels: getAvailableModels(),
    isLoading: loadingAvailable || loadingUserAgents,
    contractAgent: contractAgentMutation.mutate,
    isContracting: contractAgentMutation.isPending,
    toggleAgent: toggleAgentMutation.mutate,
    isToggling: toggleAgentMutation.isPending,
  };
};

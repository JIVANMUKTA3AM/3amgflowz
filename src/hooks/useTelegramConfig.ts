
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface TelegramConfig {
  id?: string;
  user_id: string;
  bot_token: string;
  bot_username?: string;
  webhook_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useTelegramConfig = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['telegram-config', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('telegram_configurations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as TelegramConfig | null;
    },
    enabled: !!user?.id,
  });

  const saveConfig = useMutation({
    mutationFn: async (configData: Omit<TelegramConfig, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('telegram_configurations')
        .upsert({
          ...configData,
          user_id: user!.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-config', user?.id] });
      toast({
        title: "Configuração do Telegram salva!",
        description: "Suas configurações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error saving telegram config:', error);
      toast({
        title: "Erro ao salvar configuração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const testBot = useMutation({
    mutationFn: async (botToken: string) => {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(result.description || 'Token inválido');
      }
      
      return result.result;
    },
    onSuccess: (botInfo) => {
      toast({
        title: "Bot validado com sucesso!",
        description: `Bot: @${botInfo.username} (${botInfo.first_name})`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao validar bot",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    config,
    isLoading,
    saveConfig: saveConfig.mutate,
    isSaving: saveConfig.isPending,
    testBot: testBot.mutate,
    isTesting: testBot.isPending,
  };
};

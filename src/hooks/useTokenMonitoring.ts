
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface TokenUsage {
  date: string;
  model: string;
  tokens_used: number;
  cost_estimate: number;
  conversations_count: number;
}

export interface ModelPerformance {
  model: string;
  total_tokens: number;
  avg_response_time: number;
  total_conversations: number;
  success_rate: number;
  cost_estimate: number;
}

export interface UsageAlert {
  id: string;
  type: 'daily_limit' | 'monthly_limit' | 'cost_threshold';
  threshold: number;
  current_usage: number;
  message: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

export const useTokenMonitoring = () => {
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [usageAlerts, setUsageAlerts] = useState<UsageAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estimativas de custo por modelo (valores aproximados por 1k tokens)
  const modelCosts = {
    'gpt-4.1-2025-04-14': 0.03,
    'o4-mini-2025-04-16': 0.002,
    'o3-2025-04-16': 0.06,
    'gpt-4o': 0.005,
    'gpt-4o-mini': 0.0015,
    'claude-opus-4-20250514': 0.075,
    'claude-sonnet-4-20250514': 0.015,
    'claude-3-5-haiku-20241022': 0.001,
    'gemini-1.5-pro-002': 0.0035,
    'gemini-1.5-flash-002': 0.00035,
  };

  const calculateCost = (model: string, tokens: number): number => {
    const costPerThousand = modelCosts[model as keyof typeof modelCosts] || 0.001;
    return (tokens / 1000) * costPerThousand;
  };

  const fetchTokenUsage = async () => {
    try {
      const { data: conversations, error } = await supabase
        .from('agent_conversations')
        .select('created_at, model_used, tokens_used, response_time_ms')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Agrupar por data e modelo
      const usageMap = new Map<string, TokenUsage>();
      
      conversations?.forEach(conv => {
        const date = new Date(conv.created_at).toISOString().split('T')[0];
        const key = `${date}-${conv.model_used}`;
        
        if (!usageMap.has(key)) {
          usageMap.set(key, {
            date,
            model: conv.model_used,
            tokens_used: 0,
            cost_estimate: 0,
            conversations_count: 0,
          });
        }
        
        const usage = usageMap.get(key)!;
        usage.tokens_used += conv.tokens_used || 0;
        usage.conversations_count += 1;
        usage.cost_estimate += calculateCost(conv.model_used, conv.tokens_used || 0);
      });

      setTokenUsage(Array.from(usageMap.values()).sort((a, b) => b.date.localeCompare(a.date)));
    } catch (error) {
      console.error('Erro ao buscar uso de tokens:', error);
    }
  };

  const fetchModelPerformance = async () => {
    try {
      const { data: conversations, error } = await supabase
        .from('agent_conversations')
        .select('model_used, tokens_used, response_time_ms')
        .not('response_time_ms', 'is', null);

      if (error) throw error;

      // Agrupar por modelo
      const performanceMap = new Map<string, {
        total_tokens: number;
        total_response_time: number;
        total_conversations: number;
        total_cost: number;
      }>();

      conversations?.forEach(conv => {
        if (!performanceMap.has(conv.model_used)) {
          performanceMap.set(conv.model_used, {
            total_tokens: 0,
            total_response_time: 0,
            total_conversations: 0,
            total_cost: 0,
          });
        }

        const perf = performanceMap.get(conv.model_used)!;
        perf.total_tokens += conv.tokens_used || 0;
        perf.total_response_time += conv.response_time_ms || 0;
        perf.total_conversations += 1;
        perf.total_cost += calculateCost(conv.model_used, conv.tokens_used || 0);
      });

      const performance = Array.from(performanceMap.entries()).map(([model, data]) => ({
        model,
        total_tokens: data.total_tokens,
        avg_response_time: data.total_response_time / data.total_conversations,
        total_conversations: data.total_conversations,
        success_rate: 100, // Assumindo 100% para conversas registradas
        cost_estimate: data.total_cost,
      }));

      setModelPerformance(performance.sort((a, b) => b.total_conversations - a.total_conversations));
    } catch (error) {
      console.error('Erro ao buscar performance dos modelos:', error);
    }
  };

  const checkUsageAlerts = async () => {
    const alerts: UsageAlert[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar uso diário
    const todayUsage = tokenUsage.filter(usage => usage.date === today);
    const dailyTokens = todayUsage.reduce((sum, usage) => sum + usage.tokens_used, 0);
    const dailyCost = todayUsage.reduce((sum, usage) => sum + usage.cost_estimate, 0);

    if (dailyTokens > 50000) {
      alerts.push({
        id: 'daily-tokens',
        type: 'daily_limit',
        threshold: 50000,
        current_usage: dailyTokens,
        message: `Uso diário de tokens alto: ${dailyTokens.toLocaleString()} tokens`,
        severity: dailyTokens > 100000 ? 'high' : 'medium',
        created_at: new Date().toISOString(),
      });
    }

    if (dailyCost > 10) {
      alerts.push({
        id: 'daily-cost',
        type: 'cost_threshold',
        threshold: 10,
        current_usage: dailyCost,
        message: `Custo diário alto: $${dailyCost.toFixed(2)}`,
        severity: dailyCost > 25 ? 'high' : 'medium',
        created_at: new Date().toISOString(),
      });
    }

    // Verificar uso mensal
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyUsage = tokenUsage.filter(usage => usage.date.startsWith(currentMonth));
    const monthlyTokens = monthlyUsage.reduce((sum, usage) => sum + usage.tokens_used, 0);
    const monthlyCost = monthlyUsage.reduce((sum, usage) => sum + usage.cost_estimate, 0);

    if (monthlyTokens > 500000) {
      alerts.push({
        id: 'monthly-tokens',
        type: 'monthly_limit',
        threshold: 500000,
        current_usage: monthlyTokens,
        message: `Uso mensal de tokens alto: ${monthlyTokens.toLocaleString()} tokens`,
        severity: monthlyTokens > 1000000 ? 'high' : 'medium',
        created_at: new Date().toISOString(),
      });
    }

    if (monthlyCost > 100) {
      alerts.push({
        id: 'monthly-cost',
        type: 'cost_threshold',
        threshold: 100,
        current_usage: monthlyCost,
        message: `Custo mensal alto: $${monthlyCost.toFixed(2)}`,
        severity: monthlyCost > 250 ? 'high' : 'medium',
        created_at: new Date().toISOString(),
      });
    }

    setUsageAlerts(alerts);

    // Mostrar toast para alertas críticos
    alerts.forEach(alert => {
      if (alert.severity === 'high') {
        toast({
          title: "Alerta de Uso Crítico",
          description: alert.message,
          variant: "destructive",
        });
      }
    });
  };

  const refreshData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchTokenUsage(),
      fetchModelPerformance(),
    ]);
    await checkUsageAlerts();
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    tokenUsage,
    modelPerformance,
    usageAlerts,
    isLoading,
    refreshData,
    calculateCost,
  };
};

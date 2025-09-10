
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface AIProvider {
  id: string;
  name: string;
  models: string[];
  supportsVision: boolean;
  maxTokens: number;
  category?: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      "gpt-5-2025-08-07",
      "gpt-5-mini-2025-08-07", 
      "gpt-5-nano-2025-08-07",
      "gpt-4.1-2025-04-14",
      "gpt-4.1-mini-2025-04-14",
      "o4-mini-2025-04-16", 
      "o3-2025-04-16",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-3.5-turbo"
    ],
    supportsVision: true,
    maxTokens: 16384,
    category: "flagship"
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    models: [
      "claude-opus-4-20250514",
      "claude-sonnet-4-20250514", 
      "claude-3-5-haiku-20241022",
      "claude-3-7-sonnet-20250219",
      "claude-3-5-sonnet-20241022",
      "claude-3-opus-20240229"
    ],
    supportsVision: true,
    maxTokens: 200000,
    category: "flagship"
  },
  {
    id: "google",
    name: "Google (Gemini)",
    models: [
      "gemini-2.0-flash-exp",
      "gemini-1.5-pro-002",
      "gemini-1.5-flash-002",
      "gemini-1.5-pro",
      "gemini-1.5-flash", 
      "gemini-1.0-pro"
    ],
    supportsVision: true,
    maxTokens: 32768,
    category: "flagship"
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    models: [
      "deepseek-r1",
      "deepseek-v3",
      "deepseek-chat",
      "deepseek-coder"
    ],
    supportsVision: false,
    maxTokens: 8192,
    category: "flagship"
  },
];

export const getModelInfo = (model: string) => {
  const provider = AI_PROVIDERS.find(p => p.models.includes(model));
  
  const modelInfo: { [key: string]: { description: string; recommended?: boolean; category: string } } = {
    // OpenAI GPT-5 Series
    "gpt-5-2025-08-07": { description: "Modelo flagship mais avançado da OpenAI", recommended: true, category: "flagship" },
    "gpt-5-mini-2025-08-07": { description: "Versão rápida e eficiente do GPT-5", recommended: true, category: "speed" },
    "gpt-5-nano-2025-08-07": { description: "Versão ultra-rápida para classificação", category: "speed" },
    
    // OpenAI GPT-4.1 Series
    "gpt-4.1-2025-04-14": { description: "GPT-4 confiável para resultados consistentes", recommended: true, category: "flagship" },
    "gpt-4.1-mini-2025-04-14": { description: "Versão compacta do GPT-4.1", category: "economy" },
    
    // OpenAI Reasoning Models
    "o4-mini-2025-04-16": { description: "Raciocínio rápido otimizado", recommended: true, category: "reasoning" },
    "o3-2025-04-16": { description: "Raciocínio avançado para problemas complexos", recommended: true, category: "reasoning" },
    
    // OpenAI Legacy
    "gpt-4o": { description: "Modelo anterior com visão", category: "legacy" },
    "gpt-4o-mini": { description: "Versão rápida e econômica (legado)", category: "legacy" },
    "gpt-3.5-turbo": { description: "Modelo básico econômico", category: "economy" },
    
    // Anthropic Claude 4
    "claude-opus-4-20250514": { description: "Mais capaz e inteligente da Anthropic", recommended: true, category: "flagship" },
    "claude-sonnet-4-20250514": { description: "Alto desempenho com eficiência excepcional", recommended: true, category: "flagship" },
    
    // Anthropic Claude 3
    "claude-3-5-haiku-20241022": { description: "Modelo mais rápido para respostas instantâneas", recommended: true, category: "speed" },
    "claude-3-7-sonnet-20250219": { description: "Pensamento estendido mas sendo superado", category: "reasoning" },
    "claude-3-5-sonnet-20241022": { description: "Modelo anterior inteligente (substituído)", category: "legacy" },
    "claude-3-opus-20240229": { description: "Poderoso mas mais antigo que Claude 4", category: "legacy" },
    
    // Google Gemini
    "gemini-2.0-flash-exp": { description: "Versão experimental mais recente", recommended: true, category: "experimental" },
    "gemini-1.5-pro-002": { description: "Versão mais recente Pro", recommended: true, category: "flagship" },
    "gemini-1.5-flash-002": { description: "Versão mais recente Flash", recommended: true, category: "speed" },
    "gemini-1.5-pro": { description: "Modelo Pro anterior", category: "legacy" },
    "gemini-1.5-flash": { description: "Modelo Flash anterior", category: "legacy" },
    "gemini-1.0-pro": { description: "Versão 1.0 básica", category: "legacy" },

    // DeepSeek Models
    "deepseek-r1": { description: "Modelo de raciocínio da DeepSeek", recommended: true, category: "reasoning" },
    "deepseek-v3": { description: "Modelo principal para conversas gerais", recommended: true, category: "flagship" },
    "deepseek-chat": { description: "Modelo conversacional otimizado", category: "flagship" },
    "deepseek-coder": { description: "Especializado em programação", category: "coding" },
  };
  
  return {
    provider,
    info: modelInfo[model] || { description: "Modelo disponível", category: "standard" }
  };
};

export const useAIProviders = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const getProviderFromModel = (model: string): AIProvider | null => {
    return AI_PROVIDERS.find(provider => 
      provider.models.includes(model)
    ) || null;
  };

  const validateConfiguration = (model: string, temperature: number, maxTokens: number) => {
    const provider = getProviderFromModel(model);
    
    if (!provider) {
      toast({
        title: "Modelo não suportado",
        description: `O modelo ${model} não está disponível nos provedores configurados.`,
        variant: "destructive",
      });
      return false;
    }

    // Verificar se é um modelo mais novo que não suporta temperature
    const newerModels = [
      'gpt-5-2025-08-07', 'gpt-5-mini-2025-08-07', 'gpt-5-nano-2025-08-07',
      'gpt-4.1-2025-04-14', 'gpt-4.1-mini-2025-04-14',
      'o3-2025-04-16', 'o4-mini-2025-04-16'
    ];
    
    if (newerModels.includes(model) && temperature !== 0.7) {
      toast({
        title: "Parâmetro não suportado",
        description: `O modelo ${model} não suporta o parâmetro temperature. Será usado o valor padrão.`,
        variant: "default",
      });
    } else if (!newerModels.includes(model) && (temperature < 0 || temperature > 2)) {
      toast({
        title: "Temperatura inválida",
        description: "A temperatura deve estar entre 0 e 2.",
        variant: "destructive",
      });
      return false;
    }

    if (maxTokens > provider.maxTokens) {
      toast({
        title: "Limite de tokens excedido",
        description: `O máximo de tokens para ${provider.name} é ${provider.maxTokens}.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const getRecommendedModels = () => {
    return AI_PROVIDERS.flatMap(provider => 
      provider.models.filter(model => getModelInfo(model).info.recommended)
    );
  };

  return {
    providers: AI_PROVIDERS,
    isProcessing,
    setIsProcessing,
    getProviderFromModel,
    validateConfiguration,
    getRecommendedModels,
    getModelInfo,
  };
};

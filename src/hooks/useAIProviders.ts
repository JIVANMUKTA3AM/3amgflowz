
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
      "gpt-4.1-2025-04-14",
      "o4-mini-2025-04-16", 
      "o3-2025-04-16",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-3.5-turbo"
    ],
    supportsVision: true,
    maxTokens: 4096,
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
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307"
    ],
    supportsVision: true,
    maxTokens: 8192,
    category: "flagship"
  },
  {
    id: "google",
    name: "Google (Gemini)",
    models: [
      "gemini-1.5-pro-002",
      "gemini-1.5-flash-002",
      "gemini-1.5-pro",
      "gemini-1.5-flash", 
      "gemini-1.0-pro"
    ],
    supportsVision: true,
    maxTokens: 8192,
    category: "flagship"
  },
];

export const getModelInfo = (model: string) => {
  const provider = AI_PROVIDERS.find(p => p.models.includes(model));
  
  const modelInfo: { [key: string]: { description: string; recommended?: boolean; category: string } } = {
    // OpenAI Models
    "gpt-4.1-2025-04-14": { description: "Modelo principal mais recente", recommended: true, category: "flagship" },
    "o4-mini-2025-04-16": { description: "Modelo de raciocínio rápido", category: "reasoning" },
    "o3-2025-04-16": { description: "Modelo de raciocínio poderoso", category: "reasoning" },
    "gpt-4o": { description: "Modelo anterior com visão", category: "legacy" },
    "gpt-4o-mini": { description: "Versão rápida e econômica", category: "economy" },
    "gpt-3.5-turbo": { description: "Modelo básico econômico", category: "economy" },
    
    // Anthropic Models
    "claude-opus-4-20250514": { description: "Mais capaz e inteligente", recommended: true, category: "flagship" },
    "claude-sonnet-4-20250514": { description: "Alto desempenho e eficiência", recommended: true, category: "flagship" },
    "claude-3-5-haiku-20241022": { description: "Modelo mais rápido", category: "speed" },
    "claude-3-7-sonnet-20250219": { description: "Pensamento estendido", category: "reasoning" },
    "claude-3-5-sonnet-20241022": { description: "Modelo anterior inteligente", category: "legacy" },
    "claude-3-opus-20240229": { description: "Versão anterior poderosa", category: "legacy" },
    "claude-3-sonnet-20240229": { description: "Versão anterior balanceada", category: "legacy" },
    "claude-3-haiku-20240307": { description: "Versão anterior rápida", category: "legacy" },
    
    // Google Models
    "gemini-1.5-pro-002": { description: "Versão mais recente Pro", recommended: true, category: "flagship" },
    "gemini-1.5-flash-002": { description: "Versão mais recente Flash", category: "speed" },
    "gemini-1.5-pro": { description: "Modelo Pro anterior", category: "legacy" },
    "gemini-1.5-flash": { description: "Modelo Flash anterior", category: "legacy" },
    "gemini-1.0-pro": { description: "Versão 1.0 básica", category: "legacy" },
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

    if (temperature < 0 || temperature > 2) {
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

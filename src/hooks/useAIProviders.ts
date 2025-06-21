
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface AIProvider {
  id: string;
  name: string;
  models: string[];
  supportsVision: boolean;
  maxTokens: number;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
    supportsVision: true,
    maxTokens: 4096,
  },
  {
    id: "anthropic",
    name: "Anthropic (Claude)",
    models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
    supportsVision: true,
    maxTokens: 4096,
  },
  {
    id: "google",
    name: "Google (Gemini)",
    models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"],
    supportsVision: true,
    maxTokens: 8192,
  },
];

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

  return {
    providers: AI_PROVIDERS,
    isProcessing,
    setIsProcessing,
    getProviderFromModel,
    validateConfiguration,
  };
};

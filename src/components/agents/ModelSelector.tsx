
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAIProviders, getModelInfo } from "@/hooks/useAIProviders";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  const { providers } = useAIProviders();

  const groupedModels = providers.reduce((acc, provider) => {
    acc[provider.name] = provider.models.map(model => ({
      value: model,
      label: model,
      provider: provider.name,
      ...getModelInfo(model)
    }));
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Modelo de IA</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Escolha o modelo de IA que melhor se adequa ao seu agente</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um modelo" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {Object.entries(groupedModels).map(([providerName, models]) => (
            <div key={providerName}>
              <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                {providerName}
              </div>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value} className="py-3">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{model.label}</span>
                      <div className="flex gap-1">
                        {model.info.recommended && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Recomendado
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {model.info.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-left">
                      {model.info.description}
                    </p>
                  </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelector;

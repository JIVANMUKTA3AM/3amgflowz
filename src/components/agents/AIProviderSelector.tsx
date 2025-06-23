
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Eye, Zap, Star, Clock, Brain } from "lucide-react";
import { AI_PROVIDERS, AIProvider, getModelInfo } from "@/hooks/useAIProviders";

interface AIProviderSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  className?: string;
}

const AIProviderSelector = ({ selectedModel, onModelChange, className }: AIProviderSelectorProps) => {
  const getSelectedProvider = (): AIProvider | null => {
    return AI_PROVIDERS.find(provider => 
      provider.models.includes(selectedModel)
    ) || null;
  };

  const selectedProvider = getSelectedProvider();
  const selectedModelInfo = getModelInfo(selectedModel);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flagship": return <Star className="h-3 w-3 text-yellow-500" />;
      case "reasoning": return <Brain className="h-3 w-3 text-purple-500" />;
      case "speed": return <Clock className="h-3 w-3 text-green-500" />;
      case "economy": return <Zap className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "flagship": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "reasoning": return "bg-purple-50 text-purple-700 border-purple-200";
      case "speed": return "bg-green-50 text-green-700 border-green-200";
      case "economy": return "bg-blue-50 text-blue-700 border-blue-200";
      case "legacy": return "bg-gray-50 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Provedor de IA</label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um modelo de IA" />
            </SelectTrigger>
            <SelectContent>
              {AI_PROVIDERS.map((provider) => (
                <div key={provider.id}>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                    {provider.name}
                  </div>
                  {provider.models.map((model) => {
                    const modelInfo = getModelInfo(model);
                    return (
                      <SelectItem key={model} value={model} className="pl-6">
                        <div className="flex items-center gap-2 w-full">
                          <span className="flex-1">{model}</span>
                          <div className="flex items-center gap-1">
                            {modelInfo.info.recommended && (
                              <Star className="h-3 w-3 text-yellow-500" />
                            )}
                            {provider.supportsVision && (
                              <Eye className="h-3 w-3 text-blue-500" />
                            )}
                            {getCategoryIcon(modelInfo.info.category)}
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProvider && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="h-4 w-4" />
                {selectedProvider.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1">
                  <Zap className="h-3 w-3" />
                  {selectedProvider.maxTokens} tokens
                </Badge>
                {selectedProvider.supportsVision && (
                  <Badge variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    Visão
                  </Badge>
                )}
                {selectedModelInfo.info.recommended && (
                  <Badge variant="outline" className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-300">
                    <Star className="h-3 w-3" />
                    Recomendado
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Modelo:</span> {selectedModel}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedModelInfo.info.description}
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getCategoryColor(selectedModelInfo.info.category)}`}
                >
                  {selectedModelInfo.info.category === "flagship" && "Principal"}
                  {selectedModelInfo.info.category === "reasoning" && "Raciocínio"}
                  {selectedModelInfo.info.category === "speed" && "Velocidade"}
                  {selectedModelInfo.info.category === "economy" && "Econômico"}
                  {selectedModelInfo.info.category === "legacy" && "Anterior"}
                  {selectedModelInfo.info.category === "standard" && "Padrão"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIProviderSelector;

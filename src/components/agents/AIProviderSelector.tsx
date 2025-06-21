
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Eye, Zap } from "lucide-react";
import { AI_PROVIDERS, AIProvider } from "@/hooks/useAIProviders";

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
                  {provider.models.map((model) => (
                    <SelectItem key={model} value={model} className="pl-6">
                      <div className="flex items-center gap-2">
                        <span>{model}</span>
                        {provider.supportsVision && <Eye className="h-3 w-3 text-blue-500" />}
                      </div>
                    </SelectItem>
                  ))}
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
            <CardContent className="pt-0">
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
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIProviderSelector;

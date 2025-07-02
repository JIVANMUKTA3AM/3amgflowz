
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AgentConfiguration } from "@/hooks/useAgentConfigurations";

interface AgentSelectorProps {
  configurations: AgentConfiguration[];
  selectedAgent: string;
  onAgentChange: (agentId: string) => void;
}

const AgentSelector = ({ configurations, selectedAgent, onAgentChange }: AgentSelectorProps) => {
  const activeConfigurations = configurations.filter(config => config.is_active);

  if (activeConfigurations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum agente ativo encontrado.</p>
        <p className="text-sm">Configure pelo menos um agente para começar a conversar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Selecione um Agente</label>
      <Select value={selectedAgent} onValueChange={onAgentChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Escolha um agente para conversar" />
        </SelectTrigger>
        <SelectContent>
          {activeConfigurations.map((config) => (
            <SelectItem key={config.id} value={config.id}>
              <div className="flex items-center gap-2 w-full">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{config.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {config.model}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {config.agent_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgentSelector;

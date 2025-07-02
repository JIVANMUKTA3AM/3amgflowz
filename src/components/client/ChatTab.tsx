
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AgentChat from "@/components/agents/AgentChat";
import AgentConfigurationForm from "@/components/agents/AgentConfigurationForm";
import { useAgentConfigurations, AgentConfiguration } from "@/hooks/useAgentConfigurations";

interface ChatTabProps {
  configurations: AgentConfiguration[];
}

const ChatTab = ({ configurations }: ChatTabProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  
  const {
    createConfiguration,
    updateConfiguration,
    isCreating,
    isUpdating,
  } = useAgentConfigurations();

  const editingConfiguration = editingAgent 
    ? configurations.find(config => config.id === editingAgent)
    : undefined;

  const handleSaveAgent = (agentData: any) => {
    if (editingAgent && editingConfiguration) {
      updateConfiguration({ id: editingAgent, ...agentData });
    } else {
      createConfiguration(agentData);
    }
    setShowForm(false);
    setEditingAgent(null);
  };

  const handleCreateNew = () => {
    setEditingAgent(null);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <AgentConfigurationForm
          configuration={editingConfiguration}
          onSave={handleSaveAgent}
          onCancel={() => {
            setShowForm(false);
            setEditingAgent(null);
          }}
          isLoading={isCreating || isUpdating}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-3amg-purple">Chat com Agentes IA</CardTitle>
              <p className="text-gray-600 mt-2">
                Configure e teste seus agentes de inteligência artificial
              </p>
            </div>
            <Button 
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-3amg-purple to-3amg-blue hover:shadow-lg transition-all duration-300 gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Agente
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {configurations.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-r from-3amg-purple/20 to-3amg-blue/20 rounded-full flex items-center justify-center mb-6">
                <Plus className="w-12 h-12 text-3amg-purple" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum agente configurado
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Crie seu primeiro agente IA para começar a testar conversas e automações.
              </p>
              <Button 
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-3amg-purple to-3amg-blue hover:shadow-lg transition-all duration-300 gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Agente
              </Button>
            </div>
          ) : (
            <AgentChat configurations={configurations} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatTab;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import AgentChat from "@/components/agents/AgentChat";
import AgentConfigurationForm from "@/components/agents/AgentConfigurationForm";

const TestChat = () => {
  const navigate = useNavigate();
  const { configurations = [], createConfiguration, updateConfiguration, isLoading } = useAgentConfigurations();
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  // Se não há configurações, mostrar o formulário
  useEffect(() => {
    if (!isLoading && configurations.length === 0) {
      setShowForm(true);
    }
  }, [configurations, isLoading]);

  const handleSave = async (data: any) => {
    try {
      if (editingConfig) {
        await updateConfiguration({ ...editingConfig, ...data });
      } else {
        await createConfiguration(data);
      }
      setShowForm(false);
      setEditingConfig(null);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingConfig(null);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/onboarding')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Onboarding
            </Button>
            <h1 className="text-3xl font-bold">Configurar Agente para Teste</h1>
          </div>
          
          <AgentConfigurationForm
            configuration={editingConfig}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/onboarding')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Onboarding
            </Button>
            <h1 className="text-3xl font-bold">Teste de Chat com IA</h1>
          </div>
          
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Agente
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agentes Disponíveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {configurations.map((config) => (
                  <div
                    key={config.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      config.is_active 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => {
                      setEditingConfig(config);
                      setShowForm(true);
                    }}
                  >
                    <div className="font-medium">{config.name}</div>
                    <div className="text-sm text-gray-600">{config.model}</div>
                    <div className="text-xs text-gray-500">
                      {config.is_active ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <AgentChat configurations={configurations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestChat;

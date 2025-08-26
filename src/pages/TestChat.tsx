
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import { useAuth } from "@/contexts/AuthContext";
import AgentChat from "@/components/agents/AgentChat";
import AgentConfigurationForm from "@/components/agents/AgentConfigurationForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TestChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    configurations = [], 
    createConfiguration, 
    updateConfiguration, 
    isLoading,
    isCreating,
    isUpdating,
    error 
  } = useAgentConfigurations();
  
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  console.log('TestChat render:', {
    user: user?.id,
    configurationsCount: configurations?.length,
    isLoading,
    isCreating,
    isUpdating,
    error,
    showForm,
    editingConfig: editingConfig?.id
  });

  // Se não há configurações e não está carregando, mostrar o formulário
  useEffect(() => {
    console.log('TestChat useEffect:', { 
      isLoading, 
      configurationsLength: configurations.length,
      showForm 
    });
    
    if (!isLoading && configurations.length === 0 && !showForm) {
      console.log('No configurations found, showing form');
      setShowForm(true);
    }
  }, [configurations, isLoading, showForm]);

  const handleSave = async (data: any) => {
    try {
      console.log('TestChat handleSave:', data);
      
      if (editingConfig) {
        console.log('Updating existing configuration:', editingConfig.id);
        await updateConfiguration({ ...editingConfig, ...data });
      } else {
        console.log('Creating new configuration');
        await createConfiguration(data);
      }
      
      console.log('Save successful, closing form');
      setShowForm(false);
      setEditingConfig(null);
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    setShowForm(false);
    setEditingConfig(null);
  };

  const handleEditConfig = (config) => {
    console.log('Editing configuration:', config);
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleNewAgent = () => {
    console.log('Creating new agent');
    setEditingConfig(null);
    setShowForm(true);
  };

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você precisa estar logado para acessar esta funcionalidade.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">
              {editingConfig ? "Editar Agente" : "Configurar Agente para Teste"}
            </h1>
          </div>

          {error && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro ao carregar configurações: {error.message}
              </AlertDescription>
            </Alert>
          )}
          
          <AgentConfigurationForm
            configuration={editingConfig}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isCreating || isUpdating}
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
            onClick={handleNewAgent}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Agente
          </Button>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar configurações: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Carregando agentes...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agentes Disponíveis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {configurations.length === 0 && !isLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>Nenhum agente configurado.</p>
                    <Button 
                      onClick={handleNewAgent}
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Criar primeiro agente
                    </Button>
                  </div>
                ) : (
                  configurations.map((config) => (
                    <div
                      key={config.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-100 ${
                        config.is_active 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => handleEditConfig(config)}
                    >
                      <div className="font-medium">{config.name}</div>
                      <div className="text-sm text-gray-600">{config.model}</div>
                      <div className="text-xs text-gray-500">
                        {config.is_active ? 'Ativo' : 'Inativo'}
                      </div>
                      {config.webhook_url && (
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Webhook configurado
                        </div>
                      )}
                    </div>
                  ))
                )}
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

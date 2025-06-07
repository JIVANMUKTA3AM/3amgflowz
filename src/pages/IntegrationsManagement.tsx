
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Zap, Activity, BarChart3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntegrationForm from "@/components/integrations/IntegrationForm";
import IntegrationsList from "@/components/integrations/IntegrationsList";
import IntegrationsLogs from "@/components/integrations/IntegrationsLogs";
import { useIntegrations, Integration } from "@/hooks/useIntegrations";
import { useWorkflow } from "@/hooks/useWorkflow";

const IntegrationsManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const { createIntegration, updateIntegration, isCreating, isUpdating } = useIntegrations();
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  const handleCreateNew = () => {
    setEditingIntegration(null);
    setActiveTab("form");
  };

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration);
    setActiveTab("form");
  };

  const handleSave = (integrationData: Omit<Integration, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingIntegration) {
      updateIntegration({ 
        id: editingIntegration.id, 
        updates: integrationData 
      });
    } else {
      createIntegration(integrationData);
    }
    setActiveTab("list");
    setEditingIntegration(null);
  };

  const handleCancel = () => {
    setEditingIntegration(null);
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gerenciamento de Integrações
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conecte sua plataforma com serviços externos como n8n, Zapier, webhooks e APIs
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Integrações
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Logs
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {activeTab === "list" && (
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nova Integração
              </Button>
            )}
          </div>
          
          <TabsContent value="list" className="space-y-6">
            <IntegrationsList onEdit={handleEdit} />
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-6">
            <IntegrationsLogs />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analytics em Desenvolvimento
              </h3>
              <p className="text-gray-600">
                Métricas e relatórios de performance das integrações estarão disponíveis em breve.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="form" className="space-y-6">
            <IntegrationForm
              integration={editingIntegration || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={isCreating || isUpdating}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default IntegrationsManagement;

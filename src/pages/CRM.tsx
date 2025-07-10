import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, Activity, TrendingUp } from "lucide-react";
import { useWorkflow } from "@/hooks/useWorkflow";
import ClientsList from "@/components/crm/ClientsList";
import ClientForm from "@/components/crm/ClientForm";
import SalesPipeline from "@/components/crm/SalesPipeline";
import InteractionHistory from "@/components/crm/InteractionHistory";
import CRMMetrics from "@/components/crm/CRMMetrics";

const CRM = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                CRM - Gestão de Clientes
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus clientes, oportunidades e interações
              </p>
            </div>
            <Button onClick={() => setIsClientFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>

          {/* Métricas */}
          <CRMMetrics className="mb-8" />

          {/* Tabs */}
          <Tabs defaultValue="clients" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="interactions" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Interações
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Relatórios
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="clients" className="space-y-6">
              <ClientsList 
                onEditClient={(clientId) => {
                  setSelectedClientId(clientId);
                  setIsClientFormOpen(true);
                }}
              />
            </TabsContent>
            
            <TabsContent value="pipeline" className="space-y-6">
              <SalesPipeline />
            </TabsContent>
            
            <TabsContent value="interactions" className="space-y-6">
              <InteractionHistory />
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-muted-foreground">
                  Relatórios em desenvolvimento
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Aqui você verá relatórios detalhados de vendas e performance
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Modal de formulário */}
      <ClientForm
        isOpen={isClientFormOpen}
        onClose={() => {
          setIsClientFormOpen(false);
          setSelectedClientId(null);
        }}
        clientId={selectedClientId}
      />
    </div>
  );
};

export default CRM;
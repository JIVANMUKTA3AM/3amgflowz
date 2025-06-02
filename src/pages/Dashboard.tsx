
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflow } from "@/hooks/useWorkflow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import AgentPerformanceChart from "@/components/dashboard/AgentPerformanceChart";
import RealtimeActivity from "@/components/dashboard/RealtimeActivity";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user } = useAuth();
  const { handleWorkflowTrigger, isLoading } = useWorkflow();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dashboard de Monitoramento
          </h1>
          <p className="text-lg text-gray-600">
            Acompanhe a performance dos seus agentes em tempo real e monitore métricas importantes.
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="mb-8">
          <DashboardMetrics />
        </div>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AgentPerformanceChart />
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <RealtimeActivity />
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <AlertsPanel />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;


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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      {/* Hero Section */}
      <section className="bg-gradient-3amg text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Dashboard de Monitoramento
          </h1>
          <p className="text-xl opacity-90">
            Acompanhe a performance dos seus agentes em tempo real e monitore métricas importantes.
          </p>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8">
        {/* Métricas Principais */}
        <div className="mb-8">
          <DashboardMetrics />
        </div>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Performance
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Atividade
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Alertas
            </TabsTrigger>
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

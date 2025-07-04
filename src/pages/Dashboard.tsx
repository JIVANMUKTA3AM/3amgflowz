
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflow } from "@/hooks/useWorkflow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import AgentPerformanceChart from "@/components/dashboard/AgentPerformanceChart";
import RealtimeActivity from "@/components/dashboard/RealtimeActivity";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Webhook, BarChart3, Activity, Bell } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { handleWorkflowTrigger, isLoading } = useWorkflow();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      {/* Hero Section */}
      <section className="bg-gradient-3amg text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Dashboard Administrativo
          </h1>
          <p className="text-xl opacity-90">
            Gerencie webhooks, monitore performance e configure integrações do sistema.
          </p>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8">
        {/* Links de Acesso Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin-webhooks")}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Webhook className="h-5 w-5 text-blue-600" />
                Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Configure endpoints e monitore eventos de webhook
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/client-dashboard")}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Visão Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Acesse a interface dos provedores
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-purple-600" />
                Agentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Gerencie configurações dos agentes IA
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-orange-600" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Monitore alertas e notificações
              </p>
            </CardContent>
          </Card>
        </div>

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

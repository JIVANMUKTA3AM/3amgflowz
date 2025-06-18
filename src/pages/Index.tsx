
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, TrendingUp, Shield } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      // Se o usuário está logado, redireciona para o dashboard do cliente
      navigate("/client-dashboard");
    }
  }, [user, profile, navigate]);

  if (user) {
    return null; // Irá redirecionar
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Painel de Status Geral */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Painel de Monitoramento
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitore clientes, assinaturas e desempenho da plataforma
          </p>
        </div>

        {/* Métricas Resumidas */}
        <DashboardMetrics />

        {/* Cards de Status da Plataforma */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 novos esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agentes Online</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <p className="text-xs text-muted-foreground">
                100% disponibilidade
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 2.847</div>
              <p className="text-xs text-muted-foreground">
                +15% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Sistema</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">
                Todos os serviços funcionando
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Acesso Rápido */}
        <Card className="mt-12 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>
              Links diretos para as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/subscription")}
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">Gerenciar Assinaturas</h3>
                <p className="text-sm text-gray-600">
                  Visualize e gerencie todas as assinaturas ativas
                </p>
              </button>
              
              <button
                onClick={() => navigate("/dashboard")}
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">Dashboard Completo</h3>
                <p className="text-sm text-gray-600">
                  Acesse o painel administrativo completo
                </p>
              </button>
              
              <button
                onClick={() => navigate("/agentes")}
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">Gerenciar Agentes</h3>
                <p className="text-sm text-gray-600">
                  Configure e monitore agentes de IA
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import Footer from "@/components/Footer";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, TrendingUp, Shield, Bot, MessageSquare, BarChart3, CreditCard, Database, Webhook, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserMenu from "@/components/UserMenu";

const Index = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { role: userRole, loading: roleLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Aguardar que tanto o perfil quanto o role sejam carregados
    if (user && !profileLoading && !roleLoading) {
      console.log('User role:', userRole);
      console.log('Profile role:', profile?.role);
      console.log('Is Admin:', isAdmin);
      
      // Se é admin (baseado no email ou role), fica na página inicial
      if (isAdmin) {
        console.log('Usuário é admin, mantendo na página inicial com acesso admin');
        return; // Admin fica na página inicial com acesso completo
      }
      
      // Se é usuário regular (não admin), redireciona apenas se não for admin
      if (!isAdmin && userRole !== 'admin') {
        console.log('Redirecionando usuário regular para client dashboard');
        navigate("/client-dashboard");
      }
    }
  }, [user, profile, profileLoading, userRole, roleLoading, navigate, isAdmin]);

  // Se está carregando, mostra loading
  if (profileLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está logado, mostra página de apresentação
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
        {/* Header para visitantes */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                <span className="font-bold text-xl text-gray-900">AgentFlow</span>
              </Link>

              <div className="flex items-center space-x-4">
                <Link to="/auth">
                  <Button>Entrar</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Automação Inteligente para Provedores
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Transforme seu atendimento com nossos agentes de IA especializados
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Começar Agora
              </Button>
            </Link>
          </div>

          {/* Cards de recursos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Atendimento Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Agente especializado em atendimento ao cliente, suporte e informações gerais
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Suporte Técnico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Resolução de problemas técnicos, configurações e troubleshooting especializado
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Agente comercial para vendas, consultas de planos e conversão de leads
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Se é admin logado, mostra painel administrativo
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="font-bold text-xl text-gray-900">AgentFlow</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-green-600 font-medium">
                Modo Admin Ativo - Dashboard dos Provedores
              </div>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Painel Administrativo - Gestão de Provedores
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Monitore clientes provedores, suas assinaturas e desempenho da plataforma
          </p>
        </div>

        <DashboardMetrics />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Provedores Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 novos provedores esta semana
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

        <Card className="mt-12 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Acesso Rápido - Funcionalidades Principais</CardTitle>
            <CardDescription>
              Links diretos para as principais funcionalidades administrativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin-webhooks"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow bg-blue-50 border-blue-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">🚀 Testar Agentes</h3>
                </div>
                <p className="text-sm text-blue-600">
                  Configure e teste agentes com webhooks
                </p>
              </Link>
              
              <Link
                to="/dashboard"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow bg-purple-50 border-purple-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Dashboard Completo</h3>
                </div>
                <p className="text-sm text-purple-600">
                  Acesse o painel administrativo completo
                </p>
              </Link>

              <Link
                to="/client-dashboard"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow bg-green-50 border-green-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Visão do Cliente</h3>
                </div>
                <p className="text-sm text-green-600">
                  Acesse a interface do cliente para testes
                </p>
              </Link>

              <Link
                to="/agentes"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Bot className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold">Gerenciar Agentes</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Configure e monitore agentes de IA
                </p>
              </Link>

              <Link
                to="/integracoes"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Webhook className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold">Integrações</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Conecte com CRM, WhatsApp e outros serviços
                </p>
              </Link>

              <Link
                to="/fluxos"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-5 w-5 text-teal-600" />
                  <h3 className="font-semibold">Fluxos & Automações</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Configure workflows e automações
                </p>
              </Link>

              <Link
                to="/database-management"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold">Banco de Dados</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Gerenciar dados e configurações do sistema
                </p>
              </Link>

              <Link
                to="/test-chat"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                  <h3 className="font-semibold">Chat de Teste</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Teste conversas com os agentes
                </p>
              </Link>

              <Link
                to="/subscription-management"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold">Assinaturas</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Gerenciar planos e cobranças
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Documentação e Configurações Avançadas</CardTitle>
            <CardDescription>
              Acesse documentação técnica e configurações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/documentacao"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow bg-gray-50"
              >
                <h3 className="font-semibold mb-2">📚 Documentação</h3>
                <p className="text-sm text-gray-600">
                  Guias e documentação técnica
                </p>
              </Link>

              <Link
                to="/arquitetura"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow bg-gray-50"
              >
                <h3 className="font-semibold mb-2">🏗️ Arquitetura</h3>
                <p className="text-sm text-gray-600">
                  Visão geral da arquitetura do sistema
                </p>
              </Link>

              <Link
                to="/modelo-dados"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow bg-gray-50"
              >
                <h3 className="font-semibold mb-2">🗃️ Modelo de Dados</h3>
                <p className="text-sm text-gray-600">
                  Estrutura do banco de dados
                </p>
              </Link>

              <Link
                to="/n8n-management"
                className="p-4 text-left border rounded-lg hover:shadow-md transition-shadow bg-gray-50"
              >
                <h3 className="font-semibold mb-2">⚙️ N8N Management</h3>
                <p className="text-sm text-gray-600">
                  Gerenciar automações N8N
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

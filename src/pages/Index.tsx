import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import Footer from "@/components/Footer";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, TrendingUp, Shield, Bot, MessageSquare, BarChart3, CreditCard, Database, Webhook, Zap, DollarSign, Radio, Network, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import UserMenu from "@/components/UserMenu";

// 3AMG Components
import HeroSection from "@/components/3amg/HeroSection";
import LayersSection from "@/components/3amg/LayersSection";
import ServicesSection from "@/components/3amg/ServicesSection";
import AboutSection from "@/components/3amg/AboutSection";
import TechSection from "@/components/3amg/TechSection";
import CTASection from "@/components/3amg/CTASection";
import LoginButton from "@/components/3amg/LoginButton";

const Index = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const { role: userRole, loading: roleLoading, isAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !profileLoading && !roleLoading) {
      console.log('User role:', userRole);
      console.log('Profile role:', profile?.role);
      console.log('Is Admin:', isAdmin);
      
      if (isAdmin) {
        console.log('Usuário é admin, mantendo na página inicial com acesso admin');
        return;
      }
      
      if (!isAdmin && userRole !== 'admin') {
        console.log('Redirecionando usuário regular para client dashboard');
        navigate("/client-dashboard");
      }
    }
  }, [user, profile, profileLoading, userRole, roleLoading, navigate, isAdmin]);

  if (profileLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-3amg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-3amg-orange mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0D1B3E] via-[#1A1F3A] to-[#0D1B3E]">
        <LoginButton />
        
        <main>
          <HeroSection />
          <LayersSection />
          <ServicesSection />
          <AboutSection />
          <TechSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-3amg-dark">
      <header className="bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 relative">
                <img 
                  src="/lovable-uploads/71a5762a-fd4e-406c-bf7c-1e3df758cc53.png" 
                  alt="3AMG Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-xl bg-gradient-3amg bg-clip-text text-transparent">3AMG</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-3amg-orange font-medium">
                Modo Admin Ativo - Dashboard dos Provedores
              </div>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Painel Administrativo - Gestão de Provedores
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Monitore clientes provedores, suas assinaturas e desempenho da plataforma
          </p>
        </div>

        <DashboardMetrics />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Provedores Ativos</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-3amg-orange">12</div>
              <p className="text-xs text-gray-400">
                +2 novos provedores esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Agentes Online</CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-3amg-purple">34</div>
              <p className="text-xs text-gray-400">
                100% disponibilidade
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Receita Mensal</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">R$ 2.847</div>
              <p className="text-xs text-gray-400">
                +15% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Status Sistema</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Online</div>
              <p className="text-xs text-gray-400">
                Todos os serviços funcionando
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12 border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Acesso Rápido - Funcionalidades Principais</CardTitle>
            <CardDescription className="text-gray-300">
              Links diretos para as principais funcionalidades administrativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin-webhooks"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-3amg-orange/10 to-3amg-orange/5 hover:from-3amg-orange/20 hover:to-3amg-orange/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-3amg-orange" />
                  <h3 className="font-semibold text-3amg-orange">🚀 Testar Agentes</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Configure e teste agentes com webhooks
                </p>
              </Link>
              
              <Link
                to="/dashboard"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-3amg-purple/10 to-3amg-purple/5 hover:from-3amg-purple/20 hover:to-3amg-purple/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-5 w-5 text-3amg-purple" />
                  <h3 className="font-semibold text-3amg-purple">Dashboard Completo</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Acesse o painel administrativo completo
                </p>
              </Link>

              <Link
                to="/client-dashboard"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-green-900/10 to-green-900/5 hover:from-green-900/20 hover:to-green-900/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-green-400" />
                  <h3 className="font-semibold text-green-400">Visão do Cliente</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Acesse a interface do cliente para testes
                </p>
              </Link>

              <Link
                to="/agentes"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Bot className="h-5 w-5 text-3amg-orange" />
                  <h3 className="font-semibold text-white">Gerenciar Agentes</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Configure e monitore agentes de IA
                </p>
              </Link>

              <Link
                to="/integracoes"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Webhook className="h-5 w-5 text-3amg-purple" />
                  <h3 className="font-semibold text-white">Integrações</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Conecte com CRM, WhatsApp e outros serviços
                </p>
              </Link>

              <Link
                to="/fluxos"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-white">Fluxos & Automações</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Configure workflows e automações
                </p>
              </Link>

              <Link
                to="/database-management"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-red-400" />
                  <h3 className="font-semibold text-white">Banco de Dados</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Gerenciar dados e configurações do sistema
                </p>
              </Link>

              <Link
                to="/test-chat"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="h-5 w-5 text-pink-400" />
                  <h3 className="font-semibold text-white">Chat de Teste</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Teste conversas com os agentes
                </p>
              </Link>

              <Link
                to="/subscription-management"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-yellow-400" />
                  <h3 className="font-semibold text-white">Assinaturas</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Gerenciar planos e cobranças
                </p>
              </Link>

              <Link
                to="/gestao-comercial"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <h3 className="font-semibold text-white">Gestão Comercial</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Gerencie planos de internet para provedores B2B
                </p>
              </Link>

              <Link
                to="/dashboard-olt"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-blue-900/10 to-blue-900/5 hover:from-blue-900/20 hover:to-blue-900/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Radio className="h-5 w-5 text-blue-400" />
                  <h3 className="font-semibold text-blue-400">Monitoramento OLT</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Dashboard de monitoramento de OLTs e ONTs
                </p>
              </Link>

              <Link
                to="/monitoramento-snmp"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-cyan-900/10 to-cyan-900/5 hover:from-cyan-900/20 hover:to-cyan-900/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Network className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-semibold text-cyan-400">Console SNMP</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Operações e monitoramento SNMP em tempo real
                </p>
              </Link>

              <Link
                to="/webhook-testing"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-purple-900/10 to-purple-900/5 hover:from-purple-900/20 hover:to-purple-900/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <TestTube className="h-5 w-5 text-purple-400" />
                  <h3 className="font-semibold text-purple-400">Testes de Webhooks</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Teste e valide webhooks com payloads personalizados
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 border-0 shadow-lg bg-gray-900/80 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Documentação e Configurações Avançadas</CardTitle>
            <CardDescription className="text-gray-300">
              Acesse documentação técnica e configurações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/documentacao"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <h3 className="font-semibold mb-2 text-white">📚 Documentação</h3>
                <p className="text-sm text-gray-300">
                  Guias e documentação técnica
                </p>
              </Link>

              <Link
                to="/arquitetura"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <h3 className="font-semibold mb-2 text-white">🏗️ Arquitetura</h3>
                <p className="text-sm text-gray-300">
                  Visão geral da arquitetura do sistema
                </p>
              </Link>

              <Link
                to="/modelo-dados"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <h3 className="font-semibold mb-2 text-white">🗃️ Modelo de Dados</h3>
                <p className="text-sm text-gray-300">
                  Estrutura do banco de dados
                </p>
              </Link>

              <Link
                to="/n8n-management"
                className="p-4 text-left border border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-gray-800/50 hover:bg-gray-800/70"
              >
                <h3 className="font-semibold mb-2 text-white">⚙️ N8N Management</h3>
                <p className="text-sm text-gray-300">
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

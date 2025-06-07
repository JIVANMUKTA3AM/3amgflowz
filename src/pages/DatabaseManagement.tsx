
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Database, Shield, Zap, Archive } from "lucide-react";
import DatabaseHealthCheck from "@/components/database/DatabaseHealthCheck";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";

const DatabaseManagement = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  const databaseFeatures = [
    {
      icon: Database,
      title: "Estrutura Otimizada",
      description: "Tabelas normalizadas com relacionamentos bem definidos",
      status: "Ativo",
      details: [
        "Tabelas de usuários, organizações e assinaturas",
        "Relacionamentos com integridade referencial",
        "Campos JSONB para flexibilidade",
        "Timestamps automáticos"
      ]
    },
    {
      icon: Shield,
      title: "Segurança RLS",
      description: "Row-Level Security para proteção de dados",
      status: "Configurado",
      details: [
        "Políticas por usuário e organização",
        "Isolamento completo de dados",
        "Permissões granulares",
        "Funções de segurança"
      ]
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Índices estratégicos para consultas rápidas",
      status: "Otimizado",
      details: [
        "Índices em chaves estrangeiras",
        "Índices compostos para queries complexas",
        "Índices em campos de busca",
        "Monitoramento de performance"
      ]
    },
    {
      icon: Archive,
      title: "Backup & Recovery",
      description: "Sistema automatizado de backup e recuperação",
      status: "Ativo",
      details: [
        "Backups automáticos diários",
        "Point-in-time recovery",
        "Verificação de integridade",
        "Testes de restauração"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      "Ativo": "bg-green-500",
      "Configurado": "bg-blue-500", 
      "Otimizado": "bg-purple-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gerenciamento do Banco de Dados
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estrutura robusta, segura e otimizada para alta performance
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="health">Status & Saúde</TabsTrigger>
            <TabsTrigger value="structure">Estrutura</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {databaseFeatures.map((feature, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                    <ul className="text-xs space-y-1">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="health">
            <DatabaseHealthCheck />
          </TabsContent>
          
          <TabsContent value="structure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estrutura das Tabelas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "profiles", description: "Perfis de usuário", records: "Dinâmico" },
                    { name: "organizations", description: "Organizações", records: "Dinâmico" },
                    { name: "memberships", description: "Membros das organizações", records: "Dinâmico" },
                    { name: "subscriptions", description: "Assinaturas ativas", records: "Dinâmico" },
                    { name: "subscription_plans", description: "Planos disponíveis", records: "4 planos" },
                    { name: "subscription_history", description: "Histórico de mudanças", records: "Dinâmico" },
                    { name: "agents", description: "Tipos de agentes", records: "6 tipos" },
                    { name: "user_agents", description: "Agentes dos usuários", records: "Dinâmico" },
                    { name: "invoices", description: "Faturas e pagamentos", records: "Dinâmico" }
                  ].map((table, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{table.name}</h3>
                      <p className="text-sm text-gray-600">{table.description}</p>
                      <Badge variant="outline" className="mt-2">{table.records}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Políticas de Segurança (RLS)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      table: "profiles",
                      policies: ["Usuários veem apenas seu próprio perfil", "Apenas o próprio usuário pode atualizar"]
                    },
                    {
                      table: "organizations", 
                      policies: ["Usuários veem organizações que pertencem", "Apenas proprietários podem alterar"]
                    },
                    {
                      table: "subscriptions",
                      policies: ["Usuários veem apenas suas assinaturas", "Service role tem acesso total"]
                    },
                    {
                      table: "invoices",
                      policies: ["Usuários veem apenas suas faturas", "Admins de org podem ver faturas da org"]
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">{item.table}</h3>
                      <ul className="space-y-1">
                        {item.policies.map((policy, idx) => (
                          <li key={idx} className="text-sm flex items-center">
                            <Shield className="w-3 h-3 mr-2 text-green-600" />
                            {policy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default DatabaseManagement;

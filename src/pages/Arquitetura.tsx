
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Database, Zap, Globe, Webhook, Code, GitBranch, Cloud, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";

const Arquitetura = () => {
  const { handleWorkflowTrigger, isLoading } = useWorkflow();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const architectureComponents = [
    {
      id: 'frontend',
      title: 'Aplicação Web (React)',
      description: 'Interface moderna e responsiva construída com React, TypeScript e Tailwind CSS',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-3amg-purple',
      details: [
        'React 18 com hooks modernos',
        'TypeScript para type safety',
        'Tailwind CSS para styling',
        'Componentes reutilizáveis com shadcn/ui',
        'Roteamento com React Router'
      ]
    },
    {
      id: 'n8n',
      title: 'Motor n8n',
      description: 'Plataforma de automação que orquestra todos os workflows e integrações',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-3amg-blue',
      details: [
        'Workflows visuais drag-and-drop',
        'Centenas de integrações pré-construídas',
        'Execução de código personalizado',
        'Webhooks para eventos em tempo real',
        'Agendamento de tarefas'
      ]
    },
    {
      id: 'database',
      title: 'Banco de Dados',
      description: 'PostgreSQL robusto com Supabase para dados seguros e escaláveis',
      icon: <Database className="h-6 w-6" />,
      color: 'bg-3amg-indigo',
      details: [
        'PostgreSQL como base de dados',
        'Supabase para funcionalidades backend',
        'Row Level Security (RLS)',
        'Real-time subscriptions',
        'Backup automático'
      ]
    },
    {
      id: 'api',
      title: 'APIs RESTful',
      description: 'Endpoints seguros para comunicação entre serviços e sistemas externos',
      icon: <Code className="h-6 w-6" />,
      color: 'bg-gradient-to-r from-3amg-purple to-3amg-blue',
      details: [
        'Autenticação JWT',
        'Rate limiting',
        'Documentação OpenAPI',
        'Versionamento de API',
        'Logs e monitoramento'
      ]
    },
    {
      id: 'webhooks',
      title: 'Sistema de Webhooks',
      description: 'Comunicação em tempo real baseada em eventos para integrações seamless',
      icon: <Webhook className="h-6 w-6" />,
      color: 'bg-gradient-to-r from-3amg-blue to-3amg-indigo',
      details: [
        'Eventos em tempo real',
        'Retry automático em falhas',
        'Assinatura de eventos',
        'Logs de delivery',
        'Validação de payload'
      ]
    },
    {
      id: 'integrations',
      title: 'Integrações Externas',
      description: 'Conectores para Google Sheets, CRM, Slack e centenas de outras plataformas',
      icon: <GitBranch className="h-6 w-6" />,
      color: 'bg-gradient-to-r from-3amg-indigo to-3amg-purple',
      details: [
        'Google Workspace integração',
        'Slack notifications',
        'CRM synchronization',
        'Payment gateways',
        'Social media platforms'
      ]
    }
  ];

  const dataFlow = [
    { step: 1, title: 'Trigger de Evento', description: 'Webhook, timer ou ação do usuário inicia o fluxo' },
    { step: 2, title: 'Processamento n8n', description: 'Motor executa o workflow definido com transformações' },
    { step: 3, title: 'Integração Externa', description: 'Comunicação com APIs de terceiros conforme necessário' },
    { step: 4, title: 'Persistência', description: 'Dados processados são salvos no banco PostgreSQL' },
    { step: 5, title: 'Notificação', description: 'Usuários e sistemas são notificados do resultado' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      {/* Hero Section */}
      <section className="bg-gradient-3amg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-10 w-10" />
            <h1 className="text-4xl font-bold">
              Arquitetura do Sistema
            </h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Uma arquitetura moderna, escalável e segura projetada para automatizar 
            seus fluxos de trabalho com máxima eficiência.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="components" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Componentes
            </TabsTrigger>
            <TabsTrigger value="dataflow" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Fluxo de Dados
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {/* Architecture Diagram */}
            <Card className="mb-8 bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Cloud className="h-8 w-8 mr-3 text-3amg-purple" />
                  Diagrama da Arquitetura
                </CardTitle>
                <CardDescription>
                  Visualização interativa dos componentes e suas conexões
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
{`┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│                 │    │              │    │                 │    │              │
│   React App     │───▶│  n8n Server  │───▶│   PostgreSQL    │───▶│   External   │
│   (Frontend)    │    │  (Workflows) │    │   (Database)    │    │   Services   │
│                 │    │              │    │                 │    │              │
└─────────────────┘    └──────────────┘    └─────────────────┘    └──────────────┘
         │                      │                   │                     │
         ▼                      ▼                   ▼                     ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│                 │    │              │    │                 │    │              │
│   REST APIs     │◀──▶│   Webhooks   │───▶│   AI Agents     │───▶│ Notifications│
│   (Gateway)     │    │   (Events)   │    │   (Processing)  │    │   (Alerts)   │
│                 │    │              │    │                 │    │              │
└─────────────────┘    └──────────────┘    └─────────────────┘    └──────────────┘`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white border-l-4 border-l-3amg-purple shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-3amg-purple">99.9%</p>
                      <p className="text-gray-600">Uptime Garantido</p>
                    </div>
                    <Shield className="h-8 w-8 text-3amg-purple opacity-70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-l-4 border-l-3amg-blue shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-3amg-blue">100+</p>
                      <p className="text-gray-600">Integrações</p>
                    </div>
                    <GitBranch className="h-8 w-8 text-3amg-blue opacity-70" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-l-4 border-l-3amg-indigo shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-3amg-indigo">&lt; 100ms</p>
                      <p className="text-gray-600">Latência Média</p>
                    </div>
                    <Zap className="h-8 w-8 text-3amg-indigo opacity-70" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="components" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Componentes da Arquitetura</h3>
                {architectureComponents.map((component) => (
                  <Card 
                    key={component.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedComponent === component.id ? 'ring-2 ring-3amg-purple shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedComponent(selectedComponent === component.id ? null : component.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 ${component.color} rounded-lg text-white`}>
                            {component.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{component.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {component.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-3amg-purple border-3amg-purple">
                          {selectedComponent === component.id ? 'Expandido' : 'Expandir'}
                        </Badge>
                      </div>
                    </CardHeader>
                    {selectedComponent === component.id && (
                      <CardContent className="pt-0">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Funcionalidades:</h4>
                          <ul className="space-y-1">
                            {component.details.map((detail, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start">
                                <span className="text-3amg-purple mr-2">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
              
              <div className="lg:sticky lg:top-8">
                <Card className="bg-gradient-3amg text-white border-0">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Tecnologias Utilizadas</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <strong>Frontend</strong>
                        <br />React, TypeScript, Tailwind
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        <strong>Backend</strong>
                        <br />n8n, Node.js, Supabase
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        <strong>Database</strong>
                        <br />PostgreSQL, Redis
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        <strong>Cloud</strong>
                        <br />AWS, Docker, Kubernetes
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dataflow" className="mt-6">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                <CardTitle className="text-2xl text-gray-900">Fluxo de Dados</CardTitle>
                <CardDescription>
                  Acompanhe como os dados fluem através do sistema desde o trigger inicial até a entrega final
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {dataFlow.map((flow, index) => (
                    <div key={flow.step} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-3amg rounded-full flex items-center justify-center text-white font-bold">
                          {flow.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">{flow.title}</h4>
                        <p className="text-gray-600">{flow.description}</p>
                      </div>
                      {index < dataFlow.length - 1 && (
                        <div className="flex-shrink-0">
                          <ArrowRight className="h-6 w-6 text-3amg-purple" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center border-3amg-purple text-3amg-purple hover:bg-3amg-purple hover:text-white">
              <ArrowLeft size={16} className="mr-2" /> Página Inicial
            </Button>
          </Link>
          <Link to="/modelo-dados">
            <Button className="flex items-center bg-gradient-3amg hover:bg-gradient-3amg-light text-white">
              Modelo de Dados <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Arquitetura;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Webhook, ExternalLink, Settings, Database, Cloud, Zap, MessageCircle, Router } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Link } from "react-router-dom";

const Integracoes = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  const integrations = [
    {
      id: 1,
      name: "Webhook de Recebimento",
      description: "Configure onde você quer receber as respostas dos agentes IA",
      icon: Webhook,
      status: "available",
      type: "webhook",
      route: "/webhook"
    },
    {
      id: 2,
      name: "WhatsApp Business API",
      description: "Integração com WhatsApp para atendimento via chat",
      icon: MessageCircle,
      status: "available",
      type: "chat",
      route: "/whatsapp-config"
    },
    {
      id: 3,
      name: "APIs de OLT",
      description: "Conecte com diferentes marcas de OLT (VSol, Datacom, etc.) para automação",
      icon: Router,
      status: "available",
      type: "olt",
      route: "/olt-config"
    },
    {
      id: 4,
      name: "CRM Pipedrive",
      description: "Sincronização automática de leads e tickets com Pipedrive",
      icon: Database,
      status: "available",
      type: "crm",
      route: "/pipedrive-config"
    },
    {
      id: 5,
      name: "CRM RD Station",
      description: "Integração com RD Station para automação de marketing e vendas",
      icon: Database,
      status: "available",
      type: "crm",
      route: "/rdstation-config"
    },
    {
      id: 6,
      name: "Slack",
      description: "Notificações de tickets e alertas em tempo real",
      icon: Cloud,
      status: "available",
      type: "notification",
      route: "/slack-config"
    },
    {
      id: 7,
      name: "Sistema de Billing",
      description: "Integração com sistemas de cobrança e faturamento",
      icon: Zap,
      status: "available",
      type: "billing",
      route: "/billing-config"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "available":
        return "bg-blue-100 text-blue-800";
      case "coming_soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "available":
        return "Disponível";
      case "coming_soon":
        return "Em breve";
      default:
        return "Indisponível";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Integrações Disponíveis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conecte seus agentes IA com suas ferramentas favoritas e automatize 
              completamente o fluxo de atendimento ao cliente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <integration.icon className="h-8 w-8 text-blue-600 mb-2" />
                    <Badge className={getStatusColor(integration.status)}>
                      {getStatusText(integration.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {integration.status === "available" && integration.route ? (
                      <Link to={integration.route}>
                        <Button className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                      </Link>
                    ) : integration.status === "active" ? (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Gerenciar
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver logs
                        </Button>
                      </div>
                    ) : (
                      <Button disabled className="w-full">
                        Em desenvolvimento
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Precisa de uma integração específica?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Nossa equipe pode desenvolver integrações customizadas para suas necessidades específicas. 
                Entre em contato e vamos conversar sobre sua solução.
              </p>
              <Button size="lg" className="bg-gradient-3amg hover:opacity-90">
                Solicitar Integração Custom
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Integracoes;

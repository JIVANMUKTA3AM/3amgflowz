import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Play, FileText, Zap, Database, Mail, Webhook } from "lucide-react";

const Fluxos = () => {
  const { handleWorkflowTrigger, triggerWorkflowWithParams, isLoading } = useWorkflow();
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const workflowExamples = [
    {
      id: 'processamento-dados',
      title: 'Processamento de Dados',
      description: 'Automatiza a coleta, transformação e carregamento de dados entre sistemas.',
      category: 'ETL',
      icon: <Database className="h-6 w-6" />,
      difficulty: 'Intermediário',
      estimatedTime: '5-10 min',
      code: `// Fluxo n8n para Processamento de Dados
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "webhookId": "processamento-dados"
    },
    {
      "name": "Transform Data",
      "type": "n8n-nodes-base.function",
      "position": [460, 300],
      "parameters": {
        "functionCode": "// Transformar dados recebidos\\nconst data = items[0].json;\\nconst transformed = {\\n  id: data.id,\\n  name: data.name?.toUpperCase(),\\n  email: data.email?.toLowerCase(),\\n  created_at: new Date().toISOString()\\n};\\nreturn [{ json: transformed }];"
      }
    },
    {
      "name": "Save to Database",
      "type": "n8n-nodes-base.postgres",
      "position": [680, 300],
      "parameters": {
        "operation": "insert",
        "table": "processed_data"
      }
    }
  ]
}`,
      workflowType: 'processamento_dados'
    },
    {
      id: 'notificacoes',
      title: 'Sistema de Notificações',
      description: 'Envia notificações automatizadas por e-mail, SMS e webhooks baseadas em eventos.',
      category: 'Comunicação',
      icon: <Mail className="h-6 w-6" />,
      difficulty: 'Básico',
      estimatedTime: '3-5 min',
      code: `// Fluxo n8n para Sistema de Notificações
{
  "nodes": [
    {
      "name": "Event Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "webhookId": "notification-trigger"
    },
    {
      "name": "Check Event Type",
      "type": "n8n-nodes-base.switch",
      "position": [460, 300],
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.event_type}}",
              "operation": "equal",
              "value2": "user_registered"
            }
          ]
        }
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.gmail",
      "position": [680, 200],
      "parameters": {
        "operation": "send",
        "subject": "Bem-vindo ao 3AMG!",
        "message": "Obrigado por se registrar em nossa plataforma."
      }
    },
    {
      "name": "Send Slack Alert",
      "type": "n8n-nodes-base.slack",
      "position": [680, 400],
      "parameters": {
        "operation": "postMessage",
        "channel": "#notifications",
        "text": "Novo usuário registrado: {{$json.user_name}}"
      }
    }
  ]
}`,
      workflowType: 'notificacao'
    },
    {
      id: 'integracao-apis',
      title: 'Integração com APIs',
      description: 'Conecta serviços externos para sincronização de dados e automação de processos.',
      category: 'Integração',
      icon: <Webhook className="h-6 w-6" />,
      difficulty: 'Avançado',
      estimatedTime: '10-15 min',
      code: `// Fluxo n8n para Integração com APIs
{
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.cron",
      "position": [240, 300],
      "parameters": {
        "triggerTimes": {
          "hour": 9,
          "minute": 0
        }
      }
    },
    {
      "name": "Fetch CRM Data",
      "type": "n8n-nodes-base.httpRequest",
      "position": [460, 300],
      "parameters": {
        "url": "https://api.crm.com/contacts",
        "authentication": "genericCredentialType",
        "method": "GET"
      }
    },
    {
      "name": "Update Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "position": [680, 200],
      "parameters": {
        "operation": "update",
        "sheetId": "your-sheet-id",
        "range": "A:E"
      }
    },
    {
      "name": "Log Activity",
      "type": "n8n-nodes-base.function",
      "position": [680, 400],
      "parameters": {
        "functionCode": "console.log('Sincronização CRM concluída:', new Date());"
      }
    }
  ]
}`,
      workflowType: 'integracao'
    }
  ];

  const toggleCode = (id: string) => {
    setActiveCode(activeCode === id ? null : id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      {/* Hero Section */}
      <section className="bg-gradient-3amg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-10 w-10" />
            <h1 className="text-4xl font-bold">
              Fluxos de Automação n8n
            </h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Explore exemplos de fluxos de trabalho automatizados para integração, processamento de dados e notificações. 
            Execute diretamente ou use como base para seus próprios fluxos.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-l-4 border-l-3amg-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-3amg-purple">3</p>
                  <p className="text-gray-600">Fluxos Disponíveis</p>
                </div>
                <FileText className="h-8 w-8 text-3amg-purple opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-3amg-blue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-3amg-blue">15 min</p>
                  <p className="text-gray-600">Tempo Médio</p>
                </div>
                <Zap className="h-8 w-8 text-3amg-blue opacity-70" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-3amg-indigo">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-3amg-indigo">100%</p>
                  <p className="text-gray-600">Automatizado</p>
                </div>
                <Database className="h-8 w-8 text-3amg-indigo opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Examples */}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Exemplos de Fluxos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cada fluxo inclui código n8n pronto para uso, documentação e opção de execução direta.
            </p>
          </div>

          {workflowExamples.map((workflow) => (
            <Card key={workflow.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-3amg rounded-lg text-white">
                      {workflow.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{workflow.title}</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {workflow.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="outline" className="text-3amg-purple border-3amg-purple">
                      {workflow.category}
                    </Badge>
                    <Badge className={getDifficultyColor(workflow.difficulty)}>
                      {workflow.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>⏱️ {workflow.estimatedTime}</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCode(workflow.id)}
                      className="border-3amg-purple text-3amg-purple hover:bg-3amg-purple hover:text-white"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      {activeCode === workflow.id ? 'Ocultar Código' : 'Ver Código'}
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => triggerWorkflowWithParams(workflow.workflowType)}
                      disabled={isLoading}
                      className="bg-gradient-3amg hover:bg-gradient-3amg-light text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isLoading ? 'Executando...' : 'Executar'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {activeCode === workflow.id && (
                <CardContent className="p-0">
                  <div className="bg-gray-900 text-green-400 p-6 overflow-x-auto">
                    <pre className="text-sm">
                      <code>{workflow.code}</code>
                    </pre>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-3amg text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Precisa de um Fluxo Customizado?</h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Nossa equipe pode criar fluxos n8n personalizados para suas necessidades específicas.
              Entre em contato para uma consultoria gratuita.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-3amg-purple hover:bg-gray-100 font-semibold"
            >
              Solicitar Consultoria
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Fluxos;

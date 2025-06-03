
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Code, Settings, Zap, Search, Download, ExternalLink, Copy, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";

const Documentacao = () => {
  const { handleWorkflowTrigger, isLoading } = useWorkflow();
  const [activeSection, setActiveSection] = useState('fluxos');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const workflowExamples = [
    {
      id: 'data-processing',
      title: 'Processamento de Dados',
      description: 'Workflow completo para ETL de dados',
      difficulty: 'Intermediário',
      code: `{
  "name": "Processamento de Dados Avançado",
  "active": true,
  "nodes": [
    {
      "name": "Data Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "process-data",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Validate Data",
      "type": "n8n-nodes-base.function",
      "position": [460, 300],
      "parameters": {
        "functionCode": "// Validação avançada de dados\\nconst requiredFields = ['id', 'name', 'email'];\\nconst data = items[0].json;\\n\\nfor (const field of requiredFields) {\\n  if (!data[field]) {\\n    throw new Error(\`Campo obrigatório ausente: \${field}\`);\\n  }\\n}\\n\\nreturn [{\\n  json: {\\n    ...data,\\n    validated: true,\\n    timestamp: new Date().toISOString()\\n  }\\n}];"
        }
    }
  ]
}`
    },
    {
      id: 'notification-system',
      title: 'Sistema de Notificações',
      description: 'Multi-canal de notificações automáticas',
      difficulty: 'Básico',
      code: `{
  "name": "Sistema de Notificações Multi-Canal",
  "active": true,
  "nodes": [
    {
      "name": "Event Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "notify-event"
      }
    },
    {
      "name": "Route by Priority",
      "type": "n8n-nodes-base.switch",
      "position": [460, 300],
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.priority}}",
              "operation": "equal",
              "value2": "high"
            },
            {
              "value1": "={{$json.priority}}",
              "operation": "equal", 
              "value2": "medium"
            }
          ]
        }
      }
    }
  ]
}`
    }
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/workflows',
      description: 'Lista todos os workflows disponíveis',
      example: `curl -X GET "https://api.3amg.com/v1/workflows" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`
    },
    {
      method: 'POST',
      endpoint: '/api/v1/executions',
      description: 'Inicia uma nova execução de workflow',
      example: `curl -X POST "https://api.3amg.com/v1/executions" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflow_id": "uuid-here",
    "data": {"customer_id": "12345"}
  }'`
    }
  ];

  const configExamples = [
    {
      title: 'Variáveis de Ambiente',
      code: `# Configuração Principal do n8n
N8N_PORT=5678
N8N_PROTOCOL=https
N8N_HOST=n8n.3amg.com
N8N_ENCRYPTION_KEY=your-secure-key-here

# Database Configuration
N8N_DB_TYPE=postgresdb
N8N_DB_POSTGRESDB_HOST=db.3amg.com
N8N_DB_POSTGRESDB_PORT=5432
N8N_DB_POSTGRESDB_DATABASE=n8n_prod
N8N_DB_POSTGRESDB_USER=n8n_user
N8N_DB_POSTGRESDB_PASSWORD=secure-password

# Email Configuration
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.gmail.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=notifications@3amg.com
N8N_SMTP_PASS=app-specific-password`
    },
    {
      title: 'Docker Compose',
      code: `version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=secure-password
      - N8N_HOST=n8n.3amg.com
      - N8N_PROTOCOL=https
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres
      
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=secure-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
volumes:
  n8n_data:
  postgres_data:`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      {/* Hero Section */}
      <section className="bg-gradient-3amg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-10 w-10" />
            <h1 className="text-4xl font-bold">
              Documentação Completa
            </h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Guias detalhados, exemplos práticos e referência completa da API 
            para maximizar o potencial da plataforma 3AMG.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Navigation */}
        <Card className="mb-8 bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-gray-900">
              <Search className="h-6 w-6 mr-2 text-3amg-purple" />
              Navegação Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('fluxos')}
                className={`flex items-center justify-center p-4 h-auto ${activeSection === 'fluxos' ? 'bg-3amg-purple text-white' : 'hover:bg-purple-50'}`}
              >
                <Zap className="h-5 w-5 mr-2" />
                Workflows
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('config')}
                className={`flex items-center justify-center p-4 h-auto ${activeSection === 'config' ? 'bg-3amg-purple text-white' : 'hover:bg-purple-50'}`}
              >
                <Settings className="h-5 w-5 mr-2" />
                Configuração
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('api')}
                className={`flex items-center justify-center p-4 h-auto ${activeSection === 'api' ? 'bg-3amg-purple text-white' : 'hover:bg-purple-50'}`}
              >
                <Code className="h-5 w-5 mr-2" />
                API Reference
              </Button>
              <Button 
                variant="outline"
                className="flex items-center justify-center p-4 h-auto hover:bg-purple-50"
              >
                <Download className="h-5 w-5 mr-2" />
                Downloads
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="fluxos" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Workflows & Fluxos
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              Configuração
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-gradient-3amg data-[state=active]:text-white">
              API Reference
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fluxos" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                  <CardTitle className="text-2xl text-gray-900">Exemplos de Workflows</CardTitle>
                  <CardDescription>
                    Workflows prontos para usar e customizar conforme suas necessidades
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {workflowExamples.map((workflow, index) => (
                    <div key={workflow.id} className={`p-6 ${index !== workflowExamples.length - 1 ? 'border-b' : ''}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{workflow.title}</h3>
                          <p className="text-gray-600 mb-3">{workflow.description}</p>
                          <Badge variant="outline" className="text-3amg-purple border-3amg-purple">
                            {workflow.difficulty}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(workflow.code, workflow.id)}
                          className="border-3amg-purple text-3amg-purple hover:bg-3amg-purple hover:text-white"
                        >
                          {copiedCode === workflow.id ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copiar
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="bg-gray-900 rounded-lg overflow-x-auto">
                        <pre className="text-green-400 text-sm p-4">
                          <code>{workflow.code}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <div className="space-y-6">
              {configExamples.map((config, index) => (
                <Card key={index} className="bg-white shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xl text-gray-900">{config.title}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(config.code, `config-${index}`)}
                        className="border-3amg-purple text-3amg-purple hover:bg-3amg-purple hover:text-white"
                      >
                        {copiedCode === `config-${index}` ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar
                          </>
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="bg-gray-900 rounded-b-lg overflow-x-auto">
                      <pre className="text-green-400 text-sm p-4">
                        <code>{config.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
                  <CardTitle className="text-2xl text-gray-900">Endpoints da API</CardTitle>
                  <CardDescription>
                    Referência completa dos endpoints disponíveis para integração
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="border-l-4 border-l-3amg-purple pl-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge 
                            className={`${endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                            {endpoint.endpoint}
                          </code>
                        </div>
                        <p className="text-gray-600 mb-4">{endpoint.description}</p>
                        <div className="bg-gray-900 rounded-lg overflow-x-auto">
                          <div className="flex items-center justify-between p-3 border-b border-gray-700">
                            <span className="text-green-400 text-sm font-semibold">Exemplo de uso:</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(endpoint.example, `api-${index}`)}
                              className="text-gray-400 hover:text-white"
                            >
                              {copiedCode === `api-${index}` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <pre className="text-green-400 text-sm p-4">
                            <code>{endpoint.example}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Authentication Section */}
              <Card className="bg-gradient-3amg text-white border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <Code className="h-8 w-8 mr-3" />
                    Autenticação e Segurança
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">JWT Tokens</h4>
                      <p className="text-sm opacity-90">
                        Todas as requisições requerem um token JWT válido no header Authorization.
                      </p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Rate Limiting</h4>
                      <p className="text-sm opacity-90">
                        Limite de 1000 requisições por hora por token de API.
                      </p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">HTTPS Only</h4>
                      <p className="text-sm opacity-90">
                        Todas as comunicações devem usar HTTPS para garantir segurança.
                      </p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Webhooks Seguros</h4>
                      <p className="text-sm opacity-90">
                        Validação de assinatura para todos os webhooks recebidos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Link to="/modelo-dados">
            <Button variant="outline" className="flex items-center border-3amg-purple text-3amg-purple hover:bg-3amg-purple hover:text-white">
              <ArrowLeft size={16} className="mr-2" /> Modelo de Dados
            </Button>
          </Link>
          <div className="flex space-x-4">
            <Button 
              className="flex items-center bg-gradient-3amg hover:bg-gradient-3amg-light text-white"
              onClick={() => window.open('https://docs.n8n.io/', '_blank')}
            >
              Docs n8n <ExternalLink size={16} className="ml-2" />
            </Button>
            <Link to="/">
              <Button className="flex items-center bg-gradient-3amg hover:bg-gradient-3amg-light text-white">
                Página Inicial
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentacao;


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Arquitetura = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container mx-auto flex items-center px-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Arquitetura do Sistema</h1>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="mb-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Arquitetura de Integração n8n</h2>
          <p className="text-gray-600 mb-6">
            Este sistema utiliza o n8n como motor de fluxo de trabalho para integrar diversos serviços,
            processar dados e automatizar tarefas. A arquitetura foi projetada para ser escalável, flexível
            e fácil de manter.
          </p>

          {/* Diagrama da Arquitetura */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4 text-center">Diagrama da Arquitetura</h3>
            <div className="border border-gray-300 p-6 rounded-lg bg-gray-50">
              <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`┌────────────────┐      ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│                │      │             │      │              │      │              │
│  Aplicação Web │─────▶│  n8n Server │─────▶│  Banco de    │─────▶│ Serviços     │
│                │      │             │      │  Dados       │      │ Externos     │
└────────────────┘      └─────────────┘      └──────────────┘      └──────────────┘
         │                     │                    │                     │
         ▼                     ▼                    ▼                     ▼
┌────────────────┐      ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│                │      │             │      │              │      │              │
│   API REST     │◀────▶│  Webhooks   │─────▶│  Agentes     │─────▶│  Notificações│
│                │      │             │      │  de IA       │      │              │
└────────────────┘      └─────────────┘      └──────────────┘      └──────────────┘`}
              </pre>
            </div>
          </div>

          {/* Componentes da Arquitetura */}
          <h3 className="text-2xl font-bold mb-4">Componentes da Arquitetura</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Aplicação Web</CardTitle>
                <CardDescription>Interface do usuário</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Frontend React que serve como ponto de entrada para o usuário interagir com o sistema.
                  Comunica-se com o n8n por meio de webhooks e permite iniciar fluxos de trabalho.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>n8n Server</CardTitle>
                <CardDescription>Motor de automação</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Plataforma n8n que executa os workflows definidos. Orquestra a comunicação entre os 
                  diversos componentes e serviços, processando dados e tomando decisões com base em regras.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Banco de Dados</CardTitle>
                <CardDescription>Armazenamento de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Sistema de banco de dados relacional (PostgreSQL) que armazena todos os dados do sistema,
                  incluindo configurações, logs de execução e informações de usuários.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API REST</CardTitle>
                <CardDescription>Comunicação entre serviços</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  APIs RESTful que permitem a comunicação entre os diferentes componentes do sistema.
                  Fornecem endpoints para acesso a dados e funcionalidades específicas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Gatilhos baseados em eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Sistema de webhooks que permite que eventos em um serviço disparem ações em outro.
                  São utilizados para iniciar workflows ou notificar sobre mudanças de estado.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Serviços Externos</CardTitle>
                <CardDescription>Integrações com terceiros</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Integração com APIs externas como serviços de email, SMS, ferramentas de análise,
                  sistemas de pagamento e outras plataformas necessárias para o negócio.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Fluxo de Dados */}
          <h3 className="text-2xl font-bold mb-4">Fluxo de Dados</h3>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <ol className="list-decimal pl-5 space-y-4">
              <li className="text-gray-700">
                <span className="font-medium">Iniciação do Fluxo:</span> Um evento na interface do usuário, 
                um webhook externo ou um gatilho programado inicia o fluxo de trabalho no n8n.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">Processamento:</span> O n8n executa as etapas definidas no workflow,
                podendo incluir busca de dados, transformação, filtragem e decisões condicionais.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">Integração:</span> Durante a execução, o workflow pode se comunicar
                com APIs externas para buscar ou enviar dados, como serviços de pagamento ou CRMs.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">Persistência:</span> Os dados processados são armazenados no
                banco de dados para referência futura e auditoria.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">Notificação:</span> Ao final do fluxo, notificações podem ser enviadas
                aos usuários ou sistemas relevantes sobre o resultado da operação.
              </li>
            </ol>
          </div>
        </div>

        <div className="flex justify-between max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft size={16} className="mr-2" /> Página Inicial
            </Button>
          </Link>
          <Link to="/modelo-dados">
            <Button className="flex items-center">
              Modelo de Dados <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Arquitetura;

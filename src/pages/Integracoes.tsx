import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";

const Integracoes = () => {
  const { handleWorkflowTrigger, isLoading } = useWorkflow();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Integrações
          </h1>
          <p className="text-xl text-gray-600">
            Conecte suas ferramentas favoritas e automatize seus fluxos de trabalho.
          </p>
        </div>

        {/* Integrações Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Exemplo de Integração */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Google Sheets
            </h2>
            <p className="text-gray-600">
              Sincronize dados entre suas planilhas e outros aplicativos.
            </p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Conectar
            </button>
          </div>

          {/* Exemplo de Integração */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Slack
            </h2>
            <p className="text-gray-600">
              Receba notificações e atualizações diretamente no seu canal do Slack.
            </p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Conectar
            </button>
          </div>

          {/* Exemplo de Integração */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Salesforce
            </h2>
            <p className="text-gray-600">
              Integre seus dados de CRM para uma visão completa do seu negócio.
            </p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Conectar
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Integracoes;

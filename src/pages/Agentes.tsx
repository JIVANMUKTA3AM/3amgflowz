import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentesResumo from "@/components/AgentesResumo";
import { useWorkflow } from "@/hooks/useWorkflow";

const Agentes = () => {
  const { user } = useAuth();
  const { handleWorkflowTrigger, isLoading } = useWorkflow();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={isLoading} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Agentes Inteligentes
          </h1>
          <p className="text-lg text-gray-600">
            Configure e gerencie seus agentes de IA para automatizar diferentes processos do seu negócio.
          </p>
        </div>

        <AgentesResumo />
      </main>

      <Footer />
    </div>
  );
};

export default Agentes;

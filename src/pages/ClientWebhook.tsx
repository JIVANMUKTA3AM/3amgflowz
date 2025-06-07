
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import WebhookForm from "@/components/webhook/WebhookForm";
import WebhookInfo from "@/components/webhook/WebhookInfo";

const ClientWebhook = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lastTested, setLastTested] = useState<string | null>(null);
  
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  useEffect(() => {
    // Carregar configuração salva
    const saved = localStorage.getItem("client_webhook_url");
    if (saved) {
      setWebhookUrl(saved);
      setIsConfigured(true);
    }

    const lastTest = localStorage.getItem("client_webhook_last_test");
    if (lastTest) {
      setLastTested(lastTest);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Configuração do Webhook
            </h1>
            <p className="text-gray-600">
              Configure onde você quer receber as respostas dos nossos agentes IA
            </p>
          </div>

          <div className="space-y-6">
            <WebhookForm
              webhookUrl={webhookUrl}
              setWebhookUrl={setWebhookUrl}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isTesting={isTesting}
              setIsTesting={setIsTesting}
              isConfigured={isConfigured}
              setIsConfigured={setIsConfigured}
              lastTested={lastTested}
              setLastTested={setLastTested}
            />
            
            <WebhookInfo />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientWebhook;

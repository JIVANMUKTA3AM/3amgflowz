
import { Button } from "@/components/ui/button";

const CustomIntegrationSection = () => {
  return (
    <div className="mt-16 bg-gradient-to-r from-3amg-orange/10 to-3amg-purple/10 rounded-2xl p-8 border border-gray-700">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Precisa de uma integração específica?
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Nossa equipe pode desenvolver integrações customizadas para suas necessidades específicas. 
          Entre em contato e vamos conversar sobre sua solução.
        </p>
        <Button size="lg" className="bg-gradient-3amg hover:opacity-90">
          Solicitar Integração Custom
        </Button>
      </div>
    </div>
  );
};

export default CustomIntegrationSection;

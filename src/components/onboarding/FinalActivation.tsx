
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Users, Bot, MessageCircle, MessageSquare, Wifi, Rocket } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FinalActivationProps {
  onComplete: () => void;
  onPrevious: () => void;
  isCompleting?: boolean;
}

const FinalActivation = ({ onComplete, onPrevious, isCompleting = false }: FinalActivationProps) => {
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    
    // Simular processo de ativação
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsActivating(false);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-3amg-dark p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-gray-900/90 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-3amg-orange to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Ativação Final</CardTitle>
          <p className="text-center text-orange-100 mt-2">
            Pronto para ativar sua conta Flow!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8 bg-gray-900/50">
          <Alert className="border-3amg-orange/30 bg-3amg-orange/10">
            <Rocket className="h-4 w-4 text-3amg-orange" />
            <AlertDescription className="text-gray-300">
              <strong className="text-3amg-orange">Após a ativação:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Seus agentes estarão disponíveis no painel do cliente</li>
                <li>• Você pode testar as conversas na aba "Chat ao Vivo"</li>
                <li>• URLs de webhook serão geradas automaticamente</li>
                <li>• Você pode ajustar configurações a qualquer momento</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Tutorial Quick Start */}
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h4 className="font-medium text-3amg-orange mb-2">🚀 Primeiros Passos</h4>
            <ol className="text-sm text-gray-300 space-y-1">
              <li>1. Teste seus agentes na aba "Chat ao Vivo"</li>
              <li>2. Configure webhooks do WhatsApp (se aplicável)</li>
              <li>3. Monitore conversas na aba "Conversas"</li>
              <li>4. Ajuste prompts conforme necessário</li>
            </ol>
          </div>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={onPrevious}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <Button 
              onClick={handleActivate}
              disabled={isActivating || isCompleting}
              size="lg"
              className="bg-gradient-to-r from-3amg-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isActivating || isCompleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Ativando Agentes...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Ativar Minha Conta
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalActivation;

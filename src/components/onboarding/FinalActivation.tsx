
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
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Ativação Final</CardTitle>
          <p className="text-center text-gray-600">
            Pronto para ativar sua conta Flow!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <Alert>
            <Rocket className="h-4 w-4" />
            <AlertDescription>
              <strong>Após a ativação:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Seus agentes estarão disponíveis no painel do cliente</li>
                <li>• Você pode testar as conversas na aba "Chat ao Vivo"</li>
                <li>• URLs de webhook serão geradas automaticamente</li>
                <li>• Você pode ajustar configurações a qualquer momento</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Tutorial Quick Start */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🚀 Primeiros Passos</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Teste seus agentes na aba "Chat ao Vivo"</li>
              <li>2. Configure webhooks do WhatsApp (se aplicável)</li>
              <li>3. Monitore conversas na aba "Conversas"</li>
              <li>4. Ajuste prompts conforme necessário</li>
            </ol>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onPrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <Button 
              onClick={handleActivate}
              disabled={isActivating || isCompleting}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
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

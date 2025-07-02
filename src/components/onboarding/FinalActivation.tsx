
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Users, Bot, MessageCircle, MessageSquare, Wifi, Rocket } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FinalActivationProps {
  onboardingData: any;
  onComplete: () => void;
  onPrevious: () => void;
}

const FinalActivation = ({ onboardingData, onComplete, onPrevious }: FinalActivationProps) => {
  const [isActivating, setIsActivating] = useState(false);

  const agentIcons = {
    atendimento: Users,
    tecnico: Bot,
    comercial: MessageCircle
  };

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
          <CardTitle className="text-2xl text-center">Revisar e Ativar</CardTitle>
          <p className="text-center text-gray-600">
            Confirme suas configurações e ative seus agentes
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Resumo dos Agentes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Agentes Configurados ({onboardingData.selectedServices?.length || 0})
            </h3>
            
            <div className="space-y-3">
              {onboardingData.selectedServices?.map((serviceId: string) => {
                const config = onboardingData.agentConfigs?.[serviceId];
                const Icon = agentIcons[serviceId as keyof typeof agentIcons];
                
                return (
                  <div key={serviceId} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Icon className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">{config?.name || serviceId}</p>
                      <p className="text-sm text-gray-600">Modelo: {config?.model || 'GPT-4 Omni Mini'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo das Integrações */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Integrações
            </h3>
            
            <div className="space-y-3">
              {onboardingData.integrations?.whatsapp?.token && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium">WhatsApp Business</p>
                    <p className="text-sm text-gray-600">
                      Phone ID: {onboardingData.integrations.whatsapp.phoneId}
                    </p>
                  </div>
                </div>
              )}
              
              {onboardingData.integrations?.oltConfig?.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Wifi className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium">OLTs Configuradas</p>
                    <p className="text-sm text-gray-600">
                      {onboardingData.integrations.oltConfig.length} OLT(s) conectada(s)
                    </p>
                  </div>
                </div>
              )}
              
              {(!onboardingData.integrations?.whatsapp?.token && !onboardingData.integrations?.oltConfig?.length) && (
                <div className="text-center py-4 text-gray-500">
                  <p>Nenhuma integração configurada</p>
                  <p className="text-sm">Você pode configurar depois no painel</p>
                </div>
              )}
            </div>
          </div>

          {/* Instruções Pós-Ativação */}
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
              disabled={isActivating}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isActivating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Ativando Agentes...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Ativar Meus Agentes
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

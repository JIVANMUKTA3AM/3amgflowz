
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Loader2, MessageCircle, Send, Users, Headphones, Wrench, Zap } from "lucide-react";
import { OnboardingData } from "./OnboardingWizard";
import { toast } from "@/components/ui/use-toast";

interface ReviewAndActivateProps {
  onboardingData: OnboardingData;
  onPrevious: () => void;
}

const ReviewAndActivate = ({ onboardingData, onPrevious }: ReviewAndActivateProps) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const serviceIcons = {
    whatsapp: MessageCircle,
    telegram: Send,
    atendimento: Users,
    comercial: Headphones,
    suporte_tecnico: Wrench
  };

  const serviceNames = {
    whatsapp: 'WhatsApp Business',
    telegram: 'Telegram Bot',
    atendimento: 'Atendimento Geral',
    comercial: 'Comercial',
    suporte_tecnico: 'Suporte Técnico'
  };

  const handleActivate = async () => {
    setIsActivating(true);
    
    try {
      // Simulate API calls to activate integrations
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make actual API calls to:
      // 1. Save configurations to database
      // 2. Trigger n8n workflows
      // 3. Test connections
      // 4. Activate automations
      
      console.log('Activating with data:', onboardingData);
      
      setIsCompleted(true);
      toast({
        title: "Configuração Concluída!",
        description: "Suas automações foram ativadas com sucesso.",
      });
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
    } catch (error) {
      console.error('Error activating:', error);
      toast({
        title: "Erro na Ativação",
        description: "Houve um erro ao ativar suas automações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  if (isCompleted) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Configuração Concluída!
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Suas automações foram ativadas com sucesso. Redirecionando para o dashboard...
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Carregando dashboard...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-2xl text-purple-700">
          Revisão e Ativação
        </CardTitle>
        <p className="text-gray-600">
          Revise suas configurações e ative suas automações
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Selected Services */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Serviços Selecionados</h3>
          <div className="flex flex-wrap gap-3">
            {onboardingData.selectedServices.map((service) => {
              const Icon = serviceIcons[service as keyof typeof serviceIcons];
              return (
                <Badge key={service} variant="secondary" className="px-4 py-2 text-sm">
                  <Icon className="w-4 h-4 mr-2" />
                  {serviceNames[service as keyof typeof serviceNames]}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* WhatsApp Config */}
        {onboardingData.selectedServices.includes('whatsapp') && onboardingData.whatsappConfig && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Business
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Phone Number ID:</span>
                  <p className="text-gray-600">{onboardingData.whatsappConfig.phoneNumberId || 'Não configurado'}</p>
                </div>
                <div>
                  <span className="font-medium">Access Token:</span>
                  <p className="text-gray-600">{onboardingData.whatsappConfig.accessToken ? '••••••••' : 'Não configurado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Telegram Config */}
        {onboardingData.selectedServices.includes('telegram') && onboardingData.telegramConfig && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Send className="w-5 h-5" />
                Telegram Bot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Bot Token:</span>
                  <p className="text-gray-600">{onboardingData.telegramConfig.botToken ? '••••••••' : 'Não configurado'}</p>
                </div>
                <div>
                  <span className="font-medium">Bot Username:</span>
                  <p className="text-gray-600">{onboardingData.telegramConfig.botUsername || 'Não configurado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activation Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">O que acontecerá ao ativar?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Suas configurações serão salvas com segurança</li>
                  <li>• As automações n8n serão ativadas automaticamente</li>
                  <li>• Conexões com APIs serão testadas</li>
                  <li>• Agentes de IA serão configurados</li>
                  <li>• Você receberá acesso completo ao dashboard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6">
          <Button 
            onClick={onPrevious}
            variant="outline"
            disabled={isActivating}
            className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button 
            onClick={handleActivate}
            disabled={isActivating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            {isActivating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ativando...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Ativar Automações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewAndActivate;

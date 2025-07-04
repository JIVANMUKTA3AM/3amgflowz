
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Loader2, MessageCircle, Send, Users, Headphones, Wrench, Zap, AlertCircle } from "lucide-react";
import { OnboardingData } from "./OnboardingWizard";
import { toast } from "@/hooks/use-toast";
import { onboardingActivationService } from "@/services/onboardingActivation";
import { useAuth } from "@/contexts/AuthContext";

interface ReviewAndActivateProps {
  onboardingData: OnboardingData;
  onPrevious: () => void;
  onComplete: () => void;
  isCompleting: boolean;
}

const ReviewAndActivate = ({ onboardingData, onPrevious, onComplete, isCompleting }: ReviewAndActivateProps) => {
  const [activationStep, setActivationStep] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { user } = useAuth();

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

  const validateConfigurations = () => {
    const errors = [];
    
    // Validate agents
    const agentServices = onboardingData.selectedServices.filter(s => 
      ['atendimento', 'comercial', 'suporte_tecnico'].includes(s)
    );
    
    agentServices.forEach(service => {
      const config = onboardingData.agentConfigs[service];
      if (!config?.name || !config?.prompt) {
        errors.push(`Agente ${serviceNames[service as keyof typeof serviceNames]} não está completamente configurado`);
      }
    });

    // Validate WhatsApp if selected
    if (onboardingData.selectedServices.includes('whatsapp')) {
      if (!onboardingData.whatsappConfig?.phoneNumberId || !onboardingData.whatsappConfig?.accessToken) {
        errors.push('WhatsApp Business não está completamente configurado');
      }
    }

    // Validate Telegram if selected
    if (onboardingData.selectedServices.includes('telegram')) {
      if (!onboardingData.telegramConfig?.botToken) {
        errors.push('Telegram Bot não está completamente configurado');
      }
    }

    return errors;
  };

  const handleActivate = async () => {
    const errors = validateConfigurations();
    
    if (errors.length > 0) {
      toast({
        title: "Configurações Incompletas",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Usuário não autenticado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActivationStep('Salvando configurações...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActivationStep('Ativando integrações...');
      
      // Perform full activation using the service
      const result = await onboardingActivationService.performFullActivation(
        onboardingData, 
        user.id
      );
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setActivationStep('Configurando webhooks...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActivationStep('Testando conexões...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await onComplete();
      setIsCompleted(true);
      
    } catch (error) {
      console.error('Error activating:', error);
      setActivationStep(null);
      toast({
        title: "Erro na Ativação",
        description: error instanceof Error ? error.message : "Houve um erro ao ativar suas automações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Onboarding Concluído!
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
      </div>
    );
  }

  const validationErrors = validateConfigurations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-300" />
            <div>
              <CardTitle className="text-3xl font-bold">
                Revisão e Ativação
              </CardTitle>
              <p className="text-purple-100 mt-2">
                Revise suas configurações e ative suas automações do <span className="font-bold text-yellow-300">3AMG FLOWS</span>
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Configurações Pendentes</h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Serviços Selecionados ({onboardingData.selectedServices.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {onboardingData.selectedServices.map((service) => {
                const Icon = serviceIcons[service as keyof typeof serviceIcons];
                const isConfigured = service === 'whatsapp' 
                  ? onboardingData.whatsappConfig?.accessToken 
                  : service === 'telegram' 
                    ? onboardingData.telegramConfig?.botToken
                    : onboardingData.agentConfigs[service]?.name;
                
                return (
                  <Badge 
                    key={service} 
                    variant={isConfigured ? "default" : "destructive"} 
                    className="px-4 py-2 text-sm flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {serviceNames[service as keyof typeof serviceNames]}
                    {isConfigured ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Config */}
            {onboardingData.selectedServices.includes('whatsapp') && (
              <Card className={onboardingData.whatsappConfig?.accessToken ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Business
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Phone Number ID:</span>
                      <span className="text-gray-600">
                        {onboardingData.whatsappConfig?.phoneNumberId || 'Não configurado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Access Token:</span>
                      <span className="text-gray-600">
                        {onboardingData.whatsappConfig?.accessToken ? '••••••••' : 'Não configurado'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Telegram Config */}
            {onboardingData.selectedServices.includes('telegram') && (
              <Card className={onboardingData.telegramConfig?.botToken ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Send className="w-5 h-5" />
                    Telegram Bot
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Bot Token:</span>
                      <span className="text-gray-600">
                        {onboardingData.telegramConfig?.botToken ? '••••••••' : 'Não configurado'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Bot Username:</span>
                      <span className="text-gray-600">
                        {onboardingData.telegramConfig?.botUsername || 'Não configurado'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Agent Configs Summary */}
          {Object.keys(onboardingData.agentConfigs).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Agentes Configurados ({Object.keys(onboardingData.agentConfigs).length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(onboardingData.agentConfigs).map(([key, config]: [string, any]) => (
                  <Card key={key} className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {React.createElement(serviceIcons[key as keyof typeof serviceIcons] || Users, { 
                          className: "w-4 h-4 text-green-600" 
                        })}
                        <span className="font-medium text-green-900">{config.name}</span>
                      </div>
                      <p className="text-xs text-green-700">Modelo: {config.model}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Activation Status */}
          {activationStep && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Ativando Automações...</h4>
                    <p className="text-blue-700">{activationStep}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Button 
              onClick={onPrevious}
              variant="outline"
              disabled={isCompleting || !!activationStep}
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button 
              onClick={handleActivate}
              disabled={isCompleting || !!activationStep || validationErrors.length > 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isCompleting || activationStep ? (
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
    </div>
  );
};

export default ReviewAndActivate;

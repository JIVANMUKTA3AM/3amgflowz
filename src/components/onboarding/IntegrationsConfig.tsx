
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, MessageCircle, Send, Shield, Key, Link, Globe } from "lucide-react";
import { OnboardingData } from "./OnboardingWizard";

interface IntegrationsConfigProps {
  selectedServices: string[];
  onboardingData: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const IntegrationsConfig = ({ selectedServices, onboardingData, onUpdate, onNext, onPrevious }: IntegrationsConfigProps) => {
  const [whatsappConfig, setWhatsappConfig] = useState(onboardingData.whatsappConfig || {});
  const [telegramConfig, setTelegramConfig] = useState(onboardingData.telegramConfig || {});

  const handleNext = () => {
    onUpdate({
      whatsappConfig,
      telegramConfig
    });
    onNext();
  };

  const hasIntegrationsToConfig = selectedServices.includes('whatsapp') || selectedServices.includes('telegram');

  // Se não há integrações para configurar, pula esta etapa
  if (!hasIntegrationsToConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Shield className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Configuração Completa
              </h3>
              <p className="text-gray-600">Nenhuma integração externa selecionada para configurar.</p>
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={onPrevious}
                variant="outline"
                className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Button 
                onClick={onNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
              >
                Continuar
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderWhatsAppConfig = () => (
    <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <MessageCircle className="w-6 h-6" />
          WhatsApp Business API
          <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-xs">Integração Oficial</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="wa-phone-id" className="flex items-center gap-2 font-semibold text-gray-700">
              <Key className="w-4 h-4" />
              Phone Number ID
            </Label>
            <Input
              id="wa-phone-id"
              value={whatsappConfig.phoneNumberId || ''}
              onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneNumberId: e.target.value})}
              placeholder="Seu Phone Number ID"
              className="border-2 border-green-200 focus:border-green-400 rounded-xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wa-token" className="flex items-center gap-2 font-semibold text-gray-700">
              <Shield className="w-4 h-4" />
              Access Token
            </Label>
            <Input
              id="wa-token"
              type="password"
              value={whatsappConfig.accessToken || ''}
              onChange={(e) => setWhatsappConfig({...whatsappConfig, accessToken: e.target.value})}
              placeholder="Seu Access Token"
              className="border-2 border-green-200 focus:border-green-400 rounded-xl"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="wa-webhook" className="flex items-center gap-2 font-semibold text-gray-700">
              <Link className="w-4 h-4" />
              Webhook URL
            </Label>
            <Input
              id="wa-webhook"
              value={whatsappConfig.webhookUrl || ''}
              onChange={(e) => setWhatsappConfig({...whatsappConfig, webhookUrl: e.target.value})}
              placeholder="https://api.exemplo.com/webhook"
              className="border-2 border-green-200 focus:border-green-400 rounded-xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wa-verify-token" className="flex items-center gap-2 font-semibold text-gray-700">
              <Shield className="w-4 h-4" />
              Verify Token
            </Label>
            <Input
              id="wa-verify-token"
              value={whatsappConfig.verifyToken || ''}
              onChange={(e) => setWhatsappConfig({...whatsappConfig, verifyToken: e.target.value})}
              placeholder="Token de verificação"
              className="border-2 border-green-200 focus:border-green-400 rounded-xl"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTelegramConfig = () => (
    <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Send className="w-6 h-6" />
          Telegram Bot
          <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-xs">Bot API</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tg-token" className="flex items-center gap-2 font-semibold text-gray-700">
              <Key className="w-4 h-4" />
              Bot Token
            </Label>
            <Input
              id="tg-token"
              type="password"
              value={telegramConfig.botToken || ''}
              onChange={(e) => setTelegramConfig({...telegramConfig, botToken: e.target.value})}
              placeholder="Token do seu bot"
              className="border-2 border-blue-200 focus:border-blue-400 rounded-xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tg-username" className="flex items-center gap-2 font-semibold text-gray-700">
              <Globe className="w-4 h-4" />
              Nome do Bot
            </Label>
            <Input
              id="tg-username"
              value={telegramConfig.botUsername || ''}
              onChange={(e) => setTelegramConfig({...telegramConfig, botUsername: e.target.value})}
              placeholder="@meubot"
              className="border-2 border-blue-200 focus:border-blue-400 rounded-xl"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tg-webhook" className="flex items-center gap-2 font-semibold text-gray-700">
            <Link className="w-4 h-4" />
            Webhook URL
          </Label>
          <Input
            id="tg-webhook"
            value={telegramConfig.webhookUrl || ''}
            onChange={(e) => setTelegramConfig({...telegramConfig, webhookUrl: e.target.value})}
            placeholder="https://api.exemplo.com/telegram-webhook"
            className="border-2 border-blue-200 focus:border-blue-400 rounded-xl"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8" />
            Configure suas Integrações
          </CardTitle>
          <p className="text-purple-100 mt-2">
            Configure as APIs dos serviços selecionados para ativar a automação
          </p>
        </CardHeader>
        
        <CardContent className="p-8">
          {selectedServices.includes('whatsapp') && renderWhatsAppConfig()}
          {selectedServices.includes('telegram') && renderTelegramConfig()}

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsConfig;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, MessageCircle, Send } from "lucide-react";
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
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-6">Nenhuma integração selecionada para configurar.</p>
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
              className="bg-gradient-3amg hover:opacity-90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderWhatsAppConfig = () => (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <MessageCircle className="w-5 h-5" />
          WhatsApp Business API
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor="wa-phone-id">Phone Number ID</Label>
          <Input
            id="wa-phone-id"
            value={whatsappConfig.phoneNumberId || ''}
            onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneNumberId: e.target.value})}
            placeholder="Seu Phone Number ID do WhatsApp Business"
          />
        </div>
        <div>
          <Label htmlFor="wa-token">Access Token</Label>
          <Input
            id="wa-token"
            type="password"
            value={whatsappConfig.accessToken || ''}
            onChange={(e) => setWhatsappConfig({...whatsappConfig, accessToken: e.target.value})}
            placeholder="Seu Access Token do WhatsApp Business"
          />
        </div>
        <div>
          <Label htmlFor="wa-webhook">Webhook URL</Label>
          <Input
            id="wa-webhook"
            value={whatsappConfig.webhookUrl || ''}
            onChange={(e) => setWhatsappConfig({...whatsappConfig, webhookUrl: e.target.value})}
            placeholder="URL do webhook para receber mensagens"
          />
        </div>
        <div>
          <Label htmlFor="wa-verify-token">Webhook Verify Token</Label>
          <Input
            id="wa-verify-token"
            value={whatsappConfig.verifyToken || ''}
            onChange={(e) => setWhatsappConfig({...whatsappConfig, verifyToken: e.target.value})}
            placeholder="Token para verificação do webhook"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderTelegramConfig = () => (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Send className="w-5 h-5" />
          Telegram Bot
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor="tg-token">Bot Token</Label>
          <Input
            id="tg-token"
            type="password"
            value={telegramConfig.botToken || ''}
            onChange={(e) => setTelegramConfig({...telegramConfig, botToken: e.target.value})}
            placeholder="Token do seu bot do Telegram"
          />
        </div>
        <div>
          <Label htmlFor="tg-username">Nome do Bot (opcional)</Label>
          <Input
            id="tg-username"
            value={telegramConfig.botUsername || ''}
            onChange={(e) => setTelegramConfig({...telegramConfig, botUsername: e.target.value})}
            placeholder="@meubot"
          />
        </div>
        <div>
          <Label htmlFor="tg-webhook">Webhook URL</Label>
          <Input
            id="tg-webhook"
            value={telegramConfig.webhookUrl || ''}
            onChange={(e) => setTelegramConfig({...telegramConfig, webhookUrl: e.target.value})}
            placeholder="URL do webhook para receber mensagens do Telegram"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-purple">
          Configure suas Integrações
        </CardTitle>
        <p className="text-gray-600">
          Configure as APIs dos serviços que você selecionou
        </p>
      </CardHeader>
      <CardContent className="p-6">
        {selectedServices.includes('whatsapp') && renderWhatsAppConfig()}
        {selectedServices.includes('telegram') && renderTelegramConfig()}

        <div className="flex justify-between pt-6">
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
            className="bg-gradient-3amg hover:opacity-90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsConfig;

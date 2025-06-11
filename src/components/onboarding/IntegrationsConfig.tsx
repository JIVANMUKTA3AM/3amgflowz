
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, MessageCircle, Users, Webhook } from "lucide-react";
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
  const [crmConfig, setCrmConfig] = useState(onboardingData.crmConfig || {});
  const [webhookConfig, setWebhookConfig] = useState(onboardingData.webhookConfig || {});

  const handleNext = () => {
    onUpdate({
      whatsappConfig,
      crmConfig,
      webhookConfig
    });
    onNext();
  };

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
      </CardContent>
    </Card>
  );

  const renderCRMConfig = () => (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Users className="w-5 h-5" />
          CRM Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor="crm-type">Tipo de CRM</Label>
          <Select value={crmConfig.type || ''} onValueChange={(value) => setCrmConfig({...crmConfig, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o CRM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pipedrive">Pipedrive</SelectItem>
              <SelectItem value="rdstation">RD Station</SelectItem>
              <SelectItem value="hubspot">HubSpot</SelectItem>
              <SelectItem value="salesforce">Salesforce</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="crm-api-key">API Key</Label>
          <Input
            id="crm-api-key"
            type="password"
            value={crmConfig.apiKey || ''}
            onChange={(e) => setCrmConfig({...crmConfig, apiKey: e.target.value})}
            placeholder="Sua API Key do CRM"
          />
        </div>
        <div>
          <Label htmlFor="crm-domain">Domínio/URL Base</Label>
          <Input
            id="crm-domain"
            value={crmConfig.domain || ''}
            onChange={(e) => setCrmConfig({...crmConfig, domain: e.target.value})}
            placeholder="ex: suaempresa.pipedrive.com"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderWebhookConfig = () => (
    <Card className="mb-6">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Webhook className="w-5 h-5" />
          Webhook Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            value={webhookConfig.url || ''}
            onChange={(e) => setWebhookConfig({...webhookConfig, url: e.target.value})}
            placeholder="https://sua-api.com/webhook"
          />
        </div>
        <div>
          <Label htmlFor="webhook-secret">Secret (opcional)</Label>
          <Input
            id="webhook-secret"
            type="password"
            value={webhookConfig.secret || ''}
            onChange={(e) => setWebhookConfig({...webhookConfig, secret: e.target.value})}
            placeholder="Secret para validação do webhook"
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
        {selectedServices.includes('crm') && renderCRMConfig()}
        {selectedServices.includes('webhook') && renderWebhookConfig()}

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

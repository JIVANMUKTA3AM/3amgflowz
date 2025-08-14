
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, MessageSquare, Wifi, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IntegrationsConfigProps {
  integrations: any;
  onUpdate: (integrations: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const IntegrationsConfig = ({ integrations, onUpdate, onNext, onPrevious }: IntegrationsConfigProps) => {
  const [configs, setConfigs] = useState({
    whatsapp: integrations.whatsapp || {},
    oltConfig: integrations.oltConfig || []
  });

  const handleConfigChange = (integration: string, field: string, value: any) => {
    const newConfigs = {
      ...configs,
      [integration]: {
        ...configs[integration as keyof typeof configs],
        [field]: value
      }
    };
    setConfigs(newConfigs);
  };

  const handleNext = () => {
    onUpdate(configs);
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Configure as Integrações</CardTitle>
          <p className="text-center text-gray-600">
            Configure as APIs necessárias para seus agentes funcionarem
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* WhatsApp Business Integration */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">WhatsApp Business API</h3>
            </div>
            
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Para usar o WhatsApp Business, você precisa ter uma conta aprovada no Meta Business.
                <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" target="_blank" className="ml-1 text-blue-600 hover:underline inline-flex items-center">
                  Ver documentação <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="whatsapp-token">Access Token</Label>
                <Input
                  id="whatsapp-token"
                  type="password"
                  value={configs.whatsapp?.accessToken || ''}
                  onChange={(e) => handleConfigChange('whatsapp', 'accessToken', e.target.value)}
                  placeholder="Token da API do WhatsApp Business"
                />
              </div>
              
              <div>
                <Label htmlFor="phone-id">Phone Number ID</Label>
                <Input
                  id="phone-id"
                  value={configs.whatsapp?.phoneNumberId || ''}
                  onChange={(e) => handleConfigChange('whatsapp', 'phoneNumberId', e.target.value)}
                  placeholder="ID do número de telefone"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onPrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <Button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsConfig;

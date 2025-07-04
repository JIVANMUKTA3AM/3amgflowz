
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send, Webhook, Settings } from "lucide-react";
import TelegramConfig from "@/components/integrations/TelegramConfig";
import WhatsAppConfig from "@/components/integrations/WhatsAppConfig";
import WebhookIntegrationPanel from "@/components/webhooks/WebhookIntegrationPanel";

const BillingConfig = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-gray-600">
            Configure suas integrações com WhatsApp, Telegram e outros serviços
          </p>
        </div>
      </div>

      <Tabs defaultValue="messaging" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Mensageria
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Avançado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canais de Comunicação</CardTitle>
              <CardDescription>
                Configure os canais por onde seus agentes receberão e enviarão mensagens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <WhatsAppConfig />
                <TelegramConfig />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <WebhookIntegrationPanel />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>
                Configurações avançadas de integração e automação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Configurações avançadas em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingConfig;

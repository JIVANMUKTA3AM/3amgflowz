
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Webhook, Settings, Database, Activity } from "lucide-react";
import WebhookIntegrationPanel from "@/components/webhooks/WebhookIntegrationPanel";
import WebhookSpecificConfig from "@/components/WebhookSpecificConfig";
import N8nWebhookManager from "@/components/webhooks/N8nWebhookManager";

const WebhooksTab = () => {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
          <CardTitle className="text-2xl text-3amg-purple flex items-center gap-2">
            <Webhook className="h-6 w-6" />
            Gerenciamento de Webhooks
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Configure webhooks para integrar seus agentes com sistemas externos
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="n8n" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="n8n" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                N8N Webhooks
              </TabsTrigger>
              <TabsTrigger value="plataformas" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Plataformas
              </TabsTrigger>
              <TabsTrigger value="especificos" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Por Agente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="n8n" className="mt-6">
              <N8nWebhookManager />
            </TabsContent>

            <TabsContent value="plataformas" className="mt-6">
              <WebhookIntegrationPanel />
            </TabsContent>

            <TabsContent value="especificos" className="mt-6">
              <WebhookSpecificConfig />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhooksTab;

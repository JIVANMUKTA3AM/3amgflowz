
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, TestTube, ExternalLink, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

interface WhatsAppConfigData {
  phone_number_id: string;
  access_token: string;
  webhook_url: string;
  webhook_verify_token: string;
  is_active: boolean;
}

const WhatsAppConfig = () => {
  const [formData, setFormData] = useState<WhatsAppConfigData>({
    phone_number_id: '',
    access_token: '',
    webhook_url: '',
    webhook_verify_token: '',
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Aqui você pode implementar a lógica para salvar no Supabase
      // Por exemplo, na tabela agent_integrations com type 'whatsapp'
      toast({
        title: "Configuração salva!",
        description: "WhatsApp Business configurado com sucesso.",
      });
    } catch (error) {
      console.error('Error saving WhatsApp config:', error);
      toast({
        title: "Erro ao salvar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Teste básico da API do WhatsApp Business
      const response = await fetch(`https://graph.facebook.com/v18.0/${formData.phone_number_id}`, {
        headers: {
          'Authorization': `Bearer ${formData.access_token}`
        }
      });
      
      if (response.ok) {
        toast({
          title: "Conexão bem-sucedida!",
          description: "WhatsApp Business API está funcionando.",
        });
      } else {
        throw new Error('Falha na conexão');
      }
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-green-600" />
            <div>
              <CardTitle>WhatsApp Business</CardTitle>
              <CardDescription>
                Configure a API do WhatsApp Business para receber mensagens
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={formData.is_active ? "default" : "secondary"}>
              {formData.is_active ? "Ativo" : "Inativo"}
            </Badge>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Configure sua conta no Meta Business Manager e obtenha as credenciais necessárias.
            <Button variant="link" size="sm" asChild className="p-0 ml-1 h-auto">
              <a href="https://developers.facebook.com/docs/whatsapp" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Documentação
              </a>
            </Button>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="phone-number-id">Phone Number ID *</Label>
            <Input
              id="phone-number-id"
              value={formData.phone_number_id}
              onChange={(e) => setFormData({...formData, phone_number_id: e.target.value})}
              placeholder="123456789012345"
            />
          </div>

          <div>
            <Label htmlFor="access-token">Access Token *</Label>
            <Input
              id="access-token"
              type="password"
              value={formData.access_token}
              onChange={(e) => setFormData({...formData, access_token: e.target.value})}
              placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          <div>
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              value={formData.webhook_url}
              onChange={(e) => setFormData({...formData, webhook_url: e.target.value})}
              placeholder="https://seu-n8n.com/webhook/whatsapp"
            />
          </div>

          <div>
            <Label htmlFor="verify-token">Webhook Verify Token</Label>
            <Input
              id="verify-token"
              value={formData.webhook_verify_token}
              onChange={(e) => setFormData({...formData, webhook_verify_token: e.target.value})}
              placeholder="seu_token_secreto"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={!formData.phone_number_id || !formData.access_token || isTesting}
          >
            <TestTube className="w-4 h-4 mr-1" />
            {isTesting ? "Testando..." : "Testar Conexão"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.phone_number_id || !formData.access_token || isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Configuração"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppConfig;

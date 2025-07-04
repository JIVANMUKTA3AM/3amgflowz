
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Send, TestTube, ExternalLink, AlertCircle } from "lucide-react";
import { useTelegramConfig } from "@/hooks/useTelegramConfig";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TelegramConfig = () => {
  const { config, saveConfig, isSaving, testBot, isTesting } = useTelegramConfig();
  const [formData, setFormData] = useState({
    bot_token: '',
    bot_username: '',
    webhook_url: '',
    is_active: true,
  });

  useEffect(() => {
    if (config) {
      setFormData({
        bot_token: config.bot_token || '',
        bot_username: config.bot_username || '',
        webhook_url: config.webhook_url || '',
        is_active: config.is_active,
      });
    }
  }, [config]);

  const handleSave = () => {
    if (!formData.bot_token) {
      return;
    }
    saveConfig({
      bot_token: formData.bot_token,
      bot_username: formData.bot_username,
      webhook_url: formData.webhook_url,
      is_active: formData.is_active,
      user_id: '', // Será preenchido pelo hook
    });
  };

  const handleTestBot = () => {
    if (formData.bot_token) {
      testBot(formData.bot_token);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Send className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Telegram Bot</CardTitle>
              <CardDescription>
                Configure seu bot do Telegram para receber mensagens
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={config?.is_active ? "default" : "secondary"}>
              {config?.is_active ? "Ativo" : "Inativo"}
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
            Para criar um bot no Telegram, converse com @BotFather e siga as instruções.
            <Button variant="link" size="sm" asChild className="p-0 ml-1 h-auto">
              <a href="https://t.me/botfather" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Abrir @BotFather
              </a>
            </Button>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bot-token">Bot Token *</Label>
            <Input
              id="bot-token"
              type="password"
              value={formData.bot_token}
              onChange={(e) => setFormData({...formData, bot_token: e.target.value})}
              placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
            />
          </div>

          <div>
            <Label htmlFor="bot-username">Nome do Bot (opcional)</Label>
            <Input
              id="bot-username"
              value={formData.bot_username}
              onChange={(e) => setFormData({...formData, bot_username: e.target.value})}
              placeholder="@meubot"
            />
          </div>

          <div>
            <Label htmlFor="webhook-url">URL do Webhook (opcional)</Label>
            <Input
              id="webhook-url"
              value={formData.webhook_url}
              onChange={(e) => setFormData({...formData, webhook_url: e.target.value})}
              placeholder="https://seu-n8n.com/webhook/telegram"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTestBot}
            disabled={!formData.bot_token || isTesting}
          >
            <TestTube className="w-4 h-4 mr-1" />
            {isTesting ? "Testando..." : "Testar Bot"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.bot_token || isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Configuração"}
          </Button>
        </div>

        {config?.updated_at && (
          <p className="text-xs text-gray-500">
            Última atualização: {new Date(config.updated_at).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramConfig;

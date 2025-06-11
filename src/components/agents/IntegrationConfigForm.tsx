
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, TestTube, Save } from "lucide-react";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import { useAgentIntegrations } from "@/hooks/useAgentIntegrations";

interface IntegrationConfigFormProps {
  integration?: any;
  onClose: () => void;
}

const IntegrationConfigForm = ({ integration, onClose }: IntegrationConfigFormProps) => {
  const { configurations } = useAgentConfigurations();
  const { createIntegration, updateIntegration, testIntegration, isCreating, isUpdating, isTesting } = useAgentIntegrations();

  const [formData, setFormData] = useState({
    agent_configuration_id: integration?.agent_configuration_id || '',
    integration_type: integration?.integration_type || '',
    integration_name: integration?.integration_name || '',
    is_active: integration?.is_active ?? true,
    api_credentials: integration?.api_credentials || {},
    webhook_endpoints: integration?.webhook_endpoints || {},
    settings: integration?.settings || {},
  });

  const integrationTypes = [
    { value: 'whatsapp', label: 'WhatsApp Business' },
    { value: 'slack', label: 'Slack' },
    { value: 'email', label: 'Email/SMTP' },
    { value: 'webhook', label: 'Webhook' },
    { value: 'crm', label: 'CRM' },
    { value: 'database', label: 'Database' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (integration) {
      updateIntegration({ id: integration.id, ...formData });
    } else {
      createIntegration(formData);
    }
    onClose();
  };

  const handleTest = () => {
    if (integration?.id) {
      testIntegration(integration.id);
    }
  };

  const renderCredentialsFields = () => {
    switch (formData.integration_type) {
      case 'whatsapp':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone_number_id">Phone Number ID</Label>
              <Input
                id="phone_number_id"
                value={formData.api_credentials.phone_number_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, phone_number_id: e.target.value }
                })}
                placeholder="Seu Phone Number ID do WhatsApp Business"
              />
            </div>
            <div>
              <Label htmlFor="access_token">Access Token</Label>
              <Input
                id="access_token"
                type="password"
                value={formData.api_credentials.access_token || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, access_token: e.target.value }
                })}
                placeholder="Seu Access Token do WhatsApp Business"
              />
            </div>
          </div>
        );

      case 'slack':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bot_token">Bot Token</Label>
              <Input
                id="bot_token"
                type="password"
                value={formData.api_credentials.bot_token || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, bot_token: e.target.value }
                })}
                placeholder="xoxb-..."
              />
            </div>
            <div>
              <Label htmlFor="channel_id">Canal ID (opcional)</Label>
              <Input
                id="channel_id"
                value={formData.api_credentials.channel_id || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, channel_id: e.target.value }
                })}
                placeholder="C1234567890"
              />
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="smtp_host">Servidor SMTP</Label>
              <Input
                id="smtp_host"
                value={formData.api_credentials.smtp_host || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, smtp_host: e.target.value }
                })}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtp_port">Porta SMTP</Label>
              <Input
                id="smtp_port"
                type="number"
                value={formData.api_credentials.smtp_port || '587'}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, smtp_port: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="username">Email/Usuário</Label>
              <Input
                id="username"
                type="email"
                value={formData.api_credentials.username || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, username: e.target.value }
                })}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.api_credentials.password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, password: e.target.value }
                })}
              />
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook_url">URL do Webhook</Label>
              <Input
                id="webhook_url"
                value={formData.webhook_endpoints.webhook_url || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  webhook_endpoints: { ...formData.webhook_endpoints, webhook_url: e.target.value }
                })}
                placeholder="https://seu-webhook.com/endpoint"
              />
            </div>
            <div>
              <Label htmlFor="webhook_secret">Secret (opcional)</Label>
              <Input
                id="webhook_secret"
                type="password"
                value={formData.webhook_endpoints.webhook_secret || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  webhook_endpoints: { ...formData.webhook_endpoints, webhook_secret: e.target.value }
                })}
                placeholder="Secret para validação"
              />
            </div>
          </div>
        );

      case 'crm':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="base_url">URL Base do CRM</Label>
              <Input
                id="base_url"
                value={formData.api_credentials.base_url || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, base_url: e.target.value }
                })}
                placeholder="https://api.seucrm.com"
              />
            </div>
            <div>
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                type="password"
                value={formData.api_credentials.api_key || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  api_credentials: { ...formData.api_credentials, api_key: e.target.value }
                })}
                placeholder="Sua API Key do CRM"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-4 text-gray-500">
            Selecione um tipo de integração para configurar as credenciais
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {integration ? 'Editar Integração' : 'Nova Integração'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agent">Agente</Label>
              <Select 
                value={formData.agent_configuration_id} 
                onValueChange={(value) => setFormData({...formData, agent_configuration_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um agente" />
                </SelectTrigger>
                <SelectContent>
                  {configurations?.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo de Integração</Label>
              <Select 
                value={formData.integration_type} 
                onValueChange={(value) => setFormData({...formData, integration_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {integrationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nome da Integração</Label>
            <Input
              id="name"
              value={formData.integration_name}
              onChange={(e) => setFormData({...formData, integration_name: e.target.value})}
              placeholder="Ex: WhatsApp Atendimento"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
            />
            <Label htmlFor="active">Integração ativa</Label>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Credenciais da API</h3>
            {renderCredentialsFields()}
          </div>

          <div>
            <Label htmlFor="settings">Configurações Adicionais (JSON)</Label>
            <Textarea
              id="settings"
              value={JSON.stringify(formData.settings, null, 2)}
              onChange={(e) => {
                try {
                  setFormData({...formData, settings: JSON.parse(e.target.value)});
                } catch (error) {
                  // Ignorar erro de parsing durante a digitação
                }
              }}
              placeholder='{"timeout": 30, "retry_attempts": 3}'
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isCreating || isUpdating}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {integration ? 'Atualizar' : 'Criar'} Integração
            </Button>
            
            {integration && (
              <Button 
                type="button" 
                variant="outline"
                onClick={handleTest}
                disabled={isTesting}
              >
                <TestTube className="h-4 w-4 mr-2" />
                Testar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IntegrationConfigForm;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Integration } from "@/hooks/useIntegrations";

interface IntegrationFormProps {
  integration?: Integration;
  onSave: (integration: Omit<Integration, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const IntegrationForm = ({ integration, onSave, onCancel, isLoading }: IntegrationFormProps) => {
  const [formData, setFormData] = useState({
    name: integration?.name || '',
    type: integration?.type || 'webhook' as const,
    status: integration?.status || 'inactive' as const,
    description: integration?.description || '',
    config: {
      url: integration?.config.url || '',
      method: integration?.config.method || 'POST',
      auth_type: integration?.config.auth_type || 'none',
      headers: integration?.config.headers || {},
      credentials: integration?.config.credentials || {},
      ...integration?.config
    }
  });

  const [newHeaderKey, setNewHeaderKey] = useState('');
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          headers: {
            ...prev.config.headers,
            [newHeaderKey]: newHeaderValue
          }
        }
      }));
      setNewHeaderKey('');
      setNewHeaderValue('');
    }
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...formData.config.headers };
    delete newHeaders[key];
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        headers: newHeaders
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const integrationTypes = [
    { value: 'webhook', label: 'Webhook', description: 'Envio de dados via HTTP' },
    { value: 'api', label: 'API REST', description: 'Integração com API externa' },
    { value: 'n8n', label: 'n8n', description: 'Automação com n8n' },
    { value: 'zapier', label: 'Zapier', description: 'Conectar com Zapier' },
    { value: 'custom', label: 'Personalizada', description: 'Integração customizada' }
  ];

  const authTypes = [
    { value: 'none', label: 'Nenhuma' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'api_key', label: 'API Key' }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {integration ? 'Editar Integração' : 'Nova Integração'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="auth">Autenticação</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome da integração"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {integrationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da integração..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status === 'active'}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      status: checked ? 'active' : 'inactive' 
                    }))
                  }
                />
                <Label htmlFor="status">Ativar integração</Label>
                <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                  {formData.status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.config.url}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      config: { ...prev.config, url: e.target.value }
                    }))}
                    placeholder="https://api.exemplo.com/webhook"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Método HTTP</Label>
                  <Select
                    value={formData.config.method}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      config: { ...prev.config, method: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Headers HTTP</Label>
                
                {Object.entries(formData.config.headers).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2 p-2 border rounded">
                    <Input value={key} disabled className="flex-1" />
                    <Input value={value} disabled className="flex-1" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeader(key)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Nome do header"
                    value={newHeaderKey}
                    onChange={(e) => setNewHeaderKey(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Valor do header"
                    value={newHeaderValue}
                    onChange={(e) => setNewHeaderValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={addHeader}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="auth" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth_type">Tipo de Autenticação</Label>
                <Select
                  value={formData.config.auth_type}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    config: { ...prev.config, auth_type: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {authTypes.map((auth) => (
                      <SelectItem key={auth.value} value={auth.value}>
                        {auth.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.config.auth_type !== 'none' && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Label>Credenciais</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCredentials(!showCredentials)}
                    >
                      {showCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>

                  {formData.config.auth_type === 'bearer' && (
                    <div className="space-y-2">
                      <Label htmlFor="token">Bearer Token</Label>
                      <Input
                        id="token"
                        type={showCredentials ? "text" : "password"}
                        value={formData.config.credentials.token || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            credentials: { ...prev.config.credentials, token: e.target.value }
                          }
                        }))}
                        placeholder="seu-bearer-token"
                      />
                    </div>
                  )}

                  {formData.config.auth_type === 'basic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Usuário</Label>
                        <Input
                          id="username"
                          value={formData.config.credentials.username || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            config: {
                              ...prev.config,
                              credentials: { ...prev.config.credentials, username: e.target.value }
                            }
                          }))}
                          placeholder="usuario"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type={showCredentials ? "text" : "password"}
                          value={formData.config.credentials.password || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            config: {
                              ...prev.config,
                              credentials: { ...prev.config.credentials, password: e.target.value }
                            }
                          }))}
                          placeholder="senha"
                        />
                      </div>
                    </div>
                  )}

                  {formData.config.auth_type === 'api_key' && (
                    <div className="space-y-2">
                      <Label htmlFor="api_key">API Key</Label>
                      <Input
                        id="api_key"
                        type={showCredentials ? "text" : "password"}
                        value={formData.config.credentials.api_key || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            credentials: { ...prev.config.credentials, api_key: e.target.value }
                          }
                        }))}
                        placeholder="sua-api-key"
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : integration ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default IntegrationForm;

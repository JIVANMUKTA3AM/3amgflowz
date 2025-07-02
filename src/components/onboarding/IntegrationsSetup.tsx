
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, MessageSquare, Wifi, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IntegrationsSetupProps {
  selectedServices: string[];
  integrations: any;
  onUpdate: (integrations: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const IntegrationsSetup = ({ selectedServices, integrations, onUpdate, onNext, onPrevious }: IntegrationsSetupProps) => {
  const [configs, setConfigs] = useState({
    whatsapp: integrations.whatsapp || {},
    oltConfig: integrations.oltConfig || []
  });
  const [testResults, setTestResults] = useState<{[key: string]: 'success' | 'error' | 'testing'}>({});

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

  const testWhatsAppConnection = async () => {
    setTestResults({...testResults, whatsapp: 'testing'});
    
    // Simular teste de conexão
    setTimeout(() => {
      const isValid = configs.whatsapp?.accessToken && configs.whatsapp?.phoneNumberId;
      setTestResults({...testResults, whatsapp: isValid ? 'success' : 'error'});
    }, 2000);
  };

  const testOLTConnection = async (index: number) => {
    setTestResults({...testResults, [`olt_${index}`]: 'testing'});
    
    // Simular teste de conexão OLT
    setTimeout(() => {
      const olt = configs.oltConfig?.[index];
      const isValid = olt?.ipAddress && olt?.username && olt?.password;
      setTestResults({...testResults, [`olt_${index}`]: isValid ? 'success' : 'error'});
    }, 2000);
  };

  const addOLT = () => {
    const newOltConfig = [...(configs.oltConfig || [])];
    newOltConfig.push({
      id: `olt_${Date.now()}`,
      name: `OLT ${newOltConfig.length + 1}`,
      brand: 'Huawei',
      model: 'MA5608T',
      ipAddress: '',
      username: '',
      password: ''
    });
    
    setConfigs({
      ...configs,
      oltConfig: newOltConfig
    });
  };

  const removeOLT = (index: number) => {
    const newOltConfig = [...(configs.oltConfig || [])];
    newOltConfig.splice(index, 1);
    setConfigs({
      ...configs,
      oltConfig: newOltConfig
    });
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
              
              <div>
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value={configs.whatsapp?.webhookUrl || 'https://sua-vps.com/webhook/whatsapp'}
                  onChange={(e) => handleConfigChange('whatsapp', 'webhookUrl', e.target.value)}
                  placeholder="URL que receberá as mensagens"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta URL deve apontar para sua VPS onde o n8n está rodando
                </p>
              </div>

              <Button 
                variant="outline" 
                onClick={testWhatsAppConnection}
                disabled={testResults.whatsapp === 'testing'}
                className="w-fit"
              >
                {testResults.whatsapp === 'testing' && <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2"></div>}
                {testResults.whatsapp === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-600" />}
                {testResults.whatsapp === 'error' && <AlertCircle className="w-4 h-4 mr-2 text-red-600" />}
                Testar Conexão
              </Button>
            </div>
          </div>

          {/* OLT Configuration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Wifi className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Configuração de OLTs</h3>
              </div>
              <Button variant="outline" size="sm" onClick={addOLT}>
                Adicionar OLT
              </Button>
            </div>

            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Configure as OLTs para que o suporte técnico possa fazer diagnósticos automáticos.
                Certifique-se de que as OLTs têm SNMP habilitado.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {(configs.oltConfig || []).map((olt: any, index: number) => (
                <Card key={olt.id || index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">OLT {index + 1}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeOLT(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome da OLT</Label>
                      <Input
                        value={olt.name || ''}
                        onChange={(e) => {
                          const newOltConfig = [...(configs.oltConfig || [])];
                          newOltConfig[index] = {...olt, name: e.target.value};
                          setConfigs({...configs, oltConfig: newOltConfig});
                        }}
                        placeholder="Nome identificador"
                      />
                    </div>
                    
                    <div>
                      <Label>IP da OLT</Label>
                      <Input
                        value={olt.ipAddress || ''}
                        onChange={(e) => {
                          const newOltConfig = [...(configs.oltConfig || [])];
                          newOltConfig[index] = {...olt, ipAddress: e.target.value};
                          setConfigs({...configs, oltConfig: newOltConfig});
                        }}
                        placeholder="192.168.1.1"
                      />
                    </div>
                    
                    <div>
                      <Label>Usuário SNMP</Label>
                      <Input
                        value={olt.username || ''}
                        onChange={(e) => {
                          const newOltConfig = [...(configs.oltConfig || [])];
                          newOltConfig[index] = {...olt, username: e.target.value};
                          setConfigs({...configs, oltConfig: newOltConfig});
                        }}
                        placeholder="admin"
                      />
                    </div>
                    
                    <div>
                      <Label>Senha SNMP</Label>
                      <Input
                        type="password"
                        value={olt.password || ''}
                        onChange={(e) => {
                          const newOltConfig = [...(configs.oltConfig || [])];
                          newOltConfig[index] = {...olt, password: e.target.value};
                          setConfigs({...configs, oltConfig: newOltConfig});
                        }}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testOLTConnection(index)}
                    disabled={testResults[`olt_${index}`] === 'testing'}
                    className="mt-4"
                  >
                    {testResults[`olt_${index}`] === 'testing' && <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2"></div>}
                    {testResults[`olt_${index}`] === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-600" />}
                    {testResults[`olt_${index}`] === 'error' && <AlertCircle className="w-4 h-4 mr-2 text-red-600" />}
                    Testar Conexão
                  </Button>
                </Card>
              ))}

              {(!configs.oltConfig || configs.oltConfig.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Wifi className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma OLT configurada</p>
                  <p className="text-sm">Clique em "Adicionar OLT" para começar</p>
                </div>
              )}
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

export default IntegrationsSetup;

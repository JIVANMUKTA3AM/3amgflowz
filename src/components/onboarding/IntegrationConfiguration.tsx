
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Wifi, Globe, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SNMPConfig {
  olt_brand: string;
  olt_model: string;
  olt_ip: string;
  snmp_version: string;
  snmp_cred: string;
  snmp_port: string;
  timeout: string;
}

interface APIConfig {
  api_base_url: string;
  api_token: string;
  api_endpoints: string[];
}

interface IntegrationData {
  snmp_enabled: boolean;
  api_enabled: boolean;
  snmp_config: SNMPConfig;
  api_config: APIConfig;
  mode: 'snmp' | 'rest_api' | 'manual';
}

interface IntegrationConfigurationProps {
  integrationData: IntegrationData;
  onIntegrationDataChange: (data: IntegrationData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const IntegrationConfiguration = ({ 
  integrationData, 
  onIntegrationDataChange, 
  onNext, 
  onPrevious 
}: IntegrationConfigurationProps) => {
  const [testResults, setTestResults] = useState<{ snmp?: boolean; api?: boolean }>({});
  const [testing, setTesting] = useState<{ snmp: boolean; api: boolean }>({ snmp: false, api: false });

  const handleSNMPChange = (checked: boolean) => {
    console.log('SNMP checkbox changed:', checked);
    
    try {
      const newData = {
        ...integrationData,
        snmp_enabled: checked,
        mode: checked ? 'snmp' as const : 
               integrationData.api_enabled ? 'rest_api' as const : 'manual' as const
      };
      
      console.log('New integration data:', newData);
      onIntegrationDataChange(newData);
      
      // Reset test results when changing configuration
      setTestResults(prev => ({ ...prev, snmp: undefined }));
    } catch (error) {
      console.error('Error updating SNMP configuration:', error);
      toast({
        title: "Erro na configuração",
        description: "Erro ao atualizar configurações SNMP",
        variant: "destructive",
      });
    }
  };

  const handleAPIChange = (checked: boolean) => {
    console.log('API checkbox changed:', checked);
    
    try {
      const newData = {
        ...integrationData,
        api_enabled: checked,
        mode: checked ? 'rest_api' as const : 
               integrationData.snmp_enabled ? 'snmp' as const : 'manual' as const
      };
      
      console.log('New integration data:', newData);
      onIntegrationDataChange(newData);
      
      // Reset test results when changing configuration
      setTestResults(prev => ({ ...prev, api: undefined }));
    } catch (error) {
      console.error('Error updating API configuration:', error);
      toast({
        title: "Erro na configuração",
        description: "Erro ao atualizar configurações da API",
        variant: "destructive",
      });
    }
  };

  const handleSNMPConfigChange = (field: keyof SNMPConfig, value: string) => {
    console.log(`SNMP config change: ${field} = ${value}`);
    
    try {
      const newConfig = {
        ...integrationData.snmp_config,
        [field]: value
      };
      
      onIntegrationDataChange({
        ...integrationData,
        snmp_config: newConfig
      });
    } catch (error) {
      console.error('Error updating SNMP field:', error);
      toast({
        title: "Erro na configuração",
        description: `Erro ao atualizar ${field}`,
        variant: "destructive",
      });
    }
  };

  const handleAPIConfigChange = (field: keyof APIConfig, value: string | string[]) => {
    console.log(`API config change: ${field} = ${value}`);
    
    try {
      const newConfig = {
        ...integrationData.api_config,
        [field]: value
      };
      
      onIntegrationDataChange({
        ...integrationData,
        api_config: newConfig
      });
    } catch (error) {
      console.error('Error updating API field:', error);
      toast({
        title: "Erro na configuração",
        description: `Erro ao atualizar ${field}`,
        variant: "destructive",
      });
    }
  };

  const testSNMPConnection = async () => {
    console.log('Testing SNMP connection...');
    setTesting(prev => ({ ...prev, snmp: true }));
    
    try {
      // Validate required fields
      const { olt_ip, snmp_cred, snmp_port, snmp_version } = integrationData.snmp_config;
      
      if (!olt_ip || !snmp_cred || !snmp_port || !snmp_version) {
        throw new Error('Preencha todos os campos obrigatórios');
      }
      
      // Simulate SNMP connection test
      console.log('SNMP test parameters:', integrationData.snmp_config);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setTestResults(prev => ({ ...prev, snmp: success }));
      
      if (success) {
        toast({
          title: "Conexão SNMP OK",
          description: "Conectado com sucesso ao equipamento OLT",
        });
      } else {
        toast({
          title: "Erro na SNMP",
          description: "Falha ao conectar com o equipamento. Verifique as configurações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('SNMP test error:', error);
      setTestResults(prev => ({ ...prev, snmp: false }));
      toast({
        title: "Erro no teste SNMP",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setTesting(prev => ({ ...prev, snmp: false }));
    }
  };

  const testAPIConnection = async () => {
    console.log('Testing API connection...');
    setTesting(prev => ({ ...prev, api: true }));
    
    try {
      // Validate required fields
      const { api_base_url, api_token } = integrationData.api_config;
      
      if (!api_base_url || !api_token) {
        throw new Error('Preencha todos os campos obrigatórios');
      }
      
      // Simulate API connection test
      console.log('API test parameters:', integrationData.api_config);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setTestResults(prev => ({ ...prev, api: success }));
      
      if (success) {
        toast({
          title: "API OLT OK",
          description: "Conectado com sucesso à API do equipamento",
        });
      } else {
        toast({
          title: "Erro na API",
          description: "Falha ao conectar com a API. Verifique as configurações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('API test error:', error);
      setTestResults(prev => ({ ...prev, api: false }));
      toast({
        title: "Erro no teste da API",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setTesting(prev => ({ ...prev, api: false }));
    }
  };

  const handleNext = () => {
    console.log('Proceeding to next step with integration data:', integrationData);
    
    // Validate that at least one integration is enabled or user chose manual mode
    if (!integrationData.snmp_enabled && !integrationData.api_enabled) {
      console.log('No integrations enabled, setting manual mode');
      onIntegrationDataChange({
        ...integrationData,
        mode: 'manual'
      });
    }
    
    onNext();
  };

  const canProceed = true; // Allow proceeding even without successful tests for flexibility

  const oltBrands = [
    { value: 'huawei', label: 'Huawei' },
    { value: 'zte', label: 'ZTE' },
    { value: 'fiberhome', label: 'Fiberhome' },
    { value: 'parks', label: 'Parks' },
    { value: 'datacom', label: 'Datacom' },
    { value: 'vsol', label: 'VSOL' },
    { value: 'ubiquiti', label: 'Ubiquiti' }
  ];

  return (
    <div className="min-h-screen bg-3amg-dark p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-gray-900/90 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-3amg-orange to-orange-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">
            Configurações de Integração
          </CardTitle>
          <p className="text-orange-100 text-center mt-2">
            Configure como o sistema irá se comunicar com seus equipamentos
          </p>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8 bg-gray-900/50">
          {/* SNMP Configuration */}
          <Card className="border-2 border-gray-700 bg-gray-800/50">
            <CardHeader className="bg-gray-800/70">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="snmp"
                  checked={integrationData.snmp_enabled}
                  onCheckedChange={handleSNMPChange}
                />
                <div className="flex items-center space-x-2">
                  <Wifi className="w-5 h-5 text-3amg-orange" />
                  <CardTitle className="text-white">SNMP</CardTitle>
                </div>
              </div>
            </CardHeader>
            
            {integrationData.snmp_enabled && (
              <CardContent className="p-6 space-y-4 bg-gray-800/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="olt_brand" className="text-gray-300">Marca</Label>
                    <Select 
                      value={integrationData.snmp_config?.olt_brand || ''}
                      onValueChange={(value) => handleSNMPConfigChange('olt_brand', value)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecione a marca" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {oltBrands.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value} className="text-white hover:bg-gray-700">
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="olt_model" className="text-gray-300">Modelo</Label>
                    <Input
                      id="olt_model"
                      value={integrationData.snmp_config?.olt_model || ''}
                      onChange={(e) => handleSNMPConfigChange('olt_model', e.target.value)}
                      placeholder="Ex: MA5608T, V1600G, UF-INSTANT"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="olt_ip" className="text-gray-300">IP</Label>
                    <Input
                      id="olt_ip"
                      value={integrationData.snmp_config?.olt_ip || ''}
                      onChange={(e) => handleSNMPConfigChange('olt_ip', e.target.value)}
                      placeholder="192.168.1.1"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="snmp_version" className="text-gray-300">Versão SNMP</Label>
                    <Select 
                      value={integrationData.snmp_config?.snmp_version || ''}
                      onValueChange={(value) => handleSNMPConfigChange('snmp_version', value)}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Versão" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="v1" className="text-white hover:bg-gray-700">v1</SelectItem>
                        <SelectItem value="v2c" className="text-white hover:bg-gray-700">v2c</SelectItem>
                        <SelectItem value="v3" className="text-white hover:bg-gray-700">v3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="snmp_cred" className="text-gray-300">Community/User</Label>
                    <Input
                      id="snmp_cred"
                      value={integrationData.snmp_config?.snmp_cred || ''}
                      onChange={(e) => handleSNMPConfigChange('snmp_cred', e.target.value)}
                      placeholder="public ou username"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="snmp_port" className="text-gray-300">Porta</Label>
                    <Input
                      id="snmp_port"
                      value={integrationData.snmp_config?.snmp_port || '161'}
                      onChange={(e) => handleSNMPConfigChange('snmp_port', e.target.value)}
                      placeholder="161"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={testSNMPConnection}
                    disabled={testing.snmp}
                    className="flex items-center space-x-2 bg-3amg-orange hover:bg-orange-600"
                  >
                    {testing.snmp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                    <span>{testing.snmp ? 'Testando...' : 'Testar Conexão'}</span>
                  </Button>
                  
                  {testResults.snmp !== undefined && (
                    <div className="flex items-center space-x-2">
                      {testResults.snmp ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={testResults.snmp ? 'text-green-500' : 'text-red-500'}>
                        {testResults.snmp ? 'Conexão OK' : 'Erro na conexão'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* API Configuration */}
          <Card className="border-2 border-gray-700 bg-gray-800/50">
            <CardHeader className="bg-gray-800/70">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="api"
                  checked={integrationData.api_enabled}
                  onCheckedChange={handleAPIChange}
                />
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-3amg-orange" />
                  <CardTitle className="text-white">API OLT</CardTitle>
                </div>
              </div>
            </CardHeader>
            
            {integrationData.api_enabled && (
              <CardContent className="p-6 space-y-4 bg-gray-800/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="api_base_url" className="text-gray-300">Base URL</Label>
                    <Input
                      id="api_base_url"
                      value={integrationData.api_config?.api_base_url || ''}
                      onChange={(e) => handleAPIConfigChange('api_base_url', e.target.value)}
                      placeholder="http://192.168.1.1:8080/api"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="api_token" className="text-gray-300">Token</Label>
                    <Input
                      id="api_token"
                      type="password"
                      value={integrationData.api_config?.api_token || ''}
                      onChange={(e) => handleAPIConfigChange('api_token', e.target.value)}
                      placeholder="Bearer token ou API key"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={testAPIConnection}
                    disabled={testing.api}
                    className="flex items-center space-x-2 bg-3amg-orange hover:bg-orange-600"
                  >
                    {testing.api ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    <span>{testing.api ? 'Testando...' : 'Testar Conexão'}</span>
                  </Button>
                  
                  {testResults.api !== undefined && (
                    <div className="flex items-center space-x-2">
                      {testResults.api ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={testResults.api ? 'text-green-500' : 'text-red-500'}>
                        {testResults.api ? 'API OK' : 'Erro na API'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Mode Display */}
          <Card className="border-2 border-3amg-orange/30 bg-3amg-orange/10">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-300">Modo de operação selecionado:</p>
                <p className="text-lg font-bold text-3amg-orange uppercase">
                  {integrationData.mode}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-6 border-t border-gray-700">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:bg-gray-800 border-gray-600 text-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!canProceed}
              className="bg-gradient-to-r from-3amg-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
            >
              Finalizar Configuração
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationConfiguration;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Router, Plus, Trash2, Sparkles, Network, Database } from "lucide-react";
import { useOltConfigurations } from "@/hooks/useOltConfigurations";

interface OLTConfig {
  id: string;
  name: string;
  brand: string;
  model: string;
  ipAddress: string;
  snmpCommunity: string;
  username?: string;
  password?: string;
  port: string;
}

interface OLTConfigurationProps {
  selectedServices: string[];
  oltConfigs: OLTConfig[];
  onUpdate: (configs: OLTConfig[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const OLTConfiguration = ({ selectedServices, oltConfigs, onUpdate, onNext, onPrevious }: OLTConfigurationProps) => {
  const [configs, setConfigs] = useState<OLTConfig[]>(
    oltConfigs.length > 0 ? oltConfigs : [createEmptyConfig()]
  );

  const { saveConfiguration, isSaving } = useOltConfigurations();

  function createEmptyConfig(): OLTConfig {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      brand: '',
      model: '',
      ipAddress: '',
      snmpCommunity: 'public',
      port: '161'
    };
  }

  const oltBrands = [
    { value: 'huawei', label: 'Huawei', models: ['MA5608T', 'MA5683T', 'MA5800-X7', 'MA5800-X15'] },
    { value: 'zte', label: 'ZTE', models: ['C320', 'C300', 'C220', 'C600'] },
    { value: 'fiberhome', label: 'Fiberhome', models: ['AN5516-01', 'AN5516-04', 'AN5516-06'] },
    { value: 'parks', label: 'Parks', models: ['OLT 4800', 'OLT 8800', 'OLT 1600'] },
    { value: 'datacom', label: 'Datacom', models: ['DM4100', 'DM4000', 'DM991'] },
    { value: 'vsol', label: 'VSOL', models: ['V1600D', 'V1600G', 'V2408G', 'V2724G', 'V3216G'] }
  ];

  const handleConfigChange = (index: number, field: keyof OLTConfig, value: string) => {
    const updated = [...configs];
    updated[index] = { ...updated[index], [field]: value };
    
    // Reset model when brand changes
    if (field === 'brand') {
      updated[index].model = '';
    }
    
    setConfigs(updated);
  };

  const addOLT = () => {
    setConfigs([...configs, createEmptyConfig()]);
  };

  const removeOLT = (index: number) => {
    if (configs.length > 1) {
      setConfigs(configs.filter((_, i) => i !== index));
    }
  };

  const handleNext = async () => {
    // Validate configurations before proceeding
    const validConfigs = configs.filter(config => 
      config.name && config.brand && config.model && config.ipAddress
    );

    if (validConfigs.length === 0) {
      toast({
        title: "Configuração incompleta",
        description: "Configure pelo menos uma OLT antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Save valid configurations to database
    try {
      for (const config of validConfigs) {
        await new Promise((resolve, reject) => {
          saveConfiguration({
            name: config.name,
            brand: config.brand,
            model: config.model,
            ip_address: config.ipAddress,
            snmp_community: config.snmpCommunity,
            username: config.username,
            password: config.password,
            port: config.port,
            is_active: true
          }, {
            onSuccess: resolve,
            onError: reject
          });
        });
      }

      // Update the onboarding data and proceed
      onUpdate(validConfigs);
      onNext();
    } catch (error) {
      console.error('Error saving OLT configurations:', error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar as configurações de OLT. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <div>
              <CardTitle className="text-3xl font-bold">
                Configure suas OLTs
              </CardTitle>
              <p className="text-purple-100 mt-2">
                Configure as <span className="font-bold text-yellow-300">OLTs</span> para que os agentes do <span className="font-bold text-yellow-300">3AMG FLOWS</span> tenham acesso aos dados da rede
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          <div className="text-center">
            <div className={`flex items-center gap-4 p-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl shadow-xl mb-8`}>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Network className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h3 className="text-2xl font-bold">Configuração de OLTs</h3>
                <p className="text-white/90 mt-1">Configure suas OLTs para monitoramento automático pelos agentes</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {configs.map((config, index) => {
              const selectedBrand = oltBrands.find(brand => brand.value === config.brand);
              
              return (
                <Card key={config.id} className="border-2 border-purple-100 shadow-lg bg-gradient-to-br from-purple-50/50 to-blue-50/50">
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                        <Database className="w-5 h-5" />
                        OLT {index + 1}
                      </CardTitle>
                      {configs.length > 1 && (
                        <Button
                          onClick={() => removeOLT(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor={`name-${index}`} className="text-lg font-semibold text-gray-700">Nome da OLT</Label>
                        <Input
                          id={`name-${index}`}
                          value={config.name}
                          onChange={(e) => handleConfigChange(index, 'name', e.target.value)}
                          placeholder="ex: OLT Centro"
                          className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ip-${index}`} className="text-lg font-semibold text-gray-700">Endereço IP</Label>
                        <Input
                          id={`ip-${index}`}
                          value={config.ipAddress}
                          onChange={(e) => handleConfigChange(index, 'ipAddress', e.target.value)}
                          placeholder="192.168.1.100"
                          className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor={`brand-${index}`} className="text-lg font-semibold text-gray-700">Marca</Label>
                        <Select 
                          value={config.brand} 
                          onValueChange={(value) => handleConfigChange(index, 'brand', value)}
                        >
                          <SelectTrigger className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl p-4">
                            <SelectValue placeholder="Selecione a marca" />
                          </SelectTrigger>
                          <SelectContent>
                            {oltBrands.map((brand) => (
                              <SelectItem key={brand.value} value={brand.value}>
                                {brand.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`model-${index}`} className="text-lg font-semibold text-gray-700">Modelo</Label>
                        <Select 
                          value={config.model} 
                          onValueChange={(value) => handleConfigChange(index, 'model', value)}
                          disabled={!config.brand}
                        >
                          <SelectTrigger className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl p-4">
                            <SelectValue placeholder="Selecione o modelo" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedBrand?.models.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor={`community-${index}`} className="text-lg font-semibold text-gray-700">SNMP Community</Label>
                        <Input
                          id={`community-${index}`}
                          value={config.snmpCommunity}
                          onChange={(e) => handleConfigChange(index, 'snmpCommunity', e.target.value)}
                          placeholder="public"
                          className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`username-${index}`} className="text-lg font-semibold text-gray-700">Usuário (opcional)</Label>
                        <Input
                          id={`username-${index}`}
                          value={config.username || ''}
                          onChange={(e) => handleConfigChange(index, 'username', e.target.value)}
                          placeholder="admin"
                          className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`password-${index}`} className="text-lg font-semibold text-gray-700">Senha (opcional)</Label>
                        <Input
                          id={`password-${index}`}
                          type="password"
                          value={config.password || ''}
                          onChange={(e) => handleConfigChange(index, 'password', e.target.value)}
                          placeholder="••••••••"
                          className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <Button
              onClick={addOLT}
              variant="outline"
              className="w-full py-6 border-dashed border-2 border-purple-300 hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 flex items-center gap-2 rounded-xl text-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Adicionar Mais OLT
            </Button>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:bg-gray-50"
              disabled={isSaving}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                {configs.length} {configs.length === 1 ? 'OLT configurada' : 'OLTs configuradas'}
              </p>
            </div>
            
            <Button 
              onClick={handleNext}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OLTConfiguration;

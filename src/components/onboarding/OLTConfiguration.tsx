
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Router, Plus, Trash2 } from "lucide-react";

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
    { value: 'datacom', label: 'Datacom', models: ['DM4100', 'DM4000', 'DM991'] }
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

  const handleNext = () => {
    onUpdate(configs);
    onNext();
  };

  // Skip this step if OLT is not selected
  if (!selectedServices.includes('olt')) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Router className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            OLT não selecionada
          </h3>
          <p className="text-gray-600 mb-6">
            Você não selecionou o serviço de OLT Management. Pulando esta etapa.
          </p>
          <div className="flex justify-between">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button 
              onClick={onNext}
              className="bg-gradient-3amg hover:opacity-90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-purple flex items-center gap-2">
          <Router className="w-6 h-6" />
          Configuração das OLTs
        </CardTitle>
        <p className="text-gray-600">
          Configure suas OLTs para monitoramento automático. Você pode adicionar múltiplas OLTs.
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {configs.map((config, index) => {
          const selectedBrand = oltBrands.find(brand => brand.value === config.brand);
          
          return (
            <Card key={config.id} className="border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">OLT {index + 1}</CardTitle>
                  {configs.length > 1 && (
                    <Button
                      onClick={() => removeOLT(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${index}`}>Nome da OLT</Label>
                    <Input
                      id={`name-${index}`}
                      value={config.name}
                      onChange={(e) => handleConfigChange(index, 'name', e.target.value)}
                      placeholder="ex: OLT Centro"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`ip-${index}`}>Endereço IP</Label>
                    <Input
                      id={`ip-${index}`}
                      value={config.ipAddress}
                      onChange={(e) => handleConfigChange(index, 'ipAddress', e.target.value)}
                      placeholder="192.168.1.100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`brand-${index}`}>Marca</Label>
                    <Select 
                      value={config.brand} 
                      onValueChange={(value) => handleConfigChange(index, 'brand', value)}
                    >
                      <SelectTrigger>
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
                    <Label htmlFor={`model-${index}`}>Modelo</Label>
                    <Select 
                      value={config.model} 
                      onValueChange={(value) => handleConfigChange(index, 'model', value)}
                      disabled={!config.brand}
                    >
                      <SelectTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`community-${index}`}>SNMP Community</Label>
                    <Input
                      id={`community-${index}`}
                      value={config.snmpCommunity}
                      onChange={(e) => handleConfigChange(index, 'snmpCommunity', e.target.value)}
                      placeholder="public"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`username-${index}`}>Usuário (opcional)</Label>
                    <Input
                      id={`username-${index}`}
                      value={config.username || ''}
                      onChange={(e) => handleConfigChange(index, 'username', e.target.value)}
                      placeholder="admin"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`password-${index}`}>Senha (opcional)</Label>
                    <Input
                      id={`password-${index}`}
                      type="password"
                      value={config.password || ''}
                      onChange={(e) => handleConfigChange(index, 'password', e.target.value)}
                      placeholder="••••••••"
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
          className="w-full py-3 border-dashed border-2 border-gray-300 hover:border-3amg-purple hover:bg-3amg-purple/5 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Mais OLT
        </Button>

        <div className="flex justify-between pt-6">
          <Button 
            onClick={onPrevious}
            variant="outline"
            className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-gradient-3amg hover:opacity-90 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OLTConfiguration;

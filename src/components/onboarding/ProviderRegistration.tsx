
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Building2, Hash, Phone } from "lucide-react";

interface ProviderData {
  name: string;
  cnpj_id: string;
  contact: string;
}

interface ProviderRegistrationProps {
  providerData: ProviderData;
  onProviderDataChange: (data: ProviderData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ProviderRegistration = ({ 
  providerData, 
  onProviderDataChange, 
  onNext, 
  onPrevious 
}: ProviderRegistrationProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProviderData, value: string) => {
    onProviderDataChange({
      ...providerData,
      [field]: value
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!providerData.name.trim()) {
      newErrors.name = 'Nome do provedor é obrigatório';
    }
    
    if (!providerData.cnpj_id.trim()) {
      newErrors.cnpj_id = 'CNPJ/ID é obrigatório';
    }
    
    if (!providerData.contact.trim()) {
      newErrors.contact = 'Contato é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">
            Dados do Provedor
          </CardTitle>
          <p className="text-purple-100 text-center mt-2">
            Informe os dados básicos do seu provedor de internet
          </p>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Nome do Provedor
              </Label>
              <Input
                id="name"
                value={providerData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Minha Internet Ltda"
                className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="cnpj_id" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                CNPJ/ID
              </Label>
              <Input
                id="cnpj_id"
                value={providerData.cnpj_id}
                onChange={(e) => handleInputChange('cnpj_id', e.target.value)}
                placeholder="Ex: 12.345.678/0001-90"
                className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
              />
              {errors.cnpj_id && <p className="text-red-500 text-sm mt-1">{errors.cnpj_id}</p>}
            </div>

            <div>
              <Label htmlFor="contact" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contato
              </Label>
              <Input
                id="contact"
                value={providerData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                placeholder="Ex: (11) 99999-9999 ou contato@provedor.com"
                className="mt-2 border-2 border-purple-200 focus:border-purple-400 rounded-xl text-lg p-4"
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Button 
              onClick={onPrevious}
              variant="outline"
              className="px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Salvar e Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderRegistration;

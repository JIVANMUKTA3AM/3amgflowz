
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, ArrowRight } from "lucide-react";
import { getPlanBySubscribers, getPlanPrice } from "@/types/subscription";

interface SubscriberCountStepProps {
  subscriberCount: number;
  onSubscriberCountChange: (count: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SubscriberCountStep = ({
  subscriberCount,
  onSubscriberCountChange,
  onNext,
  onPrevious
}: SubscriberCountStepProps) => {
  const [inputValue, setInputValue] = useState(subscriberCount.toString());
  
  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseInt(value) || 0;
    onSubscriberCountChange(numValue);
  };

  const recommendedPlan = getPlanBySubscribers(subscriberCount);
  const planPrice = getPlanPrice(recommendedPlan, subscriberCount);
  
  const planNames = {
    free: 'Gratuito',
    flow_start: 'Flow Start',
    flow_pro: 'Flow Pro', 
    flow_power: 'Flow Power',
    flow_enterprise: 'Flow Enterprise',
    flow_ultra: 'Flow Ultra'
  };

  const quickOptions = [100, 300, 500, 800, 1200, 2000, 5000, 10000, 20000];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Quantos assinantes seu provedor possui?
        </h2>
        <p className="text-gray-600">
          Com base no número de assinantes, calcularemos o valor ideal para seu negócio
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle>Número de Assinantes</CardTitle>
          <CardDescription>
            Informe o número atual de assinantes do seu provedor de internet
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subscriber-count">Número de assinantes</Label>
            <Input
              id="subscriber-count"
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Ex: 1500"
              className="text-center text-2xl font-bold"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Opções rápidas:</Label>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange(option.toString())}
                  className={subscriberCount === option ? "bg-blue-100 border-blue-500" : ""}
                >
                  {option.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {subscriberCount > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="text-center">
                <h3 className="font-semibold text-blue-900 mb-2">Plano Recomendado</h3>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {planNames[recommendedPlan]}
                </Badge>
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-900">
                  R$ {planPrice.toLocaleString('pt-BR')}
                  {recommendedPlan !== 'free' && (
                    <span className="text-sm font-normal">/mês</span>
                  )}
                </p>
              </div>

              <div className="text-center text-sm text-blue-700">
                {subscriberCount < 100 ? (
                  <p>Plano gratuito para testes e avaliação</p>
                ) : (
                  <p>
                    Valor calculado para {subscriberCount.toLocaleString()} assinantes
                  </p>
                )}
              </div>
              
              {subscriberCount >= 100 && (
                <div className="text-xs text-blue-600 text-center">
                  * Preço progressivo baseado no número de assinantes
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between max-w-2xl mx-auto">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={subscriberCount < 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SubscriberCountStep;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, ArrowRight } from "lucide-react";
import { getPlanBySubscribers, getSubscriberRange } from "@/types/subscription";

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
  const planNames = {
    free: 'Gratuito',
    flow_start: 'Flow Start',
    flow_pro: 'Flow Pro', 
    flow_power: 'Flow Power',
    flow_enterprise: 'Flow Enterprise',
    flow_ultra: 'Flow Ultra'
  };

  const planPrices = {
    free: 'R$ 0',
    flow_start: 'R$ 199',
    flow_pro: 'R$ 499',
    flow_power: 'R$ 899',
    flow_enterprise: 'R$ 1.497',
    flow_ultra: 'Sob consulta'
  };

  const quickOptions = [100, 500, 1000, 2500, 5000, 15000, 50000];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Quantos assinantes seu provedor possui?
        </h2>
        <p className="text-gray-600">
          Com base no número de assinantes, recomendaremos o plano ideal para seu negócio
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
                <p className="text-2xl font-bold text-blue-900">
                  {planPrices[recommendedPlan]}
                  {recommendedPlan !== 'free' && recommendedPlan !== 'flow_ultra' && (
                    <span className="text-sm font-normal">/mês</span>
                  )}
                </p>
              </div>

              <div className="text-center text-sm text-blue-700">
                {recommendedPlan === 'flow_ultra' ? (
                  <p>Solução customizada para grandes provedores</p>
                ) : (
                  <p>
                    Ideal para provedores com{" "}
                    {(() => {
                      const range = getSubscriberRange(recommendedPlan);
                      if (range.max) {
                        return `${range.min.toLocaleString()} a ${range.max.toLocaleString()}`;
                      } else {
                        return `mais de ${range.min.toLocaleString()}`;
                      }
                    })()} assinantes
                  </p>
                )}
              </div>
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
          disabled={subscriberCount <= 0}
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

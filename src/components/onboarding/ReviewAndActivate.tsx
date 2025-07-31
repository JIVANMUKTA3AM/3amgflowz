
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, Check, Users, DollarSign } from "lucide-react";
import { getPlanBySubscribers, getPlanPrice, getSubscriberRange } from "@/types/subscription";

interface ReviewAndActivateProps {
  selectedServices: string[];
  selectedChannels: string[];
  selectedAgents: string[];
  subscriberCount: number;
  integrationData: any;
  onNext: () => void;
  onPrevious: () => void;
}

const ReviewAndActivate = ({
  selectedServices,
  selectedChannels,
  selectedAgents,
  subscriberCount,
  integrationData,
  onNext,
  onPrevious
}: ReviewAndActivateProps) => {
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

  const planFeatures = {
    free: ['Acesso limitado', 'Suporte básico'],
    flow_start: ['100 a 500 clientes', 'Agentes básicos', 'Suporte email'],
    flow_pro: ['501 a 1.500 clientes', 'Todos os agentes', 'Suporte prioritário'],
    flow_power: ['1.501 a 5.000 clientes', 'Suporte 24/7', 'Analytics avançados'],
    flow_enterprise: ['5.001 a 15.000 clientes', 'Suporte dedicado', 'White label'],
    flow_ultra: ['15.000+ clientes', 'Solução customizada', 'Gerente dedicado']
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Revise suas configurações
        </h2>
        <p className="text-gray-600">
          Confirme todas as informações antes de ativar sua conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo da configuração */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Serviços Selecionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service) => (
                  <Badge key={service} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Número de Assinantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {subscriberCount.toLocaleString()} assinantes
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Canais e Agentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Canais:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedChannels.map((channel) => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong>Agentes:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAgents.map((agent) => (
                      <Badge key={agent} variant="outline" className="text-xs">
                        {agent}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plano recomendado e preço */}
        <div>
          <Card className="border-2 border-blue-500 shadow-lg">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <DollarSign className="h-5 w-5" />
                    Plano Recomendado
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Baseado no seu número de assinantes
                  </CardDescription>
                </div>
                <Badge className="bg-blue-600 text-white">
                  Recomendado
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {planNames[recommendedPlan]}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  R$ {planPrice.toLocaleString('pt-BR')}
                  {recommendedPlan !== 'free' && (
                    <span className="text-lg font-normal text-gray-600">/mês</span>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3">Recursos inclusos:</h4>
                {planFeatures[recommendedPlan].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Valor calculado para:</strong>{" "}
                  {subscriberCount.toLocaleString()} assinantes
                </p>
                {subscriberCount >= 100 && (
                  <p className="text-xs text-gray-500 mt-1">
                    * Preço progressivo baseado no número de assinantes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integração configurada */}
      {(integrationData.whatsapp || integrationData.olt) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Integrações Configuradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrationData.whatsapp && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">WhatsApp</h4>
                  <p className="text-sm text-green-600">
                    Token configurado
                  </p>
                </div>
              )}
              {integrationData.olt && integrationData.olt.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">OLT/SNMP</h4>
                  <p className="text-sm text-blue-600">
                    {integrationData.olt.length} configuração(ões)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de navegação */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Ativar Conta
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewAndActivate;


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
        <h2 className="text-3xl font-bold text-white mb-2">
          Revise suas configurações
        </h2>
        <p className="text-gray-300">
          Confirme todas as informações antes de prosseguir para o pagamento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo da configuração */}
        <div className="space-y-4">
          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Check className="h-5 w-5 text-3amg-orange" />
                Serviços Selecionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedServices.map((service) => (
                  <Badge key={service} variant="secondary" className="bg-gray-700 text-gray-300">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-3amg-orange" />
                Número de Assinantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-3amg-orange">
                {subscriberCount.toLocaleString()} assinantes
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/90 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Check className="h-5 w-5 text-3amg-orange" />
                Canais e Agentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong className="text-gray-300">Canais:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedChannels.map((channel) => (
                      <Badge key={channel} variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="text-gray-300">Agentes:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedAgents.map((agent) => (
                      <Badge key={agent} variant="outline" className="text-xs border-gray-600 text-gray-300">
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
          <Card className="border-2 border-3amg-orange shadow-lg bg-gray-900/90">
            <CardHeader className="bg-3amg-orange/10 border-b border-3amg-orange/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DollarSign className="h-5 w-5 text-3amg-orange" />
                    Plano Recomendado
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Baseado no seu número de assinantes
                  </CardDescription>
                </div>
                <Badge className="bg-3amg-orange text-white">
                  Recomendado
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-white">
                  {planNames[recommendedPlan]}
                </h3>
                <div className="text-3xl font-bold text-3amg-orange mt-2">
                  R$ {planPrice.toLocaleString('pt-BR')}
                  {recommendedPlan !== 'free' && (
                    <span className="text-lg font-normal text-gray-400">/mês</span>
                  )}
                </div>
              </div>

              <Separator className="my-4 bg-gray-700" />

              <div className="space-y-2">
                <h4 className="font-semibold text-white mb-3">Recursos inclusos:</h4>
                {planFeatures[recommendedPlan].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-3amg-orange flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Valor calculado para:</strong>{" "}
                  {subscriberCount.toLocaleString()} assinantes
                </p>
                {subscriberCount >= 100 && (
                  <p className="text-xs text-gray-400 mt-1">
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
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Check className="h-5 w-5 text-3amg-orange" />
              Integrações Configuradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrationData.whatsapp && (
                <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                  <h4 className="font-medium text-green-400">WhatsApp</h4>
                  <p className="text-sm text-green-300">
                    Token configurado
                  </p>
                </div>
              )}
              {integrationData.olt && integrationData.olt.length > 0 && (
                <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                  <h4 className="font-medium text-blue-400">OLT/SNMP</h4>
                  <p className="text-sm text-blue-300">
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
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Button 
          onClick={onNext}
          className="bg-3amg-orange hover:bg-orange-600 text-white"
        >
          Continuar para Pagamento
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewAndActivate;

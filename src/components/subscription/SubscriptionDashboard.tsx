
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";
import { Loader2, RefreshCw, Settings, Crown, Calendar, CreditCard, History } from "lucide-react";

const SubscriptionDashboard = () => {
  const { 
    subscription, 
    history, 
    isLoading, 
    isLoadingHistory,
    manageSubscription, 
    isManaging,
    checkSubscription,
    isChecking
  } = useSubscriptionManagement();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Carregando informações da assinatura...</span>
      </div>
    );
  }

  const formatPrice = (amount?: number) => {
    if (!amount) return 'Gratuito';
    return `R$ ${(amount / 100).toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'canceled': return 'Cancelado';
      case 'past_due': return 'Em Atraso';
      case 'unpaid': return 'Não Pago';
      case 'incomplete': return 'Incompleto';
      default: return status;
    }
  };

  const handleCheckSubscription = () => {
    checkSubscription();
  };

  const handleManageSubscription = () => {
    manageSubscription();
  };

  return (
    <div className="space-y-6">
      {/* Status da Assinatura */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-blue-500" />
              <div>
                <CardTitle>Minha Assinatura</CardTitle>
                <CardDescription>
                  Status atual e informações do seu plano
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckSubscription}
              disabled={isChecking}
            >
              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Atualizar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {subscription ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-500">Plano</span>
                  <p className="font-semibold capitalize">{subscription.plan_type}</p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <Badge className={getStatusColor(subscription.status)}>
                    {getStatusText(subscription.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-500">Valor</span>
                  <p className="font-semibold">{formatPrice(subscription.price_amount)}</p>
                </div>
              </div>

              {subscription.current_period_end && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Próxima Cobrança
                    </span>
                    <p className="font-medium">{formatDate(subscription.current_period_end)}</p>
                  </div>
                  
                  {subscription.cancel_at_period_end && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-orange-600">
                        Cancelamento Agendado
                      </span>
                      <p className="text-sm text-orange-600">
                        Sua assinatura será cancelada em {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleManageSubscription}
                disabled={isManaging}
                className="w-full mt-4"
              >
                {isManaging ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                Gerenciar Assinatura
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma assinatura ativa</h3>
              <p className="text-gray-600 mb-4">
                Você está no plano gratuito. Faça upgrade para desbloquear mais recursos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Assinatura */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico da Assinatura
            </CardTitle>
            <CardDescription>
              Acompanhe todas as mudanças em sua assinatura
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Carregando histórico...</span>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{event.event_type}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.created_at)}
                      </p>
                      {event.old_plan && event.new_plan && (
                        <p className="text-sm text-gray-500">
                          {event.old_plan} → {event.new_plan}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {event.new_status || event.event_type}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                Nenhum evento encontrado
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionDashboard;

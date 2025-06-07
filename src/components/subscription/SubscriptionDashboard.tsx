
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSubscriptionManagement } from "@/hooks/useSubscriptionManagement";
import { 
  Crown, 
  Settings, 
  RefreshCw, 
  Calendar, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const SubscriptionDashboard = () => {
  const { 
    subscription, 
    manageSubscription, 
    isManaging, 
    cancelSubscription, 
    isCanceling,
    checkSubscription,
    isChecking 
  } = useSubscriptionManagement();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, icon: CheckCircle, label: "Ativo" },
      canceled: { variant: "secondary" as const, icon: XCircle, label: "Cancelado" },
      past_due: { variant: "destructive" as const, icon: AlertTriangle, label: "Em atraso" },
      unpaid: { variant: "destructive" as const, icon: AlertTriangle, label: "Não pago" },
      incomplete: { variant: "outline" as const, icon: AlertTriangle, label: "Incompleto" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatPrice = (amount?: number, currency: string = "BRL") => {
    if (!amount) return "Gratuito";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  if (!subscription) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma assinatura ativa</h3>
            <p className="text-muted-foreground mb-4">
              Você está no plano gratuito. Faça upgrade para acessar recursos premium.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status da Assinatura */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Assinatura Ativa
              </CardTitle>
              <CardDescription>
                Gerencie sua assinatura e veja os detalhes
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => checkSubscription()}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge(subscription.status)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Plano:</span>
                <Badge variant="outline" className="capitalize">
                  {subscription.plan_type}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Valor:</span>
                <span className="font-semibold">
                  {formatPrice(subscription.price_amount, subscription.price_currency)}
                  {subscription.price_amount && subscription.price_amount > 0 && "/mês"}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              {subscription.current_period_end && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Renovação:</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDate(subscription.current_period_end)}
                    </span>
                  </div>
                </div>
              )}
              
              {subscription.cancel_at_period_end && (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-destructive">Cancelamento:</span>
                  <Badge variant="destructive">
                    No final do período
                  </Badge>
                </div>
              )}
              
              {subscription.canceled_at && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cancelado em:</span>
                  <span className="text-sm">
                    {formatDate(subscription.canceled_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-3">
            <Button
              onClick={() => manageSubscription()}
              disabled={isManaging}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isManaging ? "Abrindo..." : "Gerenciar Assinatura"}
            </Button>
            
            {subscription.status === 'active' && !subscription.cancel_at_period_end && (
              <Button
                variant="outline"
                onClick={() => cancelSubscription(true)}
                disabled={isCanceling}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isCanceling ? "Cancelando..." : "Cancelar"}
              </Button>
            )}
            
            {subscription.cancel_at_period_end && (
              <Button
                variant="outline"
                onClick={() => cancelSubscription(false)}
                disabled={isCanceling}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isCanceling ? "Reativando..." : "Reativar"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações de Cobrança */}
      {subscription.stripe_customer_id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informações de Cobrança
            </CardTitle>
            <CardDescription>
              Gerencie seus métodos de pagamento
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Métodos de pagamento</p>
                <p className="text-sm text-muted-foreground">
                  Cartões e outras formas de pagamento
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => manageSubscription()}
                disabled={isManaging}
              >
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionDashboard;

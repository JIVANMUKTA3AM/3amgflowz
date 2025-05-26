
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2, RefreshCw, Settings, Crown } from "lucide-react";

const SubscriptionStatus = () => {
  const { subscriptionData, loading, checkSubscription, manageSubscription } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Verificando status da assinatura...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Status da Assinatura
            </CardTitle>
            <CardDescription>
              Gerencie sua assinatura e veja os detalhes do seu plano
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkSubscription}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-medium">Status:</span>
          <Badge variant={subscriptionData.subscribed ? "default" : "secondary"}>
            {subscriptionData.subscribed ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        {subscriptionData.subscription_tier && (
          <div className="flex items-center gap-3">
            <span className="font-medium">Plano:</span>
            <Badge variant="outline">
              {subscriptionData.subscription_tier}
            </Badge>
          </div>
        )}

        {subscriptionData.subscription_end && (
          <div className="flex items-center gap-3">
            <span className="font-medium">Válido até:</span>
            <span className="text-sm text-gray-600">
              {new Date(subscriptionData.subscription_end).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        {subscriptionData.subscribed && (
          <Button
            onClick={manageSubscription}
            className="w-full"
            variant="outline"
          >
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Assinatura
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;

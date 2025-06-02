
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, TrendingDown, Users, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  agent?: string;
  dismissed?: boolean;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      setIsLoading(true);
      
      // Simular alertas do sistema
      const mockAlerts: Alert[] = [
        {
          id: "1",
          type: "warning",
          title: "Tempo de resposta elevado",
          description: "O agente de Suporte Técnico está com tempo médio de resposta acima de 5 minutos",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          agent: "Suporte Técnico"
        },
        {
          id: "2",
          type: "error",
          title: "Falha na integração",
          description: "Webhook do n8n não está respondendo para o agente Comercial",
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          agent: "Comercial"
        },
        {
          id: "3",
          type: "info",
          title: "Pico de atendimentos",
          description: "Volume de atendimentos 40% acima da média do horário",
          timestamp: new Date(Date.now() - 35 * 60 * 1000)
        },
        {
          id: "4",
          type: "warning",
          title: "Agente inativo",
          description: "Agente de Atendimento não processou mensagens nos últimos 15 minutos",
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          agent: "Atendimento"
        }
      ];
      
      setAlerts(mockAlerts.filter(alert => !alert.dismissed));
      setIsLoading(false);
    };

    loadAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <TrendingDown className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'default';
      default:
        return 'outline';
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alerta dispensado",
      description: "O alerta foi removido da lista.",
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    
    if (diff < 1) return 'Agora';
    if (diff < 60) return `${diff}min atrás`;
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas do Sistema
          </CardTitle>
          <CardDescription>
            Monitore alertas e problemas dos seus agentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border animate-pulse">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas do Sistema
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Monitore alertas e problemas dos seus agentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum alerta ativo no momento</p>
            <p className="text-sm text-gray-400">Seus agentes estão funcionando normalmente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAlertIcon(alert.type)}
                    <h4 className="font-medium">{alert.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(alert.type) as any}>
                      {alert.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    {alert.agent && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {alert.agent}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;

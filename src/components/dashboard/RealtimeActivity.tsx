
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, MessageSquare, Clock, User } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'atendimento' | 'comercial' | 'suporte_tecnico';
  action: string;
  timestamp: Date;
  status: 'active' | 'completed' | 'pending';
  customer: string;
}

const RealtimeActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRealtimeData = async () => {
      setIsLoading(true);
      
      // Simular atividades em tempo real
      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "atendimento",
          action: "Novo chat iniciado",
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          status: "active",
          customer: "João Silva"
        },
        {
          id: "2",
          type: "comercial",
          action: "Proposta enviada",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: "completed",
          customer: "Maria Santos"
        },
        {
          id: "3",
          type: "suporte_tecnico",
          action: "Ticket de integração criado",
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          status: "pending",
          customer: "Tech Corp"
        },
        {
          id: "4",
          type: "atendimento",
          action: "Chat finalizado com sucesso",
          timestamp: new Date(Date.now() - 12 * 60 * 1000),
          status: "completed",
          customer: "Ana Costa"
        },
        {
          id: "5",
          type: "comercial",
          action: "Lead qualificado",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          status: "completed",
          customer: "Empresa XYZ"
        }
      ];
      
      setActivities(mockActivities);
      setIsLoading(false);
    };

    loadRealtimeData();

    // Simular updates em tempo real
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ["atendimento", "comercial", "suporte_tecnico"][Math.floor(Math.random() * 3)] as any,
        action: "Nova interação detectada",
        timestamp: new Date(),
        status: "active",
        customer: `Cliente ${Math.floor(Math.random() * 1000)}`
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const getAgentName = (type: string) => {
    switch (type) {
      case 'atendimento':
        return 'Atendimento';
      case 'comercial':
        return 'Comercial';
      case 'suporte_tecnico':
        return 'Suporte Técnico';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
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
            <Activity className="h-5 w-5" />
            Atividade em Tempo Real
          </CardTitle>
          <CardDescription>
            Acompanhe as interações dos agentes em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
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
          <Activity className="h-5 w-5" />
          Atividade em Tempo Real
        </CardTitle>
        <CardDescription>
          Acompanhe as interações dos agentes em tempo real
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {getAgentName(activity.type)}
                    </Badge>
                    <span className="text-sm font-medium">{activity.action}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{activity.customer}</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{formatTime(activity.timestamp)}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getStatusText(activity.status)}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RealtimeActivity;

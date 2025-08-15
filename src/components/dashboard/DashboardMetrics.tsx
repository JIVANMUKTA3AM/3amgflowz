
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckCircle, AlertTriangle, Users, TrendingUp } from "lucide-react";

interface MetricData {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de métricas (substituir por API real)
    const loadMetrics = async () => {
      setIsLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: MetricData[] = [
        {
          title: "Atendimentos Hoje",
          value: "127",
          change: "+12%",
          changeType: "positive",
          icon: <Users className="h-4 w-4" />
        },
        {
          title: "Tempo Médio de Resposta",
          value: "2.3min",
          change: "-18%",
          changeType: "positive",
          icon: <Clock className="h-4 w-4" />
        },
        {
          title: "Taxa de Resolução",
          value: "94.2%",
          change: "+5%",
          changeType: "positive",
          icon: <CheckCircle className="h-4 w-4" />
        },
        {
          title: "Agentes Ativos",
          value: "3",
          change: "100%",
          changeType: "neutral",
          icon: <Activity className="h-4 w-4" />
        },
        {
          title: "Satisfação do Cliente",
          value: "4.8/5",
          change: "+0.3",
          changeType: "positive",
          icon: <TrendingUp className="h-4 w-4" />
        },
        {
          title: "Alertas Pendentes",
          value: "2",
          change: "-3",
          changeType: "positive",
          icon: <AlertTriangle className="h-4 w-4" />
        }
      ];
      
      setMetrics(mockMetrics);
      setIsLoading(false);
    };

    loadMetrics();
  }, []);

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gray-900/90 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-gray-900/90 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {metric.title}
            </CardTitle>
            <div className="text-3amg-orange">
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            <p className={`text-xs ${getChangeColor(metric.changeType)}`}>
              {metric.change} em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;

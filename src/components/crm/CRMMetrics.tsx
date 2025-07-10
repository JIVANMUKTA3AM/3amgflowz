import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Users, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface CRMMetricsProps {
  className?: string;
}

const CRMMetrics = ({ className }: CRMMetricsProps) => {
  const { user } = useAuth();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['crm-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Buscar métricas de clientes
      const { data: clientsCount } = await supabase
        .from('clients')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);

      // Buscar total do pipeline
      const { data: pipelineValue } = await supabase
        .from('sales_pipeline')
        .select('value')
        .eq('user_id', user.id);

      const totalPipelineValue = pipelineValue?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;

      // Buscar oportunidades por estágio
      const { data: opportunitiesByStage } = await supabase
        .from('sales_pipeline')
        .select('stage')
        .eq('user_id', user.id);

      const stageCount = opportunitiesByStage?.length || 0;

      // Buscar interações do mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: interactionsCount } = await supabase
        .from('client_interactions')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      return {
        totalClients: clientsCount?.length || 0,
        totalPipelineValue,
        totalOpportunities: stageCount,
        monthlyInteractions: interactionsCount?.length || 0
      };
    },
    enabled: !!user?.id,
  });

  const metricCards = [
    {
      title: "Total de Clientes",
      value: metrics?.totalClients || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Valor do Pipeline",
      value: `R$ ${(metrics?.totalPipelineValue || 0).toLocaleString('pt-BR')}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Oportunidades Ativas",
      value: metrics?.totalOpportunities || 0,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Interações do Mês",
      value: metrics?.monthlyInteractions || 0,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                <Icon className={cn("h-4 w-4", metric.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CRMMetrics;
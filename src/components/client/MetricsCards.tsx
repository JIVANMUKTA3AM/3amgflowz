
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, BarChart3, Clock, Zap, Users, Globe, TrendingUp } from "lucide-react";

interface ClientMetrics {
  conversasHoje: number;
  conversasMes: number;
  tempoMedioResposta: string;
  taxaResolucao: string;
  agentesAtivos: number;
  integracoesAtivas: number;
}

interface MetricsCardsProps {
  metrics: ClientMetrics;
}

const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Conversas Hoje</CardTitle>
          <MessageCircle className="h-5 w-5 text-white/80" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold mb-1">{metrics.conversasHoje}</div>
          <div className="flex items-center text-white/80 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% em relação a ontem
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-3amg-purple to-3amg-indigo text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Conversas do Mês</CardTitle>
          <BarChart3 className="h-5 w-5 text-white/80" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold mb-1">{metrics.conversasMes}</div>
          <div className="flex items-center text-white/80 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +23% em relação ao mês anterior
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-3amg-blue to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Tempo Médio</CardTitle>
          <Clock className="h-5 w-5 text-white/80" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold mb-1">{metrics.tempoMedioResposta}</div>
          <div className="flex items-center text-white/80 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Tempo de resposta
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Taxa de Resolução</CardTitle>
          <Zap className="h-5 w-5 text-white/80" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold mb-1">{metrics.taxaResolucao}</div>
          <div className="flex items-center text-white/80 text-sm">
            <Zap className="w-4 h-4 mr-1" />
            Problemas resolvidos
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Agentes Ativos</CardTitle>
          <Users className="h-5 w-5 text-white/80" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold mb-1">{metrics.agentesAtivos}</div>
          <div className="flex items-center text-white/80 text-sm">
            <Users className="w-4 h-4 mr-1" />
            Funcionando perfeitamente
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Integrações</CardTitle>
          <Globe className="h-5 w-5 text-white/80" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold mb-1">{metrics.integracoesAtivas}</div>
          <div className="flex items-center text-white/80 text-sm">
            <Globe className="w-4 h-4 mr-1" />
            WhatsApp, Website
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;

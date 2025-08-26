
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { MessageCircle, Clock, Zap, TrendingUp, Star } from "lucide-react";
import { AgentMetric, AgentConfiguration, AgentConversation } from "@/hooks/useAgentConfigurations";

interface AgentMetricsProps {
  metrics: AgentMetric[];
  configurations: AgentConfiguration[];
  conversations: AgentConversation[];
}

const AgentMetrics = ({ metrics, configurations, conversations }: AgentMetricsProps) => {
  // Calcular métricas gerais
  const totalConversations = conversations.length;
  const avgResponseTime = conversations.reduce((acc, conv) => acc + (conv.response_time_ms || 0), 0) / totalConversations || 0;
  const totalTokensUsed = conversations.reduce((acc, conv) => acc + (conv.tokens_used || 0), 0);
  const activeAgents = configurations.filter(config => config.is_active).length;

  // Preparar dados para gráficos
  const dailyMetrics = metrics.slice(0, 7).reverse().map(metric => ({
    date: new Date(metric.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    conversations: metric.total_conversations,
    response_time: metric.average_response_time_ms || 0,
    tokens: metric.total_tokens_used,
  }));

  const agentPerformance = configurations.map(config => {
    const agentConversations = conversations.filter(conv => conv.agent_configuration_id === config.id);
    const agentMetrics = metrics.filter(metric => metric.agent_configuration_id === config.id);
    
    return {
      name: config.name,
      conversations: agentConversations.length,
      avg_response_time: agentConversations.reduce((acc, conv) => acc + (conv.response_time_ms || 0), 0) / agentConversations.length || 0,
      total_tokens: agentConversations.reduce((acc, conv) => acc + (conv.tokens_used || 0), 0),
      satisfaction: agentMetrics.reduce((acc, metric) => acc + (metric.success_rate || 0), 0) / agentMetrics.length || 0,
    };
  });

  const formatTime = (ms: number) => {
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Cards de Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Conversas</p>
                <p className="text-2xl font-bold text-gray-900">{totalConversations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(avgResponseTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tokens Usados</p>
                <p className="text-2xl font-bold text-gray-900">{totalTokensUsed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Agentes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversas por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversations" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [formatTime(Number(value)), 'Tempo']} />
                <Line type="monotone" dataKey="response_time" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance por Agente */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Agente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{agent.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{agent.conversations} conversas</Badge>
                    {agent.satisfaction > 0 && (
                      <Badge variant="outline" className="gap-1">
                        <Star className="h-3 w-3" />
                        {agent.satisfaction.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Tempo Médio</div>
                    <div className="font-medium">{formatTime(agent.avg_response_time)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Tokens Totais</div>
                    <div className="font-medium">{agent.total_tokens.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Eficiência</div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={Math.min((agent.conversations / totalConversations) * 100, 100)} 
                        className="flex-1" 
                      />
                      <span className="font-medium">
                        {Math.round((agent.conversations / totalConversations) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentMetrics;

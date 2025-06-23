
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from "recharts";
import { TokenUsage } from "@/hooks/useTokenMonitoring";

interface TokenUsageChartProps {
  tokenUsage: TokenUsage[];
  isLoading: boolean;
}

const TokenUsageChart = ({ tokenUsage, isLoading }: TokenUsageChartProps) => {
  // Agrupar dados por data para o gráfico
  const dailyData = tokenUsage.reduce((acc, usage) => {
    const existing = acc.find(item => item.date === usage.date);
    if (existing) {
      existing.tokens += usage.tokens_used;
      existing.cost += usage.cost_estimate;
      existing.conversations += usage.conversations_count;
    } else {
      acc.push({
        date: new Date(usage.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        tokens: usage.tokens_used,
        cost: usage.cost_estimate,
        conversations: usage.conversations_count,
      });
    }
    return acc;
  }, [] as { date: string; tokens: number; cost: number; conversations: number }[])
  .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime())
  .slice(-14); // Últimos 14 dias

  // Dados por modelo
  const modelData = tokenUsage.reduce((acc, usage) => {
    const existing = acc.find(item => item.model === usage.model);
    if (existing) {
      existing.tokens += usage.tokens_used;
      existing.cost += usage.cost_estimate;
      existing.conversations += usage.conversations_count;
    } else {
      acc.push({
        model: usage.model.replace(/^(gpt-|claude-|gemini-)/, '').substring(0, 15) + '...',
        tokens: usage.tokens_used,
        cost: usage.cost_estimate,
        conversations: usage.conversations_count,
      });
    }
    return acc;
  }, [] as { model: string; tokens: number; cost: number; conversations: number }[])
  .sort((a, b) => b.tokens - a.tokens)
  .slice(0, 8); // Top 8 modelos

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de Uso Diário */}
      <Card>
        <CardHeader>
          <CardTitle>Uso de Tokens por Dia</CardTitle>
          <CardDescription>Tokens utilizados e custo estimado nos últimos 14 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'tokens') return [Number(value).toLocaleString(), 'Tokens'];
                  if (name === 'cost') return [`$${Number(value).toFixed(2)}`, 'Custo'];
                  if (name === 'conversations') return [value, 'Conversas'];
                  return [value, name];
                }}
              />
              <Bar yAxisId="left" dataKey="tokens" fill="#3B82F6" name="tokens" />
              <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={2} name="cost" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico por Modelo */}
      <Card>
        <CardHeader>
          <CardTitle>Uso por Modelo de IA</CardTitle>
          <CardDescription>Comparação de tokens utilizados por cada modelo</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="model" type="category" width={120} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'tokens') return [Number(value).toLocaleString(), 'Tokens'];
                  if (name === 'cost') return [`$${Number(value).toFixed(2)}`, 'Custo'];
                  return [value, name];
                }}
              />
              <Bar dataKey="tokens" fill="#8B5CF6" name="tokens" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenUsageChart;

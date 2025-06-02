
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const AgentPerformanceChart = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      
      // Simular dados de performance
      const mockPerformanceData = [
        { agent: "Atendimento", atendimentos: 45, resolvidos: 42, satisfacao: 4.7 },
        { agent: "Comercial", atendimentos: 32, resolvidos: 30, satisfacao: 4.9 },
        { agent: "Suporte Técnico", atendimentos: 28, resolvidos: 26, satisfacao: 4.5 }
      ];

      const mockResponseTimeData = [
        { hora: "08:00", tempo: 2.1 },
        { hora: "10:00", tempo: 1.8 },
        { hora: "12:00", tempo: 3.2 },
        { hora: "14:00", tempo: 2.5 },
        { hora: "16:00", tempo: 2.0 },
        { hora: "18:00", tempo: 1.9 }
      ];

      setPerformanceData(mockPerformanceData);
      setResponseTimeData(mockResponseTimeData);
      setIsLoading(false);
    };

    loadChartData();
  }, []);

  const chartConfig = {
    atendimentos: {
      label: "Atendimentos",
      color: "hsl(var(--chart-1))",
    },
    resolvidos: {
      label: "Resolvidos",
      color: "hsl(var(--chart-2))",
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Agentes</CardTitle>
          <CardDescription>
            Comparação entre atendimentos totais e resolvidos por agente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agent" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="atendimentos" fill="var(--color-atendimentos)" />
                <Bar dataKey="resolvidos" fill="var(--color-resolvidos)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tempo de Resposta</CardTitle>
          <CardDescription>
            Evolução do tempo médio de resposta ao longo do dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            tempo: {
              label: "Tempo (min)",
              color: "hsl(var(--chart-3))",
            }
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="tempo" 
                  stroke="var(--color-tempo)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-tempo)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentPerformanceChart;

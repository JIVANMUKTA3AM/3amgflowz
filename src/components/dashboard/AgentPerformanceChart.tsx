
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
      color: "#FF6B35",
    },
    resolvidos: {
      label: "Resolvidos",
      color: "#8B5CF6",
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse bg-gray-900/90 border-gray-700">
          <CardHeader>
            <div className="h-6 bg-gray-700 rounded w-48"></div>
            <div className="h-4 bg-gray-700 rounded w-64"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-700 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse bg-gray-900/90 border-gray-700">
          <CardHeader>
            <div className="h-6 bg-gray-700 rounded w-48"></div>
            <div className="h-4 bg-gray-700 rounded w-64"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-700 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-900/90 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Performance dos Agentes</CardTitle>
          <CardDescription className="text-gray-300">
            Comparação entre atendimentos totais e resolvidos por agente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="agent" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="atendimentos" fill="#FF6B35" />
                <Bar dataKey="resolvidos" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/90 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Tempo de Resposta</CardTitle>
          <CardDescription className="text-gray-300">
            Evolução do tempo médio de resposta ao longo do dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            tempo: {
              label: "Tempo (min)",
              color: "#FF6B35",
            }
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hora" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="tempo" 
                  stroke="#FF6B35" 
                  strokeWidth={2}
                  dot={{ fill: "#FF6B35" }}
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


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ModelPerformance } from "@/hooks/useTokenMonitoring";

interface ModelPerformanceTableProps {
  modelPerformance: ModelPerformance[];
  isLoading: boolean;
}

const ModelPerformanceTable = ({ modelPerformance, isLoading }: ModelPerformanceTableProps) => {
  const formatTime = (ms: number) => {
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  const getPerformanceColor = (responseTime: number) => {
    if (responseTime < 1000) return "text-green-600";
    if (responseTime < 3000) return "text-yellow-600";
    return "text-red-600";
  };

  const getCostLevel = (cost: number) => {
    if (cost < 1) return { level: "Baixo", color: "bg-green-100 text-green-800" };
    if (cost < 10) return { level: "Médio", color: "bg-yellow-100 text-yellow-800" };
    return { level: "Alto", color: "bg-red-100 text-red-800" };
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-3 bg-gray-200 rounded w-64"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (modelPerformance.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Modelos</CardTitle>
          <CardDescription>Métricas detalhadas de cada modelo de IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum dado de performance disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxTokens = Math.max(...modelPerformance.map(m => m.total_tokens));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance dos Modelos</CardTitle>
        <CardDescription>Métricas detalhadas de cada modelo de IA utilizado</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead>Conversas</TableHead>
              <TableHead>Tokens Totais</TableHead>
              <TableHead>Tempo Médio</TableHead>
              <TableHead>Taxa de Sucesso</TableHead>
              <TableHead>Custo Estimado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelPerformance.map((model) => {
              const costLevel = getCostLevel(model.cost_estimate);
              const usagePercentage = (model.total_tokens / maxTokens) * 100;
              
              return (
                <TableRow key={model.model}>
                  <TableCell className="font-medium">
                    <div className="max-w-[200px]">
                      <div className="truncate" title={model.model}>
                        {model.model}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{model.total_conversations}</span>
                      <Progress value={usagePercentage} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{model.total_tokens.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round(model.total_tokens / model.total_conversations)} avg/conversa
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getPerformanceColor(model.avg_response_time)}`}>
                      {formatTime(model.avg_response_time)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={model.success_rate >= 95 ? "default" : "secondary"}>
                      {model.success_rate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">${model.cost_estimate.toFixed(2)}</div>
                      <Badge variant="outline" className={costLevel.color}>
                        {costLevel.level}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceTable;

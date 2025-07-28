
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ModelPerformanceTableProps {
  modelPerformance: any[];
  isLoading: boolean;
}

const ModelPerformanceTable = ({ modelPerformance, isLoading }: ModelPerformanceTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Modelos</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const formatTime = (ms: number) => {
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'default';
    if (rate >= 90) return 'secondary';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance dos Modelos de IA</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead>Tempo Médio</TableHead>
              <TableHead>Tokens Totais</TableHead>
              <TableHead>Taxa de Sucesso</TableHead>
              <TableHead>Custo por Token</TableHead>
              <TableHead>Conversas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelPerformance.map((model) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model.model_name}</TableCell>
                <TableCell>{formatTime(model.avg_response_time)}</TableCell>
                <TableCell>{model.total_tokens.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getSuccessRateColor(model.success_rate)}>
                    {model.success_rate.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell>${model.cost_per_token.toFixed(6)}</TableCell>
                <TableCell>{model.conversations_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ModelPerformanceTable;


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

interface HealthCheck {
  check_name: string;
  status: string;
  details: string;
}

interface BackupSummary {
  table_name: string;
  record_count: number;
  last_created: string;
}

const DatabaseHealthCheck = () => {
  const [isChecking, setIsChecking] = useState(false);

  const { data: healthChecks, isLoading: loadingHealth, refetch: refetchHealth } = useQuery({
    queryKey: ['database-health'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('check_data_integrity');
      
      if (error) throw error;
      return data as HealthCheck[];
    },
  });

  const { data: backupSummary, isLoading: loadingBackup, refetch: refetchBackup } = useQuery({
    queryKey: ['backup-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backup_summary')
        .select('*');
      
      if (error) throw error;
      return data as BackupSummary[];
    },
  });

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      await Promise.all([refetchHealth(), refetchBackup()]);
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'PASS') {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Passou</Badge>;
    }
    return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Falhou</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Status do Banco de Dados</h2>
        <Button 
          onClick={runHealthCheck} 
          disabled={isChecking || loadingHealth || loadingBackup}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          Verificar Integridade
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verificações de Integridade</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHealth ? (
              <div className="text-center py-4">Carregando verificações...</div>
            ) : healthChecks && healthChecks.length > 0 ? (
              <div className="space-y-3">
                {healthChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{check.check_name.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-gray-600">{check.details}</div>
                    </div>
                    {getStatusBadge(check.status)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">Nenhuma verificação disponível</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingBackup ? (
              <div className="text-center py-4">Carregando resumo...</div>
            ) : backupSummary && backupSummary.length > 0 ? (
              <div className="space-y-3">
                {backupSummary.map((summary, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{summary.table_name}</div>
                      <div className="text-sm text-gray-600">
                        Último registro: {new Date(summary.last_created).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <Badge variant="outline">{summary.record_count} registros</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">Nenhum dado disponível</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseHealthCheck;

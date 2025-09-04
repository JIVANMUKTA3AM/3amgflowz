import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface OLTMetrics {
  olt_id: string;
  olt_name: string;
  total_onts: number;
  onts_online: number;
  onts_offline: number;
  avg_signal_strength: number;
  uptime_percentage: number;
  last_sync: string;
  alerts_count: number;
  bandwidth_usage: number;
}

export interface AlertData {
  id: string;
  olt_id: string;
  olt_name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created_at: string;
  resolved: boolean;
}

export const useOLTMetrics = () => {
  const { user } = useAuth();

  const { data: oltMetrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['olt-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Buscar configurações das OLTs do usuário
      const { data: oltConfigs, error: configError } = await supabase
        .from('olt_configurations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (configError) throw configError;
      
      // Para cada OLT, calcular métricas baseadas nos dados SNMP e ONT
      const metrics: OLTMetrics[] = [];
      
      for (const config of oltConfigs || []) {
        // Buscar dados das ONTs para esta OLT
        const { data: onts, error: ontsError } = await supabase
          .from('ont_monitoring')
          .select('*')
          .eq('olt_configuration_id', config.id)
          .eq('user_id', user.id);

        if (ontsError) throw ontsError;

        // Buscar dados SNMP recentes para esta OLT
        const { data: snmpData, error: snmpError } = await supabase
          .from('snmp_data')
          .select('*')
          .eq('olt_configuration_id', config.id)
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })
          .limit(10);

        if (snmpError) throw snmpError;

        // Calcular métricas
        const totalOnts = onts?.length || 0;
        const ontsOnline = onts?.filter(ont => ont.status === 'online').length || 0;
        const ontsOffline = totalOnts - ontsOnline;
        
        // Calcular média de força de sinal
        const signalValues = onts?.map(ont => ont.optical_power_rx).filter(val => val !== null) || [];
        const avgSignalStrength = signalValues.length > 0 
          ? signalValues.reduce((sum, val) => sum + (val || 0), 0) / signalValues.length 
          : 0;

        // Simular uptime baseado nos logs SNMP (se houver erros recentes)
        const recentErrors = snmpData?.filter(log => log.data_type === 'error').length || 0;
        const uptimePercentage = Math.max(95 - (recentErrors * 2), 80);

        // Contar alertas simulados baseados em ONTs offline
        const alertsCount = ontsOffline + (avgSignalStrength < -25 ? 1 : 0);

        // Simular uso de bandwidth baseado no número de ONTs online
        const bandwidthUsage = (ontsOnline / Math.max(totalOnts, 1)) * 100;

        metrics.push({
          olt_id: config.id!,
          olt_name: config.name,
          total_onts: totalOnts,
          onts_online: ontsOnline,
          onts_offline: ontsOffline,
          avg_signal_strength: avgSignalStrength,
          uptime_percentage: uptimePercentage,
          last_sync: snmpData?.[0]?.timestamp || new Date().toISOString(),
          alerts_count: alertsCount,
          bandwidth_usage: bandwidthUsage
        });
      }
      
      return metrics;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  const { data: alerts, isLoading: alertsLoading, refetch: refetchAlerts } = useQuery({
    queryKey: ['olt-alerts', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const alerts: AlertData[] = [];
      
      // Buscar OLTs com problemas
      const { data: oltConfigs, error } = await supabase
        .from('olt_configurations')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      for (const config of oltConfigs || []) {
        // Buscar ONTs offline
        const { data: offlineOnts, error: ontsError } = await supabase
          .from('ont_monitoring')
          .select('*')
          .eq('olt_configuration_id', config.id)
          .eq('user_id', user.id)
          .eq('status', 'offline');

        if (ontsError) throw ontsError;

        // Criar alertas para ONTs offline
        for (const ont of offlineOnts || []) {
          alerts.push({
            id: `alert-${ont.id}`,
            olt_id: config.id!,
            olt_name: config.name,
            severity: 'high',
            message: `ONT ${ont.ont_serial} está offline`,
            created_at: ont.last_seen || new Date().toISOString(),
            resolved: false
          });
        }

        // Buscar logs de erro SNMP recentes
        const { data: errorLogs, error: logsError } = await supabase
          .from('snmp_logs')
          .select('*')
          .eq('olt_configuration_id', config.id)
          .eq('user_id', user.id)
          .eq('status', 'error')
          .order('created_at', { ascending: false })
          .limit(5);

        if (logsError) throw logsError;

        // Criar alertas para erros SNMP
        for (const log of errorLogs || []) {
          alerts.push({
            id: `error-${log.id}`,
            olt_id: config.id!,
            olt_name: config.name,
            severity: 'medium',
            message: `Erro SNMP: ${log.error_message || 'Falha na comunicação'}`,
            created_at: log.created_at,
            resolved: false
          });
        }
      }
      
      return alerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    enabled: !!user?.id,
    refetchInterval: 60000, // Atualizar alertas a cada minuto
  });

  return {
    oltMetrics: oltMetrics || [],
    alerts: alerts || [],
    isLoading: metricsLoading || alertsLoading,
    refetchMetrics,
    refetchAlerts,
    refetch: () => {
      refetchMetrics();
      refetchAlerts();
    }
  };
};
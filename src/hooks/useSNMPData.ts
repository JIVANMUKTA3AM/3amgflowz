
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface SNMPDataEntry {
  id: string;
  olt_configuration_id: string;
  oid: string;
  value: string;
  data_type: string;
  timestamp: string;
  description?: string;
  interface_index?: number;
  ont_id?: string;
}

export interface SNMPLogEntry {
  id: string;
  olt_configuration_id: string;
  operation_type: string;
  oid?: string;
  status: string;
  error_message?: string;
  response_data?: any;
  execution_time_ms?: number;
  created_at: string;
}

export const useSNMPData = (oltConfigId?: string) => {
  const { user } = useAuth();

  const { data: snmpData, isLoading: dataLoading, refetch: refetchData } = useQuery({
    queryKey: ['snmp-data', user?.id, oltConfigId],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      let query = supabase
        .from('snmp_data')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (oltConfigId) {
        query = query.eq('olt_configuration_id', oltConfigId);
      }

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data as SNMPDataEntry[];
    },
    enabled: !!user?.id,
  });

  const { data: snmpLogs, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['snmp-logs', user?.id, oltConfigId],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      let query = supabase
        .from('snmp_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (oltConfigId) {
        query = query.eq('olt_configuration_id', oltConfigId);
      }

      const { data, error } = await query.limit(50);
      
      if (error) throw error;
      return data as SNMPLogEntry[];
    },
    enabled: !!user?.id,
  });

  return {
    snmpData: snmpData || [],
    snmpLogs: snmpLogs || [],
    isLoading: dataLoading || logsLoading,
    refetchData,
    refetchLogs,
    refetch: () => {
      refetchData();
      refetchLogs();
    }
  };
};

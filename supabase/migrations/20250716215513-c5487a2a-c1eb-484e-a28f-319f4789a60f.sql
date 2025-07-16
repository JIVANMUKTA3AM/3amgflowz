
-- Criar tabela para armazenar dados SNMP coletados das OLTs
CREATE TABLE public.snmp_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  olt_configuration_id UUID REFERENCES public.olt_configurations(id) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  oid TEXT NOT NULL,
  value TEXT NOT NULL,
  data_type TEXT NOT NULL DEFAULT 'string',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  interface_index INTEGER,
  ont_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para logs de operações SNMP
CREATE TABLE public.snmp_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  olt_configuration_id UUID REFERENCES public.olt_configurations(id) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  operation_type TEXT NOT NULL,
  oid TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  response_data JSONB,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para monitoramento de ONTs
CREATE TABLE public.ont_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  olt_configuration_id UUID REFERENCES public.olt_configurations(id) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  ont_serial TEXT NOT NULL,
  ont_id TEXT NOT NULL,
  interface_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unknown',
  optical_power_rx NUMERIC,
  optical_power_tx NUMERIC,
  temperature NUMERIC,
  voltage NUMERIC,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.snmp_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snmp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ont_monitoring ENABLE ROW LEVEL SECURITY;

-- Políticas para snmp_data
CREATE POLICY "Users can view their own SNMP data" 
  ON public.snmp_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SNMP data" 
  ON public.snmp_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas para snmp_logs
CREATE POLICY "Users can view their own SNMP logs" 
  ON public.snmp_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SNMP logs" 
  ON public.snmp_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Políticas para ont_monitoring
CREATE POLICY "Users can view their own ONT monitoring" 
  ON public.ont_monitoring 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own ONT monitoring" 
  ON public.ont_monitoring 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Criar índices para performance
CREATE INDEX idx_snmp_data_olt_timestamp ON public.snmp_data(olt_configuration_id, timestamp);
CREATE INDEX idx_snmp_logs_olt_created ON public.snmp_logs(olt_configuration_id, created_at);
CREATE INDEX idx_ont_monitoring_olt_status ON public.ont_monitoring(olt_configuration_id, status);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_ont_monitoring_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ont_monitoring_updated_at
  BEFORE UPDATE ON public.ont_monitoring
  FOR EACH ROW
  EXECUTE FUNCTION update_ont_monitoring_updated_at();

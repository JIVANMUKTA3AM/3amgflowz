-- ============================================
-- BILLING & METRICS LAYER
-- Camada de agregação de uso para billing
-- ============================================

-- 1. Criar tabela usage_aggregates
CREATE TABLE IF NOT EXISTS public.usage_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  total_duration_ms BIGINT DEFAULT 0,
  total_cost_estimate NUMERIC(12,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT valid_period CHECK (period_end >= period_start)
);

-- Comentários de documentação
COMMENT ON TABLE public.usage_aggregates IS 'Agregação de uso por tenant/agente para billing pay-per-use';
COMMENT ON COLUMN public.usage_aggregates.total_sessions IS 'Total de sessões de atendimento no período';
COMMENT ON COLUMN public.usage_aggregates.total_events IS 'Total de eventos processados no período';
COMMENT ON COLUMN public.usage_aggregates.total_duration_ms IS 'Duração total em milissegundos';
COMMENT ON COLUMN public.usage_aggregates.total_cost_estimate IS 'Estimativa de custo baseada em eventos';

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_usage_aggregates_tenant_id ON public.usage_aggregates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_aggregates_agent_id ON public.usage_aggregates(agent_id);
CREATE INDEX IF NOT EXISTS idx_usage_aggregates_period_start ON public.usage_aggregates(period_start);
CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_aggregates_unique_period 
  ON public.usage_aggregates(tenant_id, COALESCE(agent_id, '00000000-0000-0000-0000-000000000000'::uuid), period_start, period_end);

-- 3. Trigger para updated_at
CREATE TRIGGER update_usage_aggregates_updated_at
  BEFORE UPDATE ON public.usage_aggregates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Habilitar RLS
ALTER TABLE public.usage_aggregates ENABLE ROW LEVEL SECURITY;

-- 5. Policies RLS
CREATE POLICY "Tenant members can view their usage aggregates"
  ON public.usage_aggregates
  FOR SELECT
  USING (is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "System can manage usage aggregates"
  ON public.usage_aggregates
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Função de agregação
CREATE OR REPLACE FUNCTION public.refresh_usage_aggregates(
  p_period_start DATE,
  p_period_end DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows_affected INTEGER := 0;
BEGIN
  -- Upsert agregações por tenant e agent
  INSERT INTO public.usage_aggregates (
    tenant_id,
    agent_id,
    period_start,
    period_end,
    total_sessions,
    total_events,
    total_duration_ms,
    total_cost_estimate
  )
  SELECT 
    ss.tenant_id,
    ss.agent_id,
    p_period_start,
    p_period_end,
    COUNT(DISTINCT ss.id) as total_sessions,
    COUNT(se.id) as total_events,
    COALESCE(SUM(se.duration_ms), 0) as total_duration_ms,
    COALESCE(SUM(se.cost_estimate), 0) as total_cost_estimate
  FROM public.service_sessions ss
  LEFT JOIN public.service_events se ON se.service_session_id = ss.id
  WHERE ss.started_at >= p_period_start::timestamp with time zone
    AND ss.started_at < (p_period_end + INTERVAL '1 day')::timestamp with time zone
  GROUP BY ss.tenant_id, ss.agent_id
  ON CONFLICT (tenant_id, COALESCE(agent_id, '00000000-0000-0000-0000-000000000000'::uuid), period_start, period_end)
  DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    total_events = EXCLUDED.total_events,
    total_duration_ms = EXCLUDED.total_duration_ms,
    total_cost_estimate = EXCLUDED.total_cost_estimate,
    updated_at = now();
  
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  RETURN v_rows_affected;
END;
$$;

COMMENT ON FUNCTION public.refresh_usage_aggregates IS 'Agrega dados de service_sessions e service_events para billing';

-- 7. View: Resumo de uso por tenant
CREATE OR REPLACE VIEW public.tenant_usage_summary AS
SELECT 
  ua.tenant_id,
  t.nome as tenant_name,
  ua.period_start,
  ua.period_end,
  SUM(ua.total_sessions) as total_sessions,
  SUM(ua.total_events) as total_events,
  SUM(ua.total_duration_ms) as total_duration_ms,
  ROUND(SUM(ua.total_duration_ms) / 3600000.0, 2) as total_hours,
  SUM(ua.total_cost_estimate) as total_cost_estimate,
  COUNT(DISTINCT ua.agent_id) as agents_used
FROM public.usage_aggregates ua
JOIN public.tenants t ON t.id = ua.tenant_id
GROUP BY ua.tenant_id, t.nome, ua.period_start, ua.period_end;

COMMENT ON VIEW public.tenant_usage_summary IS 'Resumo consolidado de uso por tenant para dashboards';

-- 8. View: Resumo de uso por agente
CREATE OR REPLACE VIEW public.agent_usage_summary AS
SELECT 
  ua.agent_id,
  a.name as agent_name,
  a.type as agent_type,
  ua.tenant_id,
  t.nome as tenant_name,
  ua.period_start,
  ua.period_end,
  ua.total_sessions,
  ua.total_events,
  ua.total_duration_ms,
  ROUND(ua.total_duration_ms / 3600000.0, 2) as total_hours,
  ua.total_cost_estimate,
  CASE 
    WHEN ua.total_sessions > 0 
    THEN ROUND(ua.total_events::numeric / ua.total_sessions, 2)
    ELSE 0 
  END as avg_events_per_session,
  CASE 
    WHEN ua.total_sessions > 0 
    THEN ROUND(ua.total_duration_ms::numeric / ua.total_sessions, 2)
    ELSE 0 
  END as avg_duration_per_session_ms
FROM public.usage_aggregates ua
LEFT JOIN public.agents a ON a.id = ua.agent_id
JOIN public.tenants t ON t.id = ua.tenant_id;

COMMENT ON VIEW public.agent_usage_summary IS 'Resumo detalhado de uso por agente para análise de performance';

-- 9. Habilitar extensões necessárias para cron (se não existirem)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
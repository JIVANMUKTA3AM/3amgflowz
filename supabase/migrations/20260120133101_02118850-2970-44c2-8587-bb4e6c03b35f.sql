-- ============================================
-- CORREÇÕES DE SEGURANÇA - BILLING LAYER
-- ============================================

-- 1. Remover policy permissiva de sistema
DROP POLICY IF EXISTS "System can manage usage aggregates" ON public.usage_aggregates;

-- 2. Criar policies mais seguras para INSERT/UPDATE/DELETE
-- Apenas funções de sistema (SECURITY DEFINER) podem inserir/atualizar
-- Não criar policy ALL com true - a função refresh_usage_aggregates já é SECURITY DEFINER

-- 3. Recriar views com SECURITY INVOKER (padrão seguro)
DROP VIEW IF EXISTS public.tenant_usage_summary;
DROP VIEW IF EXISTS public.agent_usage_summary;

-- View: Resumo de uso por tenant (SECURITY INVOKER)
CREATE VIEW public.tenant_usage_summary 
WITH (security_invoker = true)
AS
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

-- View: Resumo de uso por agente (SECURITY INVOKER)
CREATE VIEW public.agent_usage_summary 
WITH (security_invoker = true)
AS
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
-- =====================================================
-- NOVO NÚCLEO DE DADOS: ATENDIMENTOS ORIENTADOS A AGENTES
-- Propósito: Centralizar todo atendimento realizado pelos agentes
-- (Técnico, Comercial, Financeiro) em estrutura unificada, auditável,
-- mensurável e preparada para billing por uso.
-- =====================================================

-- Criar ENUMs para os novos tipos
CREATE TYPE service_channel AS ENUM ('whatsapp', 'telegram', 'web');
CREATE TYPE service_category AS ENUM ('tecnico', 'comercial', 'financeiro');
CREATE TYPE service_status AS ENUM ('open', 'in_progress', 'resolved', 'escalated');
CREATE TYPE resolution_type AS ENUM ('auto', 'humano', 'hibrido');

-- =====================================================
-- TABELA: service_sessions
-- Propósito: Armazena cada sessão de atendimento realizada por um agente.
-- Cada sessão representa uma interação completa entre cliente e agente,
-- com métricas de satisfação e rastreabilidade de resolução.
-- =====================================================
CREATE TABLE public.service_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE RESTRICT,
  channel service_channel NOT NULL,
  category service_category NOT NULL,
  status service_status NOT NULL DEFAULT 'open',
  resolution_type resolution_type,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comentários de documentação
COMMENT ON TABLE public.service_sessions IS 'Sessões de atendimento unificadas - núcleo central para billing e métricas';
COMMENT ON COLUMN public.service_sessions.tenant_id IS 'Tenant/provedor proprietário da sessão';
COMMENT ON COLUMN public.service_sessions.agent_id IS 'Agente que realizou o atendimento';
COMMENT ON COLUMN public.service_sessions.channel IS 'Canal de origem: whatsapp, telegram ou web';
COMMENT ON COLUMN public.service_sessions.category IS 'Categoria do atendimento: tecnico, comercial ou financeiro';
COMMENT ON COLUMN public.service_sessions.status IS 'Status atual: open, in_progress, resolved ou escalated';
COMMENT ON COLUMN public.service_sessions.resolution_type IS 'Tipo de resolução: auto (IA), humano ou hibrido';
COMMENT ON COLUMN public.service_sessions.satisfaction_score IS 'Nota de satisfação do cliente (1-5)';
COMMENT ON COLUMN public.service_sessions.metadata IS 'Dados adicionais como cliente_id, assunto, tags, etc.';

-- Índices para performance
CREATE INDEX idx_service_sessions_tenant_id ON public.service_sessions(tenant_id);
CREATE INDEX idx_service_sessions_agent_id ON public.service_sessions(agent_id);
CREATE INDEX idx_service_sessions_category ON public.service_sessions(category);
CREATE INDEX idx_service_sessions_status ON public.service_sessions(status);
CREATE INDEX idx_service_sessions_started_at ON public.service_sessions(started_at DESC);
CREATE INDEX idx_service_sessions_tenant_category ON public.service_sessions(tenant_id, category);
CREATE INDEX idx_service_sessions_tenant_status ON public.service_sessions(tenant_id, status);

-- =====================================================
-- TABELA: service_events
-- Propósito: Armazena cada evento individual dentro de uma sessão.
-- Permite rastreabilidade granular de ações, mensagens, comandos
-- executados, custos estimados e tempo de processamento.
-- =====================================================
CREATE TABLE public.service_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_session_id UUID NOT NULL REFERENCES public.service_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_ms INTEGER,
  cost_estimate NUMERIC(10, 6)
);

-- Comentários de documentação
COMMENT ON TABLE public.service_events IS 'Eventos granulares dentro de sessões - base para billing por uso';
COMMENT ON COLUMN public.service_events.service_session_id IS 'Sessão à qual o evento pertence';
COMMENT ON COLUMN public.service_events.event_type IS 'Tipo: message_received, message_sent, ai_inference, api_call, escalation, etc.';
COMMENT ON COLUMN public.service_events.payload IS 'Dados do evento: conteúdo, tokens usados, modelo, resposta, etc.';
COMMENT ON COLUMN public.service_events.duration_ms IS 'Tempo de processamento em milissegundos';
COMMENT ON COLUMN public.service_events.cost_estimate IS 'Custo estimado do evento (tokens, API calls, etc.)';

-- Índices para performance
CREATE INDEX idx_service_events_session_id ON public.service_events(service_session_id);
CREATE INDEX idx_service_events_event_type ON public.service_events(event_type);
CREATE INDEX idx_service_events_created_at ON public.service_events(created_at DESC);
CREATE INDEX idx_service_events_session_type ON public.service_events(service_session_id, event_type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.service_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_events ENABLE ROW LEVEL SECURITY;

-- Policies para service_sessions
CREATE POLICY "Tenant members can view their service sessions"
  ON public.service_sessions
  FOR SELECT
  USING (is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Tenant members can create service sessions"
  ON public.service_sessions
  FOR INSERT
  WITH CHECK (is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Tenant members can update their service sessions"
  ON public.service_sessions
  FOR UPDATE
  USING (is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "System can manage all service sessions"
  ON public.service_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policies para service_events
CREATE POLICY "Tenant members can view events of their sessions"
  ON public.service_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.service_sessions ss
      WHERE ss.id = service_events.service_session_id
      AND is_tenant_member(ss.tenant_id, auth.uid())
    )
  );

CREATE POLICY "Tenant members can create events in their sessions"
  ON public.service_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.service_sessions ss
      WHERE ss.id = service_events.service_session_id
      AND is_tenant_member(ss.tenant_id, auth.uid())
    )
  );

CREATE POLICY "System can manage all service events"
  ON public.service_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- TRIGGER: Atualização automática de updated_at
-- =====================================================
CREATE TRIGGER update_service_sessions_updated_at
  BEFORE UPDATE ON public.service_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- MARCAR TABELAS COMO DEPRECATED
-- (Mantidas para migração gradual, mas não devem ser usadas para novos dados)
-- =====================================================
COMMENT ON TABLE public.agent_conversations IS 'DEPRECATED: Usar service_sessions + service_events. Mantida para compatibilidade.';
COMMENT ON TABLE public.chat_sessions IS 'DEPRECATED: Usar service_sessions + service_events. Mantida para compatibilidade.';
COMMENT ON TABLE public.atendimentos_gerais IS 'DEPRECATED: Usar service_sessions com category apropriado. Mantida para compatibilidade.';
COMMENT ON TABLE public.tickets_tecnicos IS 'DEPRECATED: Usar service_sessions com category=tecnico. Mantida para compatibilidade.';
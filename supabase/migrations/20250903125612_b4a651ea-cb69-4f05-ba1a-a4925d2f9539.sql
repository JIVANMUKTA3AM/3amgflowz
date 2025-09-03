-- Criar tabelas necessárias para o sistema completo de agentes e chat

-- Tabela de configurações de agentes (se não existir)
CREATE TABLE IF NOT EXISTS public.agent_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  webhook_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de conversas dos agentes
CREATE TABLE IF NOT EXISTS public.agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_configuration_id UUID REFERENCES public.agent_configurations(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  agent_response TEXT NOT NULL,
  response_time_ms INTEGER,
  tokens_used INTEGER,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de métricas dos agentes
CREATE TABLE IF NOT EXISTS public.agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_configuration_id UUID REFERENCES public.agent_configurations(id) ON DELETE CASCADE NOT NULL,
  total_conversations INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  average_response_time_ms INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.0,
  date DATE DEFAULT CURRENT_DATE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(agent_configuration_id, date)
);

-- Tabela de sessões de chat ao vivo
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  agent_configuration_id UUID REFERENCES public.agent_configurations(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  whatsapp_phone TEXT,
  telegram_chat_id TEXT,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('whatsapp', 'telegram', 'web')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de mensagens do chat
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'agent', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.agent_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para agent_configurations
CREATE POLICY IF NOT EXISTS "Users can view their own agent configurations"
ON public.agent_configurations FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create their own agent configurations"
ON public.agent_configurations FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own agent configurations"
ON public.agent_configurations FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can delete their own agent configurations"
ON public.agent_configurations FOR DELETE
USING (user_id = auth.uid());

-- Políticas de RLS para agent_conversations
CREATE POLICY IF NOT EXISTS "Users can view their own agent conversations"
ON public.agent_conversations FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create their own agent conversations"
ON public.agent_conversations FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Políticas de RLS para agent_metrics
CREATE POLICY IF NOT EXISTS "Users can view their own agent metrics"
ON public.agent_metrics FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create their own agent metrics"
ON public.agent_metrics FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Políticas de RLS para chat_sessions
CREATE POLICY IF NOT EXISTS "Users can view their own chat sessions"
ON public.chat_sessions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create their own chat sessions"
ON public.chat_sessions FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own chat sessions"
ON public.chat_sessions FOR UPDATE
USING (user_id = auth.uid());

-- Políticas de RLS para chat_messages via chat_sessions
CREATE POLICY IF NOT EXISTS "Users can view messages from their chat sessions"
ON public.chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions cs 
    WHERE cs.id = chat_session_id AND cs.user_id = auth.uid()
  )
);

CREATE POLICY IF NOT EXISTS "Users can create messages in their chat sessions"
ON public.chat_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions cs 
    WHERE cs.id = chat_session_id AND cs.user_id = auth.uid()
  )
);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
DROP TRIGGER IF EXISTS update_agent_configurations_updated_at ON public.agent_configurations;
CREATE TRIGGER update_agent_configurations_updated_at
  BEFORE UPDATE ON public.agent_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
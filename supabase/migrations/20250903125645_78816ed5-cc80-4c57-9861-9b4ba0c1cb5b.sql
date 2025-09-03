-- Criar tabelas necessárias para o sistema completo de agentes e chat (complementando o existente)

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

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para chat_sessions
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can view their own chat sessions"
ON public.chat_sessions FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can create their own chat sessions"
ON public.chat_sessions FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own chat sessions" ON public.chat_sessions;
CREATE POLICY "Users can update their own chat sessions"
ON public.chat_sessions FOR UPDATE
USING (user_id = auth.uid());

-- Políticas de RLS para chat_messages via chat_sessions
DROP POLICY IF EXISTS "Users can view messages from their chat sessions" ON public.chat_messages;
CREATE POLICY "Users can view messages from their chat sessions"
ON public.chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions cs 
    WHERE cs.id = chat_session_id AND cs.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can create messages in their chat sessions" ON public.chat_messages;
CREATE POLICY "Users can create messages in their chat sessions"
ON public.chat_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions cs 
    WHERE cs.id = chat_session_id AND cs.user_id = auth.uid()
  )
);

-- Aplicar trigger para updated_at nas novas tabelas
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar campo webhook_url na tabela agent_configurations se não existir
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'agent_configurations' 
    AND column_name = 'webhook_url'
  ) THEN
    ALTER TABLE public.agent_configurations ADD COLUMN webhook_url TEXT;
  END IF;
END $$;

-- Adicionar campo user_id na tabela agent_metrics se não existir  
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'agent_metrics' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.agent_metrics ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Adicionar coluna numero_assinantes na tabela onboarding_configurations se não existir
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'onboarding_configurations' 
    AND column_name = 'numero_assinantes'
  ) THEN
    ALTER TABLE public.onboarding_configurations ADD COLUMN numero_assinantes INTEGER DEFAULT 0;
  END IF;
END $$;
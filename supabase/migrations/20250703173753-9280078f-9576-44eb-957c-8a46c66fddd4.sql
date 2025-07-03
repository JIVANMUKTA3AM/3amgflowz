
-- Criar tabela para armazenar eventos de webhook
CREATE TABLE public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT,
  agent_type TEXT,
  event_type TEXT NOT NULL,
  payload JSONB,
  source TEXT DEFAULT 'n8n',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'received',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS para segurança
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de eventos (para edge functions)
CREATE POLICY "Service role can manage webhook events" 
  ON public.webhook_events 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Política para usuários visualizarem eventos relacionados aos seus agentes
CREATE POLICY "Users can view their webhook events" 
  ON public.webhook_events 
  FOR SELECT 
  USING (
    agent_id IN (
      SELECT id FROM agent_configurations 
      WHERE user_id = auth.uid()
    )
  );

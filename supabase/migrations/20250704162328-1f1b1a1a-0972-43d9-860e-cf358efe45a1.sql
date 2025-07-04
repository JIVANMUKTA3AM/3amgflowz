
-- Adicionar suporte para Telegram nas configurações de integração
ALTER TABLE agent_integrations 
ADD COLUMN IF NOT EXISTS telegram_config jsonb DEFAULT '{}'::jsonb;

-- Criar tabela para armazenar configurações específicas do Telegram
CREATE TABLE IF NOT EXISTS telegram_configurations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  bot_token text NOT NULL,
  bot_username text,
  webhook_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela telegram_configurations
ALTER TABLE telegram_configurations ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para telegram_configurations
CREATE POLICY "Users can view their own telegram configurations" 
  ON telegram_configurations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own telegram configurations" 
  ON telegram_configurations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own telegram configurations" 
  ON telegram_configurations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own telegram configurations" 
  ON telegram_configurations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_telegram_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER telegram_configurations_updated_at
  BEFORE UPDATE ON telegram_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_telegram_configurations_updated_at();

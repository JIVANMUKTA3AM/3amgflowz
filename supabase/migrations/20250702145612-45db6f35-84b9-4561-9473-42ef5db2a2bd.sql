
-- Criar tabela para armazenar configurações de onboarding dos usuários
CREATE TABLE public.onboarding_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  agent_configs JSONB NOT NULL DEFAULT '{}'::jsonb,
  whatsapp_config JSONB DEFAULT NULL,
  crm_config JSONB DEFAULT NULL,
  webhook_config JSONB DEFAULT NULL,
  olt_configs JSONB DEFAULT '[]'::jsonb,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.onboarding_configurations ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias configurações
CREATE POLICY "Users can view their own onboarding configurations" 
  ON public.onboarding_configurations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários criarem suas configurações
CREATE POLICY "Users can create their own onboarding configurations" 
  ON public.onboarding_configurations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas configurações
CREATE POLICY "Users can update their own onboarding configurations" 
  ON public.onboarding_configurations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_onboarding_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_onboarding_configurations_updated_at
  BEFORE UPDATE ON public.onboarding_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_configurations_updated_at();

-- Criar índice para melhor performance
CREATE INDEX idx_onboarding_configurations_user_id ON public.onboarding_configurations(user_id);

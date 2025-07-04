
-- Criar tabela para configurações de OLT
CREATE TABLE public.olt_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  snmp_community TEXT DEFAULT 'public',
  username TEXT,
  password TEXT,
  port TEXT DEFAULT '161',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela
ALTER TABLE public.olt_configurations ENABLE ROW LEVEL SECURITY;

-- Política para permitir usuários verem suas próprias configurações
CREATE POLICY "Users can view their own OLT configurations" 
  ON public.olt_configurations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para permitir usuários criarem suas próprias configurações
CREATE POLICY "Users can create their own OLT configurations" 
  ON public.olt_configurations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para permitir usuários atualizarem suas próprias configurações
CREATE POLICY "Users can update their own OLT configurations" 
  ON public.olt_configurations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para permitir usuários excluírem suas próprias configurações
CREATE POLICY "Users can delete their own OLT configurations" 
  ON public.olt_configurations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_olt_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_olt_configurations_updated_at
  BEFORE UPDATE ON public.olt_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_olt_configurations_updated_at();

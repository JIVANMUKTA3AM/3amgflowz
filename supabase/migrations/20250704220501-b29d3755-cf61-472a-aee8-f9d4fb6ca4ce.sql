
-- Verificar se a tabela já existe e criar se necessário
DO $$ 
BEGIN
    -- Criar tabela para configurações de OLT se não existir
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'olt_configurations') THEN
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
    END IF;
END $$;

-- Criar função para atualizar updated_at se não existir
CREATE OR REPLACE FUNCTION public.update_olt_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS update_olt_configurations_updated_at ON public.olt_configurations;
CREATE TRIGGER update_olt_configurations_updated_at
  BEFORE UPDATE ON public.olt_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_olt_configurations_updated_at();

-- Criar tabela webhook_events se não existir (para logs do n8n)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'webhook_events') THEN
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
    END IF;
END $$;

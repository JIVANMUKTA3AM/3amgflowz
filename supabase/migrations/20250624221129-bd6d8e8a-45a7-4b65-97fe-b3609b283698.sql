
-- Criar enum para tipos de planos (apenas se não existir)
DO $$ BEGIN
    CREATE TYPE subscription_plan_type AS ENUM ('free', 'basic', 'premium', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar enum para status de assinatura (apenas se não existir)
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'unpaid', 'incomplete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela de planos de assinatura (apenas se não existir)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type subscription_plan_type NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_amount INTEGER NOT NULL, -- em centavos
  price_currency TEXT NOT NULL DEFAULT 'BRL',
  billing_interval TEXT NOT NULL DEFAULT 'month',
  stripe_price_id TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de assinaturas dos usuários (apenas se não existir)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type subscription_plan_type NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  price_amount INTEGER,
  price_currency TEXT DEFAULT 'BRL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de histórico de assinaturas (apenas se não existir)
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  old_plan subscription_plan_type,
  new_plan subscription_plan_type,
  old_status subscription_status,
  new_status subscription_status,
  stripe_event_id TEXT,
  event_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Criar políticas apenas se não existirem
DO $$ BEGIN
    CREATE POLICY "subscription_plans_select" ON public.subscription_plans
      FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "subscriptions_select_own" ON public.subscriptions
      FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "subscriptions_insert_own" ON public.subscriptions
      FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "subscriptions_update_own" ON public.subscriptions
      FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "subscription_history_select_own" ON public.subscription_history
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.subscriptions 
          WHERE id = subscription_id AND user_id = auth.uid()
        )
      );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Função para criar histórico de assinatura
CREATE OR REPLACE FUNCTION public.create_subscription_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.subscription_history (
      subscription_id, event_type, new_plan, new_status
    ) VALUES (
      NEW.id, 'created', NEW.plan_type, NEW.status
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.plan_type != NEW.plan_type OR OLD.status != NEW.status THEN
      INSERT INTO public.subscription_history (
        subscription_id, event_type, old_plan, new_plan, old_status, new_status
      ) VALUES (
        NEW.id, 'updated', OLD.plan_type, NEW.plan_type, OLD.status, NEW.status
      );
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger apenas se não existir
DROP TRIGGER IF EXISTS subscription_history_trigger ON public.subscriptions;
CREATE TRIGGER subscription_history_trigger
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.create_subscription_history();

-- Inserir planos padrão apenas se a tabela estiver vazia
INSERT INTO public.subscription_plans (plan_type, name, description, price_amount, features, sort_order)
SELECT * FROM (VALUES
  ('free'::subscription_plan_type, 'Gratuito', 'Para começar e testar a plataforma', 0, '["2 agentes ativos", "1.000 mensagens/mês", "Suporte por email", "Integrações básicas"]'::jsonb, 1),
  ('basic'::subscription_plan_type, 'Básico', 'Para pequenas empresas', 4900, '["10 agentes ativos", "10.000 mensagens/mês", "Suporte prioritário", "Todas as integrações", "Analytics básicos"]'::jsonb, 2),
  ('premium'::subscription_plan_type, 'Premium', 'Para empresas em crescimento', 14900, '["50 agentes ativos", "50.000 mensagens/mês", "Suporte 24/7", "Analytics avançados", "Webhooks personalizados", "API completa"]'::jsonb, 3),
  ('enterprise'::subscription_plan_type, 'Enterprise', 'Para grandes organizações', 29900, '["Agentes ilimitados", "200.000 mensagens/mês", "Gerente dedicado", "Integrações customizadas", "SLA garantido", "Treinamento personalizado"]'::jsonb, 4)
) AS v(plan_type, name, description, price_amount, features, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE plan_type = v.plan_type);

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

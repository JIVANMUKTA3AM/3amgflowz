
-- Criar tabela de planos de assinatura
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type subscription_plan_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_amount INTEGER NOT NULL,
  price_currency TEXT NOT NULL DEFAULT 'BRL',
  billing_interval TEXT NOT NULL DEFAULT 'month',
  stripe_price_id TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inserir planos padrão
INSERT INTO public.subscription_plans (plan_type, name, description, price_amount, price_currency, features, sort_order, stripe_price_id) VALUES
('free', 'Gratuito', 'Plano básico gratuito', 0, 'BRL', '["1 agente IA", "100 interações/mês", "Suporte básico"]', 1, null),
('basic', 'Básico', 'Perfeito para pequenas empresas', 4900, 'BRL', '["5 agentes IA", "1.000 interações/mês", "Integrações básicas", "Suporte por email"]', 2, 'price_basic_monthly'),
('premium', 'Premium', 'Para empresas em crescimento', 14900, 'BRL', '["20 agentes IA", "10.000 interações/mês", "Todas as integrações", "Analytics avançados", "Suporte prioritário"]', 3, 'price_premium_monthly'),
('enterprise', 'Enterprise', 'Para grandes organizações', 29900, 'BRL', '["Agentes ilimitados", "Interações ilimitadas", "Integrações customizadas", "Suporte 24/7", "Gerente dedicado"]', 4, 'price_enterprise_monthly');

-- Habilitar RLS na tabela subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos vejam os planos ativos
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans
FOR SELECT USING (is_active = true);

-- Política para permitir que apenas o service role gerencie os planos
CREATE POLICY "Service role can manage subscription plans" ON public.subscription_plans
FOR ALL USING (auth.role() = 'service_role');

-- Atualizar a tabela profiles para incluir mais campos de assinatura
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"notifications": true, "theme": "system", "language": "pt-BR", "timezone": "America/Sao_Paulo"}';

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger às tabelas relevantes
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON public.subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON public.subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Criar trigger para registrar histórico de mudanças de assinatura
DROP TRIGGER IF EXISTS subscription_history_trigger ON public.subscriptions;
CREATE TRIGGER subscription_history_trigger
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION create_subscription_history();

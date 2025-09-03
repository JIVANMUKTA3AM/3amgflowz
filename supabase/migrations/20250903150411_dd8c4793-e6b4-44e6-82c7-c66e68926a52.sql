-- Create subscriptions table for managing user subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,
  price_amount INTEGER,
  price_currency TEXT NOT NULL DEFAULT 'brl',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscription_plans table for available plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price_amount INTEGER NOT NULL,
  price_currency TEXT NOT NULL DEFAULT 'brl',
  billing_interval TEXT NOT NULL DEFAULT 'month',
  stripe_price_id TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscription_history table for tracking subscription changes
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  old_plan TEXT,
  new_plan TEXT,
  old_status TEXT,
  new_status TEXT,
  stripe_event_id TEXT,
  event_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Edge functions can manage subscriptions" ON public.subscriptions
FOR ALL USING (true);

-- Create RLS policies for subscription_plans
CREATE POLICY "Everyone can view active subscription plans" ON public.subscription_plans
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create RLS policies for subscription_history
CREATE POLICY "Users can view their subscription history" ON public.subscription_history
FOR SELECT USING (
  subscription_id IN (
    SELECT id FROM public.subscriptions
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Edge functions can manage subscription history" ON public.subscription_history
FOR ALL USING (true);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default subscription plans
INSERT INTO public.subscription_plans (plan_type, name, description, price_amount, features, sort_order) VALUES
('free', 'Gratuito', 'Para testar a plataforma', 0, '["Acesso limitado à plataforma", "Suporte básico por email", "Documentação completa"]', 1),
('flow_start', 'Flow Start', 'Até 1.000 clientes', 19900, '["Até 1.000 clientes", "Agentes básicos", "Suporte por email", "Integrações básicas", "Dashboard básico"]', 2),
('flow_pro', 'Flow Pro', '1.001 a 3.000 clientes', 49900, '["1.001 a 3.000 clientes", "Todos os agentes", "Suporte prioritário", "Integrações avançadas", "Analytics básicos", "Relatórios mensais"]', 3),
('flow_power', 'Flow Power', '3.001 a 10.000 clientes', 89900, '["3.001 a 10.000 clientes", "Todos os agentes", "Suporte 24/7", "Integrações ilimitadas", "Analytics avançados", "Relatórios customizados", "API completa"]', 4),
('flow_enterprise', 'Flow Enterprise', '10.001 a 30.000 clientes', 149700, '["10.001 a 30.000 clientes", "Todos os agentes", "Suporte dedicado", "Integrações customizadas", "Analytics completos", "API completa", "White label", "Gerente de conta"]', 5),
('flow_ultra', 'Flow Ultra', 'Acima de 30.000 clientes', 0, '["Acima de 30.000 clientes", "Solução customizada", "Gerente dedicado", "Infraestrutura dedicada", "SLA garantido", "Suporte 24/7 premium", "Implementação personalizada"]', 6)
ON CONFLICT (plan_type) DO NOTHING;
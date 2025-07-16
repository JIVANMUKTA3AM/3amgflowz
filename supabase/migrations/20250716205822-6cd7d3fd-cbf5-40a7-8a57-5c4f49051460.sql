
-- Atualizar enum de tipos de plano para incluir os novos planos
ALTER TYPE subscription_plan_type ADD VALUE IF NOT EXISTS 'flow_start';
ALTER TYPE subscription_plan_type ADD VALUE IF NOT EXISTS 'flow_pro';
ALTER TYPE subscription_plan_type ADD VALUE IF NOT EXISTS 'flow_power';
ALTER TYPE subscription_plan_type ADD VALUE IF NOT EXISTS 'flow_enterprise';
ALTER TYPE subscription_plan_type ADD VALUE IF NOT EXISTS 'flow_ultra';

-- Limpar planos antigos e inserir novos planos baseados em faixas de assinantes
DELETE FROM public.subscription_plans;

INSERT INTO public.subscription_plans (plan_type, name, description, price_amount, price_currency, features, sort_order, stripe_price_id) VALUES
('free', 'Gratuito', 'Plano de teste', 0, 'BRL', '["Acesso limitado", "Suporte básico"]', 1, null),
('flow_start', 'Flow Start', 'Até 1.000 clientes', 19900, 'BRL', '["Até 1.000 clientes", "Agentes básicos", "Suporte por email", "Integrações básicas"]', 2, 'price_flow_start'),
('flow_pro', 'Flow Pro', '1.001 a 3.000 clientes', 49900, 'BRL', '["1.001 a 3.000 clientes", "Todos os agentes", "Suporte prioritário", "Integrações avançadas", "Analytics básicos"]', 3, 'price_flow_pro'),
('flow_power', 'Flow Power', '3.001 a 10.000 clientes', 89900, 'BRL', '["3.001 a 10.000 clientes", "Todos os agentes", "Suporte 24/7", "Integrações ilimitadas", "Analytics avançados", "Relatórios customizados"]', 4, 'price_flow_power'),
('flow_enterprise', 'Flow Enterprise', '10.001 a 30.000 clientes', 149700, 'BRL', '["10.001 a 30.000 clientes", "Todos os agentes", "Suporte dedicado", "Integrações customizadas", "Analytics completos", "API completa", "White label"]', 5, 'price_flow_enterprise'),
('flow_ultra', 'Flow Ultra', 'Acima de 30.000 clientes', 0, 'BRL', '["Acima de 30.000 clientes", "Solução customizada", "Gerente dedicado", "Infraestrutura dedicada", "SLA garantido"]', 6, null);

-- Adicionar campo para número de assinantes no onboarding
ALTER TABLE public.onboarding_configurations 
ADD COLUMN IF NOT EXISTS numero_assinantes INTEGER DEFAULT 0;

-- Adicionar campo para número de assinantes nas assinaturas
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS numero_assinantes INTEGER DEFAULT 0;

-- Função para determinar o plano baseado no número de assinantes
CREATE OR REPLACE FUNCTION public.get_plan_by_subscribers(subscriber_count INTEGER)
RETURNS subscription_plan_type
LANGUAGE plpgsql
AS $$
BEGIN
  IF subscriber_count <= 1000 THEN
    RETURN 'flow_start';
  ELSIF subscriber_count <= 3000 THEN
    RETURN 'flow_pro';
  ELSIF subscriber_count <= 10000 THEN
    RETURN 'flow_power';
  ELSIF subscriber_count <= 30000 THEN
    RETURN 'flow_enterprise';
  ELSE
    RETURN 'flow_ultra';
  END IF;
END;
$$;

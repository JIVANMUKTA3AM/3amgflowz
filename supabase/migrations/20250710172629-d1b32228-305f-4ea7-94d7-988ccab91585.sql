-- Criar tabelas para funcionalidades gerais do SaaS

-- 1. SISTEMA DE PAGAMENTOS
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  method_type TEXT NOT NULL, -- 'stripe', 'pix', 'boleto', 'credit_card'
  provider TEXT NOT NULL, -- 'stripe', 'mercado_pago', etc.
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  payment_method_id UUID REFERENCES public.payment_methods(id),
  external_transaction_id TEXT, -- ID do provedor (Stripe, etc.)
  amount INTEGER NOT NULL, -- em centavos
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
  transaction_type TEXT NOT NULL, -- 'payment', 'refund', 'chargeback'
  description TEXT,
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. SISTEMA DE NOTIFICAÇÕES
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'email', 'sms', 'whatsapp', 'system'
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- variáveis disponíveis no template
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  template_id UUID REFERENCES public.notification_templates(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL, -- 'info', 'warning', 'error', 'success'
  channel TEXT NOT NULL, -- 'email', 'sms', 'whatsapp', 'system'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
  read_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  whatsapp_enabled BOOLEAN DEFAULT false,
  system_enabled BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 3. CRM E GESTÃO DE CLIENTES
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- proprietário/agente responsável
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT, -- CPF/CNPJ
  address JSONB DEFAULT '{}',
  company_name TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'prospect', 'churned'
  segment TEXT, -- 'enterprise', 'small_business', 'individual'
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.client_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- quem fez a interação
  interaction_type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'support', 'sale'
  subject TEXT,
  description TEXT,
  outcome TEXT, -- resultado da interação
  next_action TEXT,
  next_action_date TIMESTAMPTZ,
  duration_minutes INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sales_pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- responsável
  opportunity_name TEXT NOT NULL,
  stage TEXT NOT NULL, -- 'lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  value DECIMAL(15,2),
  probability DECIMAL(5,2), -- 0.00 a 100.00
  expected_close_date DATE,
  actual_close_date DATE,
  source TEXT, -- origem do lead
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. MÉTRICAS E RELATÓRIOS
CREATE TABLE public.dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,4),
  metric_type TEXT NOT NULL, -- 'revenue', 'clients', 'conversion_rate', etc.
  period_type TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'yearly'
  period_date DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, metric_name, period_type, period_date)
);

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'financial', 'clients', 'performance', 'custom'
  parameters JSONB DEFAULT '{}',
  data JSONB,
  file_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'generating', 'completed', 'failed'
  generated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. AUTOMAÇÕES
CREATE TABLE public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- 'schedule', 'event', 'condition'
  trigger_config JSONB NOT NULL,
  action_type TEXT NOT NULL, -- 'notification', 'webhook', 'update_record'
  action_config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMPTZ,
  execution_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES public.automation_rules(id) ON DELETE CASCADE,
  execution_status TEXT NOT NULL, -- 'success', 'failed', 'skipped'
  trigger_data JSONB,
  result_data JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CONFIGURAÇÕES DO SISTEMA
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL, -- 'string', 'number', 'boolean', 'object'
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, setting_key)
);

-- HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS BÁSICAS (usuários só veem seus próprios dados)
-- Payment Methods
CREATE POLICY "Users can manage their own payment methods" ON public.payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Payment Transactions  
CREATE POLICY "Users can view their own transactions" ON public.payment_transactions
  FOR ALL USING (auth.uid() = user_id);

-- Notification Templates (admins podem gerenciar todos)
CREATE POLICY "Admins can manage notification templates" ON public.notification_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can view notification templates" ON public.notification_templates
  FOR SELECT USING (is_active = true);

-- Notifications
CREATE POLICY "Users can manage their own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Notification Settings
CREATE POLICY "Users can manage their own notification settings" ON public.notification_settings
  FOR ALL USING (auth.uid() = user_id);

-- Clients
CREATE POLICY "Users can manage their own clients" ON public.clients
  FOR ALL USING (auth.uid() = user_id);

-- Client Interactions
CREATE POLICY "Users can manage interactions with their clients" ON public.client_interactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = client_interactions.client_id AND clients.user_id = auth.uid())
  );

-- Sales Pipeline
CREATE POLICY "Users can manage their own sales pipeline" ON public.sales_pipeline
  FOR ALL USING (
    EXISTS (SELECT 1 FROM clients WHERE clients.id = sales_pipeline.client_id AND clients.user_id = auth.uid())
  );

-- Dashboard Metrics
CREATE POLICY "Users can manage their own metrics" ON public.dashboard_metrics
  FOR ALL USING (auth.uid() = user_id);

-- Reports
CREATE POLICY "Users can manage their own reports" ON public.reports
  FOR ALL USING (auth.uid() = user_id);

-- Automation Rules
CREATE POLICY "Users can manage their own automation rules" ON public.automation_rules
  FOR ALL USING (auth.uid() = user_id);

-- Automation Logs
CREATE POLICY "Users can view logs of their automation rules" ON public.automation_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM automation_rules WHERE automation_rules.id = automation_logs.rule_id AND automation_rules.user_id = auth.uid())
  );

-- System Settings
CREATE POLICY "Users can manage their own settings" ON public.system_settings
  FOR ALL USING (auth.uid() = user_id);

-- TRIGGERS PARA UPDATED_AT
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_pipeline_updated_at
  BEFORE UPDATE ON public.sales_pipeline
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at
  BEFORE UPDATE ON public.automation_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_client_interactions_client_id ON public.client_interactions(client_id);
CREATE INDEX idx_sales_pipeline_client_id ON public.sales_pipeline(client_id);
CREATE INDEX idx_dashboard_metrics_user_period ON public.dashboard_metrics(user_id, period_type, period_date);
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_automation_rules_user_id ON public.automation_rules(user_id);
CREATE INDEX idx_automation_logs_rule_id ON public.automation_logs(rule_id);
CREATE INDEX idx_system_settings_user_key ON public.system_settings(user_id, setting_key);
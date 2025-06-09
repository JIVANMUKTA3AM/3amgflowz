
-- Tabela para armazenar configurações de workflows dos agentes
CREATE TABLE public.agent_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_configuration_id UUID NOT NULL REFERENCES public.agent_configurations(id) ON DELETE CASCADE,
  workflow_name TEXT NOT NULL,
  workflow_type TEXT NOT NULL, -- 'n8n', 'zapier', 'custom'
  webhook_url TEXT,
  webhook_secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para logs de execução dos workflows
CREATE TABLE public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.agent_workflows(id) ON DELETE CASCADE,
  agent_configuration_id UUID NOT NULL REFERENCES public.agent_configurations(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL, -- 'webhook', 'scheduled', 'manual', 'conversation'
  trigger_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'success', 'error', 'timeout'
  execution_time_ms INTEGER,
  result_data JSONB DEFAULT '{}',
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela para integrações específicas dos agentes
CREATE TABLE public.agent_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_configuration_id UUID NOT NULL REFERENCES public.agent_configurations(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL, -- 'whatsapp', 'slack', 'email', 'crm', 'database'
  integration_name TEXT NOT NULL,
  api_credentials JSONB DEFAULT '{}', -- dados criptografados das credenciais
  webhook_endpoints JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para dados de automação específicos por agente
CREATE TABLE public.automation_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_configuration_id UUID NOT NULL REFERENCES public.agent_configurations(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL, -- 'customer', 'lead', 'ticket', 'product', 'custom'
  data_key TEXT NOT NULL,
  data_value JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_agent_workflows_agent_id ON public.agent_workflows(agent_configuration_id);
CREATE INDEX idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status);
CREATE INDEX idx_agent_integrations_agent_id ON public.agent_integrations(agent_configuration_id);
CREATE INDEX idx_agent_integrations_type ON public.agent_integrations(integration_type);
CREATE INDEX idx_automation_data_agent_id ON public.automation_data(agent_configuration_id);
CREATE INDEX idx_automation_data_type_key ON public.automation_data(data_type, data_key);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.agent_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_data ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para agent_workflows
CREATE POLICY "Users can manage their agent workflows" ON public.agent_workflows
  USING (agent_configuration_id IN (
    SELECT id FROM public.agent_configurations WHERE user_id = auth.uid()
  ));

-- Políticas RLS para workflow_executions
CREATE POLICY "Users can view their workflow executions" ON public.workflow_executions
  USING (agent_configuration_id IN (
    SELECT id FROM public.agent_configurations WHERE user_id = auth.uid()
  ));

-- Políticas RLS para agent_integrations
CREATE POLICY "Users can manage their agent integrations" ON public.agent_integrations
  USING (agent_configuration_id IN (
    SELECT id FROM public.agent_configurations WHERE user_id = auth.uid()
  ));

-- Políticas RLS para automation_data
CREATE POLICY "Users can manage their automation data" ON public.automation_data
  USING (agent_configuration_id IN (
    SELECT id FROM public.agent_configurations WHERE user_id = auth.uid()
  ));

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_agent_workflows_updated_at
  BEFORE UPDATE ON public.agent_workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_integrations_updated_at
  BEFORE UPDATE ON public.agent_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_data_updated_at
  BEFORE UPDATE ON public.automation_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Criar enum para tipos de usuário/agente
CREATE TYPE public.user_role_type AS ENUM ('tecnico', 'comercial', 'geral', 'admin');

-- Criar enum para status de atividade
CREATE TYPE public.atividade_status AS ENUM ('pendente', 'em_andamento', 'concluida', 'cancelada', 'pausada');

-- Criar enum para prioridade
CREATE TYPE public.prioridade_level AS ENUM ('baixa', 'media', 'alta', 'urgente');

-- Criar enum para tipos de evento
CREATE TYPE public.evento_type AS ENUM ('novo_ticket', 'conclusao_servico', 'venda_concluida', 'instalacao_agendada', 'pagamento_recebido', 'cliente_cadastrado');

-- Atualizar tabela profiles para incluir user_role_type
ALTER TABLE public.profiles 
ADD COLUMN user_role_type public.user_role_type DEFAULT 'geral';

-- Tabela de tickets técnicos
CREATE TABLE public.tickets_tecnicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id),
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT,
  cliente_endereco TEXT,
  tipo_servico TEXT NOT NULL, -- instalacao, manutencao, reparo
  descricao TEXT NOT NULL,
  status public.atividade_status DEFAULT 'pendente',
  prioridade public.prioridade_level DEFAULT 'media',
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_conclusao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de propostas comerciais
CREATE TABLE public.propostas_comerciais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id),
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT,
  cliente_telefone TEXT,
  plano_interesse TEXT NOT NULL,
  valor_proposto DECIMAL(10,2),
  status public.atividade_status DEFAULT 'pendente',
  prioridade public.prioridade_level DEFAULT 'media',
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_conclusao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de atendimentos gerais
CREATE TABLE public.atendimentos_gerais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id),
  cliente_nome TEXT NOT NULL,
  cliente_contato TEXT,
  tipo_atendimento TEXT NOT NULL, -- duvida, reclamacao, suporte, informacao
  descricao TEXT NOT NULL,
  status public.atividade_status DEFAULT 'pendente',
  prioridade public.prioridade_level DEFAULT 'media',
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_conclusao TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de webhooks
CREATE TABLE public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  url_destino TEXT NOT NULL,
  evento public.evento_type NOT NULL,
  headers JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de logs de webhooks
CREATE TABLE public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id UUID NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
  status_http INTEGER,
  payload_enviado JSONB,
  resposta_recebida JSONB,
  timestamp_execucao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  erro_message TEXT
);

-- Tabela de integrações n8n
CREATE TABLE public.integracoes_n8n (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  webhook_url TEXT NOT NULL,
  evento_associado public.evento_type NOT NULL,
  tipo_execucao TEXT CHECK (tipo_execucao IN ('automatico', 'manual')) DEFAULT 'automatico',
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de logs de execução n8n
CREATE TABLE public.n8n_execution_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integracao_id UUID NOT NULL REFERENCES public.integracoes_n8n(id) ON DELETE CASCADE,
  status_resposta INTEGER,
  payload_enviado JSONB,
  resposta_recebida JSONB,
  timestamp_execucao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  executado_por UUID REFERENCES auth.users(id),
  tipo_execucao TEXT CHECK (tipo_execucao IN ('automatico', 'manual')),
  erro_message TEXT
);

-- Índices para performance
CREATE INDEX idx_tickets_agent_status ON public.tickets_tecnicos(agent_id, status);
CREATE INDEX idx_propostas_agent_status ON public.propostas_comerciais(agent_id, status);
CREATE INDEX idx_atendimentos_agent_status ON public.atendimentos_gerais(agent_id, status);
CREATE INDEX idx_webhooks_evento ON public.webhooks(evento);
CREATE INDEX idx_integracoes_evento ON public.integracoes_n8n(evento_associado);

-- RLS Policies para tickets técnicos
ALTER TABLE public.tickets_tecnicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agentes técnicos podem gerenciar seus tickets" ON public.tickets_tecnicos
  USING (
    agent_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role_type = 'admin')
  );

-- RLS Policies para propostas comerciais
ALTER TABLE public.propostas_comerciais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agentes comerciais podem gerenciar suas propostas" ON public.propostas_comerciais
  USING (
    agent_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role_type = 'admin')
  );

-- RLS Policies para atendimentos gerais
ALTER TABLE public.atendimentos_gerais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agentes gerais podem gerenciar seus atendimentos" ON public.atendimentos_gerais
  USING (
    agent_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role_type = 'admin')
  );

-- RLS Policies para webhooks (apenas admins)
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admins podem gerenciar webhooks" ON public.webhooks
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role_type = 'admin'));

-- RLS Policies para integrações n8n (apenas admins)
ALTER TABLE public.integracoes_n8n ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admins podem gerenciar integrações n8n" ON public.integracoes_n8n
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role_type = 'admin'));

-- RLS Policies para logs (visualização para admins)
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins podem visualizar logs de webhooks" ON public.webhook_logs
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role_type = 'admin'));

ALTER TABLE public.n8n_execution_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins podem visualizar logs de n8n" ON public.n8n_execution_logs
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role_type = 'admin'));

-- Triggers para updated_at
CREATE TRIGGER update_tickets_tecnicos_updated_at
  BEFORE UPDATE ON public.tickets_tecnicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_propostas_comerciais_updated_at
  BEFORE UPDATE ON public.propostas_comerciais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_atendimentos_gerais_updated_at
  BEFORE UPDATE ON public.atendimentos_gerais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integracoes_n8n_updated_at
  BEFORE UPDATE ON public.integracoes_n8n
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

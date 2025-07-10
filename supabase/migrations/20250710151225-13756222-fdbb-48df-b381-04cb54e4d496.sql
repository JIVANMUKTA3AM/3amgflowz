-- Tabela de mensalidades para controle de assinaturas/planos
CREATE TABLE public.mensalidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id UUID REFERENCES auth.users(id),
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT,
  cliente_telefone TEXT,
  plano_tipo TEXT NOT NULL,
  valor_mensal DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
  metodo_pagamento TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de histórico financeiro para auditoria
CREATE TABLE public.historico_financeiro (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id UUID REFERENCES auth.users(id),
  tipo_transacao TEXT NOT NULL CHECK (tipo_transacao IN ('pagamento', 'estorno', 'desconto', 'multa', 'cancelamento')),
  referencia_id UUID, -- pode referenciar mensalidades, invoices, etc
  referencia_tipo TEXT, -- 'mensalidade', 'invoice', 'servico'
  valor DECIMAL(10,2) NOT NULL,
  descricao TEXT NOT NULL,
  metodo_pagamento TEXT,
  data_transacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_processamento TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'processando' CHECK (status IN ('processando', 'concluido', 'falhou', 'cancelado')),
  dados_extras JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Melhorar tabela de faturas existente para integração com agente técnico
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES auth.users(id);
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS cliente_nome TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS cliente_telefone TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS servico_tipo TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS dados_servico JSONB DEFAULT '{}';

-- Enable RLS
ALTER TABLE public.mensalidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_financeiro ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para mensalidades
CREATE POLICY "Agentes técnicos podem gerenciar mensalidades dos seus clientes" 
ON public.mensalidades 
FOR ALL 
USING (
  agent_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_role_type IN ('admin', 'tecnico')
  )
);

CREATE POLICY "Usuários podem ver suas próprias mensalidades" 
ON public.mensalidades 
FOR SELECT 
USING (user_id = auth.uid());

-- Políticas RLS para histórico financeiro
CREATE POLICY "Agentes técnicos podem ver histórico dos seus clientes" 
ON public.historico_financeiro 
FOR SELECT 
USING (
  agent_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_role_type IN ('admin', 'tecnico')
  )
);

CREATE POLICY "Sistema pode inserir no histórico financeiro" 
ON public.historico_financeiro 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários podem ver seu próprio histórico" 
ON public.historico_financeiro 
FOR SELECT 
USING (user_id = auth.uid());

-- Políticas RLS adicionais para invoices
CREATE POLICY "Agentes técnicos podem gerenciar faturas dos seus clientes" 
ON public.invoices 
FOR ALL 
USING (
  agent_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_role_type IN ('admin', 'tecnico')
  )
);

-- Triggers para updated_at
CREATE TRIGGER update_mensalidades_updated_at
  BEFORE UPDATE ON public.mensalidades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_mensalidades_agent_id ON public.mensalidades(agent_id);
CREATE INDEX idx_mensalidades_user_id ON public.mensalidades(user_id);
CREATE INDEX idx_mensalidades_status ON public.mensalidades(status);
CREATE INDEX idx_mensalidades_vencimento ON public.mensalidades(data_vencimento);

CREATE INDEX idx_historico_financeiro_agent_id ON public.historico_financeiro(agent_id);
CREATE INDEX idx_historico_financeiro_user_id ON public.historico_financeiro(user_id);
CREATE INDEX idx_historico_financeiro_tipo ON public.historico_financeiro(tipo_transacao);
CREATE INDEX idx_historico_financeiro_referencia ON public.historico_financeiro(referencia_id, referencia_tipo);

CREATE INDEX idx_invoices_agent_id ON public.invoices(agent_id);
-- Excluir tabelas anteriores
DROP TABLE IF EXISTS public.mensalidades CASCADE;
DROP TABLE IF EXISTS public.historico_financeiro CASCADE;

-- Reverter alterações na tabela invoices
ALTER TABLE public.invoices DROP COLUMN IF EXISTS agent_id;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS cliente_nome;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS cliente_telefone;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS servico_tipo;
ALTER TABLE public.invoices DROP COLUMN IF EXISTS dados_servico;

-- Tabela principal de faturas com controle de atraso
CREATE TABLE public.faturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  agent_id UUID REFERENCES auth.users(id),
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT,
  cliente_telefone TEXT,
  cliente_endereco TEXT,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'atrasada', 'cancelada', 'negociada')),
  dias_atraso INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN status = 'paga' THEN 0
      WHEN CURRENT_DATE > data_vencimento THEN CURRENT_DATE - data_vencimento
      ELSE 0
    END
  ) STORED,
  metodo_pagamento TEXT,
  descricao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de histórico de consultas e ações
CREATE TABLE public.historico_consultas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fatura_id UUID NOT NULL REFERENCES public.faturas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  agent_id UUID REFERENCES auth.users(id),
  tipo_acao TEXT NOT NULL CHECK (tipo_acao IN ('consulta', 'pagamento', 'negociacao', 'cancelamento', 'ajuste')),
  detalhes TEXT,
  valor_anterior DECIMAL(10,2),
  valor_novo DECIMAL(10,2),
  data_anterior DATE,
  data_nova DATE,
  executado_por UUID REFERENCES auth.users(id),
  timestamp_acao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dados_extras JSONB DEFAULT '{}'
);

-- Tabela específica para negociações de atraso
CREATE TABLE public.negociacoes_atraso (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fatura_id UUID NOT NULL REFERENCES public.faturas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  agent_id UUID REFERENCES auth.users(id),
  dias_atraso_original INTEGER NOT NULL,
  data_vencimento_original DATE NOT NULL,
  nova_data_vencimento DATE NOT NULL,
  valor_original DECIMAL(10,2) NOT NULL,
  valor_negociado DECIMAL(10,2),
  desconto_aplicado DECIMAL(10,2) DEFAULT 0,
  multa_aplicada DECIMAL(10,2) DEFAULT 0,
  juros_aplicados DECIMAL(10,2) DEFAULT 0,
  motivo_negociacao TEXT,
  termos_acordo TEXT,
  status_negociacao TEXT NOT NULL DEFAULT 'ativa' CHECK (status_negociacao IN ('ativa', 'cumprida', 'quebrada', 'cancelada')),
  data_negociacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_limite_acordo DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negociacoes_atraso ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para faturas
CREATE POLICY "Agentes técnicos podem gerenciar faturas dos seus clientes" 
ON public.faturas 
FOR ALL 
USING (
  agent_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_role_type IN ('admin', 'tecnico')
  )
);

CREATE POLICY "Usuários podem ver suas próprias faturas" 
ON public.faturas 
FOR SELECT 
USING (user_id = auth.uid());

-- Políticas RLS para histórico de consultas
CREATE POLICY "Agentes técnicos podem ver histórico dos seus clientes" 
ON public.historico_consultas 
FOR SELECT 
USING (
  agent_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_role_type IN ('admin', 'tecnico')
  )
);

CREATE POLICY "Sistema pode inserir no histórico" 
ON public.historico_consultas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários podem ver seu próprio histórico" 
ON public.historico_consultas 
FOR SELECT 
USING (user_id = auth.uid());

-- Políticas RLS para negociações de atraso
CREATE POLICY "Agentes técnicos podem gerenciar negociações dos seus clientes" 
ON public.negociacoes_atraso 
FOR ALL 
USING (
  agent_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.user_role_type IN ('admin', 'tecnico')
  )
);

CREATE POLICY "Usuários podem ver suas próprias negociações" 
ON public.negociacoes_atraso 
FOR SELECT 
USING (user_id = auth.uid());

-- Função para atualizar status automaticamente baseado em atraso
CREATE OR REPLACE FUNCTION public.atualizar_status_faturas()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar status para atrasada se passou da data de vencimento
  UPDATE public.faturas 
  SET status = 'atrasada',
      updated_at = now()
  WHERE status = 'pendente' 
    AND data_vencimento < CURRENT_DATE
    AND data_pagamento IS NULL;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar status automaticamente
CREATE TRIGGER trigger_atualizar_status_faturas
  AFTER INSERT OR UPDATE ON public.faturas
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.atualizar_status_faturas();

-- Função para registrar automaticamente no histórico
CREATE OR REPLACE FUNCTION public.registrar_historico_faturas()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Registrar mudanças no histórico
    INSERT INTO public.historico_consultas (
      fatura_id, user_id, agent_id, tipo_acao, detalhes,
      valor_anterior, valor_novo, data_anterior, data_nova,
      executado_por, dados_extras
    ) VALUES (
      NEW.id, NEW.user_id, NEW.agent_id,
      CASE 
        WHEN OLD.status != NEW.status THEN 'ajuste'
        WHEN OLD.data_pagamento IS NULL AND NEW.data_pagamento IS NOT NULL THEN 'pagamento'
        ELSE 'consulta'
      END,
      'Status alterado de ' || OLD.status || ' para ' || NEW.status,
      OLD.valor, NEW.valor, OLD.data_vencimento, NEW.data_vencimento,
      auth.uid(),
      jsonb_build_object(
        'status_anterior', OLD.status,
        'status_novo', NEW.status,
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para histórico automático
CREATE TRIGGER trigger_historico_faturas
  AFTER UPDATE ON public.faturas
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_historico_faturas();

-- Triggers para updated_at
CREATE TRIGGER update_faturas_updated_at
  BEFORE UPDATE ON public.faturas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_negociacoes_atraso_updated_at
  BEFORE UPDATE ON public.negociacoes_atraso
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_faturas_agent_id ON public.faturas(agent_id);
CREATE INDEX idx_faturas_user_id ON public.faturas(user_id);
CREATE INDEX idx_faturas_status ON public.faturas(status);
CREATE INDEX idx_faturas_vencimento ON public.faturas(data_vencimento);
CREATE INDEX idx_faturas_atraso ON public.faturas(dias_atraso) WHERE dias_atraso > 0;

CREATE INDEX idx_historico_consultas_fatura_id ON public.historico_consultas(fatura_id);
CREATE INDEX idx_historico_consultas_agent_id ON public.historico_consultas(agent_id);
CREATE INDEX idx_historico_consultas_tipo ON public.historico_consultas(tipo_acao);

CREATE INDEX idx_negociacoes_atraso_fatura_id ON public.negociacoes_atraso(fatura_id);
CREATE INDEX idx_negociacoes_atraso_agent_id ON public.negociacoes_atraso(agent_id);
CREATE INDEX idx_negociacoes_atraso_status ON public.negociacoes_atraso(status_negociacao);

-- View para consultas facilitadas de atrasos
CREATE VIEW public.view_faturas_atraso AS
SELECT 
  f.*,
  n.nova_data_vencimento,
  n.valor_negociado,
  n.status_negociacao,
  n.motivo_negociacao,
  CASE 
    WHEN f.status = 'atrasada' AND f.dias_atraso <= 30 THEN 'Atraso Leve'
    WHEN f.status = 'atrasada' AND f.dias_atraso <= 60 THEN 'Atraso Moderado'
    WHEN f.status = 'atrasada' AND f.dias_atraso > 60 THEN 'Atraso Grave'
    ELSE 'Em Dia'
  END as categoria_atraso
FROM public.faturas f
LEFT JOIN public.negociacoes_atraso n ON f.id = n.fatura_id AND n.status_negociacao = 'ativa'
WHERE f.status IN ('pendente', 'atrasada', 'negociada');
-- Tabela para armazenar configurações de API fiscal por provedor
CREATE TABLE IF NOT EXISTS fiscal_api_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('nfeio', 'enotas', 'other')),
  api_token TEXT NOT NULL,
  api_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, organization_id, provider)
);

-- Tabela para armazenar notas fiscais emitidas
CREATE TABLE IF NOT EXISTS fiscal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  note_number TEXT,
  note_key TEXT,
  pdf_url TEXT,
  xml_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'issued', 'error', 'cancelled')),
  error_message TEXT,
  external_id TEXT,
  issued_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_fiscal_api_configs_user ON fiscal_api_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_api_configs_org ON fiscal_api_configs(organization_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_notes_user ON fiscal_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_notes_invoice ON fiscal_notes(invoice_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_notes_status ON fiscal_notes(status);

-- RLS Policies para fiscal_api_configs
ALTER TABLE fiscal_api_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own fiscal API configs"
  ON fiscal_api_configs
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Organization members can view fiscal API configs"
  ON fiscal_api_configs
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- RLS Policies para fiscal_notes
ALTER TABLE fiscal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own fiscal notes"
  ON fiscal_notes
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Organization members can view fiscal notes"
  ON fiscal_notes
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM memberships WHERE user_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_fiscal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fiscal_api_configs_updated_at
  BEFORE UPDATE ON fiscal_api_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_fiscal_updated_at();

CREATE TRIGGER update_fiscal_notes_updated_at
  BEFORE UPDATE ON fiscal_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_fiscal_updated_at();
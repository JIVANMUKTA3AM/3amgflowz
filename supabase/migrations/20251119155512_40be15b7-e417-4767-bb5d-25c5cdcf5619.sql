-- Adicionar campos fiscais obrigatórios na tabela fiscal_api_configs
ALTER TABLE fiscal_api_configs
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS razao_social TEXT,
ADD COLUMN IF NOT EXISTS nome_fantasia TEXT,
ADD COLUMN IF NOT EXISTS inscricao_municipal TEXT,
ADD COLUMN IF NOT EXISTS inscricao_estadual TEXT,
ADD COLUMN IF NOT EXISTS cnae TEXT,
ADD COLUMN IF NOT EXISTS codigo_servico TEXT,
ADD COLUMN IF NOT EXISTS tipo_nota TEXT CHECK (tipo_nota IN ('nfe', 'nfse')) DEFAULT 'nfse',
ADD COLUMN IF NOT EXISTS regime_tributario TEXT CHECK (regime_tributario IN ('simples_nacional', 'mei', 'normal')) DEFAULT 'simples_nacional',
ADD COLUMN IF NOT EXISTS serie_nota TEXT DEFAULT '1',
ADD COLUMN IF NOT EXISTS natureza_operacao TEXT DEFAULT 'Prestação de serviços',
ADD COLUMN IF NOT EXISTS endereco_rua TEXT,
ADD COLUMN IF NOT EXISTS endereco_numero TEXT,
ADD COLUMN IF NOT EXISTS endereco_complemento TEXT,
ADD COLUMN IF NOT EXISTS endereco_bairro TEXT,
ADD COLUMN IF NOT EXISTS endereco_cidade TEXT,
ADD COLUMN IF NOT EXISTS endereco_estado TEXT,
ADD COLUMN IF NOT EXISTS endereco_cep TEXT;

-- Adicionar campo de série na tabela fiscal_notes
ALTER TABLE fiscal_notes
ADD COLUMN IF NOT EXISTS serie TEXT DEFAULT '1',
ADD COLUMN IF NOT EXISTS competencia TEXT;

-- Criar índice para busca por CNPJ
CREATE INDEX IF NOT EXISTS idx_fiscal_api_configs_cnpj ON fiscal_api_configs(cnpj);

-- Comentários para documentação
COMMENT ON COLUMN fiscal_api_configs.cnpj IS 'CNPJ da empresa emissora (formato: 00.000.000/0000-00)';
COMMENT ON COLUMN fiscal_api_configs.tipo_nota IS 'Tipo de nota: nfe (Nota Fiscal Eletrônica) ou nfse (Nota Fiscal de Serviço Eletrônica)';
COMMENT ON COLUMN fiscal_api_configs.regime_tributario IS 'Regime tributário da empresa: simples_nacional, mei ou normal';
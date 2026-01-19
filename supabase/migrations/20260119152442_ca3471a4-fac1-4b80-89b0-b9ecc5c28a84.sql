
-- ============================================
-- MIGRAÇÃO: Limpeza e Consolidação do Banco
-- Data: 2026-01-19
-- Descrição: Remove tabelas duplicadas e consolida estruturas
-- ============================================

-- ============================================
-- PARTE 1: BACKUP DE ESTRUTURA (DDL apenas)
-- ============================================
-- Nota: O banco está vazio, então apenas precisamos reorganizar a estrutura

-- ============================================
-- PARTE 2: REMOVER TABELAS OBSOLETAS
-- ============================================

-- 2.1 Remover foreign keys que referenciam tabelas a serem deletadas
ALTER TABLE IF EXISTS fiscal_api_configs DROP CONSTRAINT IF EXISTS fiscal_api_configs_organization_id_fkey;
ALTER TABLE IF EXISTS fiscal_notes DROP CONSTRAINT IF EXISTS fiscal_notes_organization_id_fkey;
ALTER TABLE IF EXISTS invoices DROP CONSTRAINT IF EXISTS invoices_organization_id_fkey;
ALTER TABLE IF EXISTS planos_provedores DROP CONSTRAINT IF EXISTS planos_provedores_provedor_id_fkey;
ALTER TABLE IF EXISTS n8n_execution_logs DROP CONSTRAINT IF EXISTS n8n_execution_logs_integracao_id_fkey;

-- 2.2 Remover policies das tabelas a serem deletadas
DROP POLICY IF EXISTS "Users can manage their own agendamentos" ON "Agendamentos";
DROP POLICY IF EXISTS "Proprietários podem gerenciar memberships de suas organizaçõ" ON memberships;
DROP POLICY IF EXISTS "Usuários podem gerenciar seus próprios memberships" ON memberships;
DROP POLICY IF EXISTS "Usuários podem ver memberships de suas organizações" ON memberships;
DROP POLICY IF EXISTS "Allow inserts from n8n and public sources" ON messages;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON messages;
DROP POLICY IF EXISTS "Agentes técnicos podem gerenciar mensalidades dos seus cliente" ON mensalidades;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias mensalidades" ON mensalidades;

-- 2.3 Remover tabelas obsoletas
DROP TABLE IF EXISTS "Agendamentos" CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS mensalidades CASCADE;
DROP TABLE IF EXISTS providers CASCADE;
DROP TABLE IF EXISTS provider_agents CASCADE;
DROP TABLE IF EXISTS provider_integrations CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;

-- ============================================
-- PARTE 3: CONSOLIDAR ESTRUTURAS
-- ============================================

-- 3.1 Adicionar campos de provider na tabela tenants (consolidando providers)
ALTER TABLE tenants 
  ADD COLUMN IF NOT EXISTS cnpj TEXT,
  ADD COLUMN IF NOT EXISTS razao_social TEXT,
  ADD COLUMN IF NOT EXISTS nome_fantasia TEXT,
  ADD COLUMN IF NOT EXISTS email_contato TEXT,
  ADD COLUMN IF NOT EXISTS telefone_contato TEXT,
  ADD COLUMN IF NOT EXISTS endereco JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS configuracoes_provedor JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS numero_assinantes INTEGER DEFAULT 0;

-- 3.2 Adicionar campos de user_agents em tenant_memberships
ALTER TABLE tenant_memberships
  ADD COLUMN IF NOT EXISTS agent_permissions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS assigned_agents TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS can_manage_agents BOOLEAN DEFAULT false;

-- 3.3 Consolidar tenant_plans em subscription_plans (adicionar tenant_id)
ALTER TABLE subscription_plans
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id),
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS custom_features JSONB DEFAULT '{}'::jsonb;

-- 3.4 Consolidar historico_financeiro em payment_transactions
ALTER TABLE payment_transactions
  ADD COLUMN IF NOT EXISTS referencia_tipo TEXT,
  ADD COLUMN IF NOT EXISTS referencia_id UUID,
  ADD COLUMN IF NOT EXISTS agent_id UUID,
  ADD COLUMN IF NOT EXISTS dados_extras JSONB DEFAULT '{}'::jsonb;

-- 3.5 Consolidar provider_integrations em agent_integrations
ALTER TABLE agent_integrations
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id),
  ADD COLUMN IF NOT EXISTS provider_config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS erp_config JSONB DEFAULT '{}'::jsonb;

-- 3.6 Atualizar fiscal_api_configs para usar tenant_id em vez de organization_id
ALTER TABLE fiscal_api_configs
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- 3.7 Atualizar fiscal_notes para usar tenant_id
ALTER TABLE fiscal_notes
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- 3.8 Atualizar invoices para usar tenant_id
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- ============================================
-- PARTE 4: REMOVER TABELA tenant_plans (consolidada em subscription_plans)
-- ============================================
DROP TABLE IF EXISTS tenant_plans CASCADE;

-- ============================================
-- PARTE 5: REMOVER TABELA user_agents (consolidada em tenant_memberships)
-- ============================================
DROP TABLE IF EXISTS user_agents CASCADE;

-- ============================================
-- PARTE 6: REMOVER TABELA historico_financeiro (consolidada em payment_transactions)
-- ============================================
DROP POLICY IF EXISTS "Agentes técnicos podem ver histórico dos seus clientes" ON historico_financeiro;
DROP POLICY IF EXISTS "Sistema pode inserir no histórico financeiro" ON historico_financeiro;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio histórico" ON historico_financeiro;
DROP TABLE IF EXISTS historico_financeiro CASCADE;

-- ============================================
-- PARTE 7: CRIAR ÍNDICES PARA NOVAS COLUNAS
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tenants_cnpj ON tenants(cnpj);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_tenant_id ON subscription_plans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_referencia ON payment_transactions(referencia_tipo, referencia_id);
CREATE INDEX IF NOT EXISTS idx_agent_integrations_tenant_id ON agent_integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_api_configs_tenant_id ON fiscal_api_configs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_notes_tenant_id ON fiscal_notes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_id ON invoices(tenant_id);

-- ============================================
-- PARTE 8: ATUALIZAR RLS POLICIES
-- ============================================

-- 8.1 Policies para fiscal_api_configs (agora com tenant_id)
DROP POLICY IF EXISTS "Organization members can view fiscal API configs" ON fiscal_api_configs;
CREATE POLICY "Tenant members can view fiscal API configs"
  ON fiscal_api_configs FOR SELECT
  USING (
    tenant_id IS NULL AND auth.uid() = user_id
    OR tenant_id IS NOT NULL AND is_tenant_member(tenant_id, auth.uid())
  );

-- 8.2 Policies para fiscal_notes (agora com tenant_id)
DROP POLICY IF EXISTS "Organization members can view fiscal notes" ON fiscal_notes;
CREATE POLICY "Tenant members can view fiscal notes"
  ON fiscal_notes FOR SELECT
  USING (
    tenant_id IS NULL AND auth.uid() = user_id
    OR tenant_id IS NOT NULL AND is_tenant_member(tenant_id, auth.uid())
  );

-- 8.3 Policies para invoices (agora com tenant_id)
DROP POLICY IF EXISTS "Organizações podem ver suas próprias faturas" ON invoices;
CREATE POLICY "Tenant members can view tenant invoices"
  ON invoices FOR SELECT
  USING (
    tenant_id IS NULL AND auth.uid() = user_id
    OR tenant_id IS NOT NULL AND is_tenant_member(tenant_id, auth.uid())
  );

-- 8.4 Policies para subscription_plans com tenant
CREATE POLICY "Tenant can view custom plans"
  ON subscription_plans FOR SELECT
  USING (
    tenant_id IS NULL -- Planos públicos
    OR is_tenant_member(tenant_id, auth.uid()) -- Planos customizados do tenant
  );

-- 8.5 Policies para payment_transactions (campos adicionados)
DROP POLICY IF EXISTS "Users can manage their own transactions" ON payment_transactions;
CREATE POLICY "Users can manage their own transactions"
  ON payment_transactions FOR ALL
  USING (auth.uid() = user_id);

-- 8.6 Policies para agent_integrations (com tenant_id)
DROP POLICY IF EXISTS "Users can manage their agent integrations" ON agent_integrations;
CREATE POLICY "Users can manage their agent integrations"
  ON agent_integrations FOR ALL
  USING (
    agent_configuration_id IN (
      SELECT id FROM agent_configurations WHERE user_id = auth.uid()
    )
    OR (tenant_id IS NOT NULL AND is_tenant_member(tenant_id, auth.uid()))
  );

-- ============================================
-- PARTE 9: LIMPAR COLUNAS ORGANIZATION_ID OBSOLETAS
-- ============================================
ALTER TABLE fiscal_api_configs DROP COLUMN IF EXISTS organization_id;
ALTER TABLE fiscal_notes DROP COLUMN IF EXISTS organization_id;
ALTER TABLE invoices DROP COLUMN IF EXISTS organization_id;

-- ============================================
-- PARTE 10: COMENTÁRIOS DOCUMENTANDO MUDANÇAS
-- ============================================
COMMENT ON TABLE tenants IS 'Tabela principal de provedores/empresas. Consolidou campos de providers.';
COMMENT ON COLUMN tenants.cnpj IS 'CNPJ do provedor (migrado de providers)';
COMMENT ON COLUMN tenants.configuracoes_provedor IS 'Configurações específicas do provedor (migrado de providers)';

COMMENT ON TABLE tenant_memberships IS 'Membros do tenant com permissões de agentes. Consolidou user_agents.';
COMMENT ON COLUMN tenant_memberships.agent_permissions IS 'Permissões específicas por agente (migrado de user_agents)';
COMMENT ON COLUMN tenant_memberships.assigned_agents IS 'Agentes atribuídos ao membro (migrado de user_agents)';

COMMENT ON TABLE subscription_plans IS 'Planos de assinatura. Consolidou tenant_plans.';
COMMENT ON COLUMN subscription_plans.tenant_id IS 'Tenant para planos customizados (migrado de tenant_plans)';
COMMENT ON COLUMN subscription_plans.is_custom IS 'Indica se é um plano customizado do tenant';

COMMENT ON TABLE payment_transactions IS 'Transações de pagamento. Consolidou historico_financeiro.';
COMMENT ON COLUMN payment_transactions.referencia_tipo IS 'Tipo de referência (migrado de historico_financeiro)';
COMMENT ON COLUMN payment_transactions.referencia_id IS 'ID da referência (migrado de historico_financeiro)';

COMMENT ON TABLE agent_integrations IS 'Integrações de agentes. Consolidou provider_integrations.';
COMMENT ON COLUMN agent_integrations.tenant_id IS 'Tenant da integração (migrado de provider_integrations)';
COMMENT ON COLUMN agent_integrations.provider_config IS 'Config de provedor (migrado de provider_integrations)';

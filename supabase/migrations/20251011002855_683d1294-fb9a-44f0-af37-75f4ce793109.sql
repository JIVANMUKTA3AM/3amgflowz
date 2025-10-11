-- =====================================================
-- 3AMG FLOWZ - Multi-Tenant Architecture
-- Base Tables with RLS
-- =====================================================

-- Enums para tipos e estados (apenas novos)
DO $$ BEGIN
  CREATE TYPE public.agent_type AS ENUM ('externo', 'interno');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.agent_sector AS ENUM ('triagem', 'tecnico', 'comercial', 'financeiro');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.adapter_provider AS ENUM ('asaas', 'gerencianet', 'omie', 'outro');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.monitoring_type AS ENUM ('snmp', 'vendor_api');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.ticket_status AS ENUM ('aberto', 'em_andamento', 'resolvido', 'fechado');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- TABELA: tenants (provedores)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  contato JSONB NOT NULL DEFAULT '{}'::jsonb,
  owner_id UUID NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  configuracoes JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: tenant_memberships
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tenant_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

ALTER TABLE public.tenant_memberships ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: agent_profiles
-- =====================================================
CREATE TABLE IF NOT EXISTS public.agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  tipo public.agent_type NOT NULL,
  setor public.agent_sector NOT NULL,
  prompt_ref TEXT NOT NULL,
  configuracoes JSONB NOT NULL DEFAULT '{}'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: agent_routes
-- =====================================================
CREATE TABLE IF NOT EXISTS public.agent_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  de_setor public.agent_sector NOT NULL,
  para_setor public.agent_sector NOT NULL,
  regra JSONB NOT NULL DEFAULT '{}'::jsonb,
  prioridade INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_routes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: plans (renomeada para não conflitar)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tenant_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  nome_plano TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  promocao TEXT,
  condicoes TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tenant_plans ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: billing_adapters
-- =====================================================
CREATE TABLE IF NOT EXISTS public.billing_adapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  provedor public.adapter_provider NOT NULL,
  credenciais JSONB NOT NULL DEFAULT '{}'::jsonb,
  status_map JSONB NOT NULL DEFAULT '{}'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.billing_adapters ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: monitoring_adapters
-- =====================================================
CREATE TABLE IF NOT EXISTS public.monitoring_adapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  tipo public.monitoring_type NOT NULL,
  credenciais JSONB NOT NULL DEFAULT '{}'::jsonb,
  configuracoes JSONB NOT NULL DEFAULT '{}'::jsonb,
  ativo BOOLEAN NOT NULL DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.monitoring_adapters ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: tenant_tickets (renomeada para não conflitar)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tenant_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  setor public.agent_sector NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status public.ticket_status NOT NULL DEFAULT 'aberto',
  contato_cliente JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  assigned_to UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tenant_tickets ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: audit_logs
-- =====================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  actor UUID,
  acao TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY DEFINER FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_tenant_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id 
  FROM public.tenant_memberships
  WHERE user_id = _user_id
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_tenant_member(_tenant_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenant_memberships
    WHERE tenant_id = _tenant_id
      AND user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_tenant_owner(_tenant_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tenants
    WHERE id = _tenant_id
      AND owner_id = _user_id
  );
$$;

-- =====================================================
-- RLS POLICIES - tenants
-- =====================================================

DROP POLICY IF EXISTS "Users can view their tenant" ON public.tenants;
CREATE POLICY "Users can view their tenant"
ON public.tenants
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() OR 
  public.is_tenant_member(id, auth.uid())
);

DROP POLICY IF EXISTS "Users can create tenant" ON public.tenants;
CREATE POLICY "Users can create tenant"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can update their tenant" ON public.tenants;
CREATE POLICY "Owners can update their tenant"
ON public.tenants
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete their tenant" ON public.tenants;
CREATE POLICY "Owners can delete their tenant"
ON public.tenants
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- =====================================================
-- RLS POLICIES - tenant_memberships
-- =====================================================

DROP POLICY IF EXISTS "Users can view memberships of their tenant" ON public.tenant_memberships;
CREATE POLICY "Users can view memberships of their tenant"
ON public.tenant_memberships
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  public.is_tenant_owner(tenant_id, auth.uid())
);

DROP POLICY IF EXISTS "Owners can manage tenant memberships" ON public.tenant_memberships;
CREATE POLICY "Owners can manage tenant memberships"
ON public.tenant_memberships
FOR ALL
TO authenticated
USING (public.is_tenant_owner(tenant_id, auth.uid()));

-- =====================================================
-- RLS POLICIES - agent_profiles
-- =====================================================

DROP POLICY IF EXISTS "Tenant members can view agent profiles" ON public.agent_profiles;
CREATE POLICY "Tenant members can view agent profiles"
ON public.agent_profiles
FOR SELECT
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

DROP POLICY IF EXISTS "Tenant members can manage agent profiles" ON public.agent_profiles;
CREATE POLICY "Tenant members can manage agent profiles"
ON public.agent_profiles
FOR ALL
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

-- =====================================================
-- RLS POLICIES - agent_routes
-- =====================================================

DROP POLICY IF EXISTS "Tenant members can view agent routes" ON public.agent_routes;
CREATE POLICY "Tenant members can view agent routes"
ON public.agent_routes
FOR SELECT
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

DROP POLICY IF EXISTS "Tenant members can manage agent routes" ON public.agent_routes;
CREATE POLICY "Tenant members can manage agent routes"
ON public.agent_routes
FOR ALL
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

-- =====================================================
-- RLS POLICIES - tenant_plans
-- =====================================================

DROP POLICY IF EXISTS "Tenant members can view plans" ON public.tenant_plans;
CREATE POLICY "Tenant members can view plans"
ON public.tenant_plans
FOR SELECT
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

DROP POLICY IF EXISTS "Tenant members can manage plans" ON public.tenant_plans;
CREATE POLICY "Tenant members can manage plans"
ON public.tenant_plans
FOR ALL
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

-- =====================================================
-- RLS POLICIES - billing_adapters
-- =====================================================

DROP POLICY IF EXISTS "Tenant members can view billing adapters" ON public.billing_adapters;
CREATE POLICY "Tenant members can view billing adapters"
ON public.billing_adapters
FOR SELECT
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

DROP POLICY IF EXISTS "Tenant members can manage billing adapters" ON public.billing_adapters;
CREATE POLICY "Tenant members can manage billing adapters"
ON public.billing_adapters
FOR ALL
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

-- =====================================================
-- RLS POLICIES - monitoring_adapters
-- =====================================================

DROP POLICY IF EXISTS "Tenant members can view monitoring adapters" ON public.monitoring_adapters;
CREATE POLICY "Tenant members can view monitoring adapters"
ON public.monitoring_adapters
FOR SELECT
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

DROP POLICY IF EXISTS "Tenant members can manage monitoring adapters" ON public.monitoring_adapters;
CREATE POLICY "Tenant members can manage monitoring adapters"
ON public.monitoring_adapters
FOR ALL
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

-- =====================================================
-- RLS POLICIES - tenant_tickets
-- =====================================================

DROP POLICY IF EXISTS "Tenant members can view tickets" ON public.tenant_tickets;
CREATE POLICY "Tenant members can view tickets"
ON public.tenant_tickets
FOR SELECT
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

DROP POLICY IF EXISTS "Tenant members can manage tickets" ON public.tenant_tickets;
CREATE POLICY "Tenant members can manage tickets"
ON public.tenant_tickets
FOR ALL
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

-- =====================================================
-- RLS POLICIES - audit_logs
-- =====================================================

DROP POLICY IF EXISTS "Tenant members can view audit logs" ON public.audit_logs;
CREATE POLICY "Tenant members can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.is_tenant_member(tenant_id, auth.uid()));

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- TRIGGERS - updated_at
-- =====================================================

DROP TRIGGER IF EXISTS update_tenants_updated_at ON public.tenants;
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_profiles_updated_at ON public.agent_profiles;
CREATE TRIGGER update_agent_profiles_updated_at
BEFORE UPDATE ON public.agent_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_routes_updated_at ON public.agent_routes;
CREATE TRIGGER update_agent_routes_updated_at
BEFORE UPDATE ON public.agent_routes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tenant_plans_updated_at ON public.tenant_plans;
CREATE TRIGGER update_tenant_plans_updated_at
BEFORE UPDATE ON public.tenant_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_adapters_updated_at ON public.billing_adapters;
CREATE TRIGGER update_billing_adapters_updated_at
BEFORE UPDATE ON public.billing_adapters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_monitoring_adapters_updated_at ON public.monitoring_adapters;
CREATE TRIGGER update_monitoring_adapters_updated_at
BEFORE UPDATE ON public.monitoring_adapters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tenant_tickets_updated_at ON public.tenant_tickets;
CREATE TRIGGER update_tenant_tickets_updated_at
BEFORE UPDATE ON public.tenant_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- INDEXES para performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_tenant_memberships_user_id ON public.tenant_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_memberships_tenant_id ON public.tenant_memberships(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_tenant_id ON public.agent_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_routes_tenant_id ON public.agent_routes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_plans_tenant_id ON public.tenant_plans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_billing_adapters_tenant_id ON public.billing_adapters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_adapters_tenant_id ON public.monitoring_adapters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_tickets_tenant_id ON public.tenant_tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_tickets_status ON public.tenant_tickets(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON public.audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
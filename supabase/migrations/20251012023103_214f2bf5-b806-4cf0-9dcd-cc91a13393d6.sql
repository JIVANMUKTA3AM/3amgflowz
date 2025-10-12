-- Fix security warnings: add search_path to functions without it

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_member_of(org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.memberships
    WHERE 
      organization_id = org_id AND
      user_id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_organization()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.memberships (user_id, organization_id, role)
  VALUES (NEW.owner_id, NEW.id, 'owner');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.provision_provider_agents()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.provider_agents (provider_id, agent_type)
  VALUES 
    (NEW.id, 'atendimento_geral'),
    (NEW.id, 'comercial'),
    (NEW.id, 'suporte_tecnico')
  ON CONFLICT (provider_id, agent_type) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_subscription_history()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.subscription_history (
      subscription_id, event_type, new_plan, new_status
    ) VALUES (
      NEW.id, 'created', NEW.plan_type, NEW.status
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.plan_type != NEW.plan_type OR OLD.status != NEW.status THEN
      INSERT INTO public.subscription_history (
        subscription_id, event_type, old_plan, new_plan, old_status, new_status
      ) VALUES (
        NEW.id, 'updated', OLD.plan_type, NEW.plan_type, OLD.status, NEW.status
      );
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_onboarding_configurations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_telegram_configurations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_ont_monitoring_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_olt_configurations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.encrypt_agent_integrations_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.api_credentials IS NOT NULL THEN
    NEW.api_credentials := public.encrypt_jsonb_credentials(NEW.api_credentials);
  END IF;
  
  IF NEW.telegram_config IS NOT NULL THEN
    NEW.telegram_config := public.encrypt_jsonb_credentials(NEW.telegram_config);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.encrypt_olt_configurations_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.password IS NOT NULL AND NEW.password != '' THEN
    NEW.password := public.encrypt_credential(NEW.password);
  END IF;
  
  IF NEW.snmp_community IS NOT NULL AND NEW.snmp_community != '' THEN
    NEW.snmp_community := public.encrypt_credential(NEW.snmp_community);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.encrypt_telegram_configurations_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.bot_token IS NOT NULL AND NEW.bot_token != '' THEN
    NEW.bot_token := public.encrypt_credential(NEW.bot_token);
  END IF;
  
  RETURN NEW;
END;
$$;
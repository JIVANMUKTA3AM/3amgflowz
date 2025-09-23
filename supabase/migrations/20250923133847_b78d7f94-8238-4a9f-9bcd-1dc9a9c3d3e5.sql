-- Enable the pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a function to encrypt sensitive data
CREATE OR REPLACE FUNCTION public.encrypt_credential(credential_text TEXT)
RETURNS TEXT AS $$
BEGIN
  IF credential_text IS NULL OR credential_text = '' THEN
    RETURN credential_text;
  END IF;
  
  -- Use pgcrypto to encrypt with a key derived from the user's auth.uid()
  RETURN encode(
    pgp_sym_encrypt(
      credential_text, 
      concat('3amg_key_', auth.uid()::text)
    ), 
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to decrypt sensitive data
CREATE OR REPLACE FUNCTION public.decrypt_credential(encrypted_text TEXT)
RETURNS TEXT AS $$
BEGIN
  IF encrypted_text IS NULL OR encrypted_text = '' THEN
    RETURN encrypted_text;
  END IF;
  
  -- Decrypt using the same key
  RETURN pgp_sym_decrypt(
    decode(encrypted_text, 'base64'),
    concat('3amg_key_', auth.uid()::text)
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return null if decryption fails (invalid key or corrupted data)
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create secure functions for handling JSONB credential encryption
CREATE OR REPLACE FUNCTION public.encrypt_jsonb_credentials(credentials JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{}';
  key TEXT;
  value TEXT;
BEGIN
  IF credentials IS NULL THEN
    RETURN NULL;
  END IF;

  -- Encrypt sensitive fields in JSONB
  FOR key, value IN SELECT * FROM jsonb_each_text(credentials)
  LOOP
    -- Only encrypt fields that contain sensitive data
    IF key IN ('api_key', 'bot_token', 'access_token', 'client_secret', 'password', 'private_key', 'webhook_secret', 'smtp_password') THEN
      result := result || jsonb_build_object(key, public.encrypt_credential(value));
    ELSE
      result := result || jsonb_build_object(key, value);
    END IF;
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrypt JSONB credentials
CREATE OR REPLACE FUNCTION public.decrypt_jsonb_credentials(encrypted_credentials JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{}';
  key TEXT;
  value TEXT;
BEGIN
  IF encrypted_credentials IS NULL THEN
    RETURN NULL;
  END IF;

  -- Decrypt sensitive fields in JSONB
  FOR key, value IN SELECT * FROM jsonb_each_text(encrypted_credentials)
  LOOP
    -- Only decrypt fields that were encrypted
    IF key IN ('api_key', 'bot_token', 'access_token', 'client_secret', 'password', 'private_key', 'webhook_secret', 'smtp_password') THEN
      result := result || jsonb_build_object(key, public.decrypt_credential(value));
    ELSE
      result := result || jsonb_build_object(key, value);
    END IF;
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically encrypt data before insert/update
CREATE OR REPLACE FUNCTION public.encrypt_agent_integrations_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Encrypt API credentials
  IF NEW.api_credentials IS NOT NULL THEN
    NEW.api_credentials := public.encrypt_jsonb_credentials(NEW.api_credentials);
  END IF;
  
  -- Encrypt telegram config
  IF NEW.telegram_config IS NOT NULL THEN
    NEW.telegram_config := public.encrypt_jsonb_credentials(NEW.telegram_config);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.encrypt_olt_configurations_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Encrypt sensitive fields
  IF NEW.password IS NOT NULL AND NEW.password != '' THEN
    NEW.password := public.encrypt_credential(NEW.password);
  END IF;
  
  IF NEW.snmp_community IS NOT NULL AND NEW.snmp_community != '' THEN
    NEW.snmp_community := public.encrypt_credential(NEW.snmp_community);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.encrypt_telegram_configurations_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Encrypt bot token
  IF NEW.bot_token IS NOT NULL AND NEW.bot_token != '' THEN
    NEW.bot_token := public.encrypt_credential(NEW.bot_token);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the triggers
DROP TRIGGER IF EXISTS encrypt_agent_integrations ON public.agent_integrations;
CREATE TRIGGER encrypt_agent_integrations
  BEFORE INSERT OR UPDATE ON public.agent_integrations
  FOR EACH ROW EXECUTE FUNCTION public.encrypt_agent_integrations_trigger();

DROP TRIGGER IF EXISTS encrypt_olt_configurations ON public.olt_configurations;
CREATE TRIGGER encrypt_olt_configurations
  BEFORE INSERT OR UPDATE ON public.olt_configurations
  FOR EACH ROW EXECUTE FUNCTION public.encrypt_olt_configurations_trigger();

DROP TRIGGER IF EXISTS encrypt_telegram_configurations ON public.telegram_configurations;
CREATE TRIGGER encrypt_telegram_configurations
  BEFORE INSERT OR UPDATE ON public.telegram_configurations
  FOR EACH ROW EXECUTE FUNCTION public.encrypt_telegram_configurations_trigger();

-- Create views for decrypted data access (for authorized users only)
CREATE OR REPLACE VIEW public.agent_integrations_decrypted AS
SELECT 
  id,
  agent_configuration_id,
  integration_type,
  integration_name,
  public.decrypt_jsonb_credentials(api_credentials) as api_credentials,
  webhook_endpoints,
  settings,
  is_active,
  last_sync_at,
  created_at,
  updated_at,
  public.decrypt_jsonb_credentials(telegram_config) as telegram_config
FROM public.agent_integrations;

CREATE OR REPLACE VIEW public.olt_configurations_decrypted AS
SELECT 
  id,
  user_id,
  name,
  brand,
  model,
  ip_address,
  public.decrypt_credential(snmp_community) as snmp_community,
  username,
  public.decrypt_credential(password) as password,
  port,
  is_active,
  created_at,
  updated_at
FROM public.olt_configurations;

CREATE OR REPLACE VIEW public.telegram_configurations_decrypted AS
SELECT 
  id,
  user_id,
  public.decrypt_credential(bot_token) as bot_token,
  bot_username,
  webhook_url,
  is_active,
  created_at,
  updated_at
FROM public.telegram_configurations;

-- Grant access to views based on same RLS policies
ALTER VIEW public.agent_integrations_decrypted OWNER TO postgres;
ALTER VIEW public.olt_configurations_decrypted OWNER TO postgres;
ALTER VIEW public.telegram_configurations_decrypted OWNER TO postgres;

-- Create RLS policies for the decrypted views
CREATE POLICY "Users can view their decrypted agent integrations" ON public.agent_integrations_decrypted
  FOR SELECT USING (
    agent_configuration_id IN (
      SELECT id FROM agent_configurations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their decrypted OLT configurations" ON public.olt_configurations_decrypted
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their decrypted Telegram configurations" ON public.telegram_configurations_decrypted
  FOR SELECT USING (auth.uid() = user_id);

-- Enable RLS on views
ALTER VIEW public.agent_integrations_decrypted ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.olt_configurations_decrypted ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.telegram_configurations_decrypted ENABLE ROW LEVEL SECURITY;
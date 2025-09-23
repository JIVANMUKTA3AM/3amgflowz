-- Fix function search path security issues by setting STABLE SET search_path = public
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.encrypt_telegram_configurations_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Encrypt bot token
  IF NEW.bot_token IS NOT NULL AND NEW.bot_token != '' THEN
    NEW.bot_token := public.encrypt_credential(NEW.bot_token);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- Fix security warning: Set search_path for fiscal functions
DROP FUNCTION IF EXISTS public.update_fiscal_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_fiscal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public';

-- Recreate triggers with the fixed function
CREATE TRIGGER update_fiscal_api_configs_updated_at
  BEFORE UPDATE ON fiscal_api_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_fiscal_updated_at();

CREATE TRIGGER update_fiscal_notes_updated_at
  BEFORE UPDATE ON fiscal_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_fiscal_updated_at();
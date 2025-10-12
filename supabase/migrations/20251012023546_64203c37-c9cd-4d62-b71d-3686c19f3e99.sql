-- Fix remaining function without search_path

CREATE OR REPLACE FUNCTION public.mark_invoice_as_paid(
  p_invoice_id uuid, 
  p_payment_method text, 
  p_payment_id text, 
  p_payment_data jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT user_id INTO v_user_id FROM public.invoices WHERE id = p_invoice_id;
  
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.invoices
  SET 
    status = 'paid',
    payment_method = p_payment_method,
    payment_id = p_payment_id,
    payment_date = NOW(),
    payment_data = p_payment_data,
    updated_at = NOW()
  WHERE id = p_invoice_id;
  
  RETURN FOUND;
END;
$$;
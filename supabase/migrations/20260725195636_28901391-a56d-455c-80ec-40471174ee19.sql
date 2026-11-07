DROP FUNCTION IF EXISTS public.get_paynow_config_public();

CREATE OR REPLACE FUNCTION public.get_paynow_signature(_fields jsonb)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  key_value text;
  joined text := '';
  field_key text;
BEGIN
  SELECT paynow_integration_key INTO key_value
  FROM public.app_config
  WHERE id = 1
    AND paynow_key_configured = true
    AND paynow_integration_key IS NOT NULL;

  IF key_value IS NULL THEN
    RAISE EXCEPTION 'Paynow is not configured yet. Complete setup at /setup-paynow.';
  END IF;

  FOREACH field_key IN ARRAY ARRAY[
    'id', 'reference', 'amount', 'additionalinfo', 'returnurl', 'resulturl',
    'authemail', 'phone', 'method', 'status'
  ] LOOP
    IF _fields ? field_key THEN
      joined := joined || (_fields ->> field_key);
    END IF;
  END LOOP;

  RETURN upper(encode(digest(joined || key_value, 'sha512'), 'hex'));
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_paynow_signature(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_paynow_signature(jsonb) TO anon, authenticated, service_role;
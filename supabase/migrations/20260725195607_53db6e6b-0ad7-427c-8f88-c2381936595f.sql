ALTER TABLE public.app_config
  ADD COLUMN IF NOT EXISTS setup_code text,
  ADD COLUMN IF NOT EXISTS paynow_integration_key text;

CREATE OR REPLACE FUNCTION public.get_setup_status()
RETURNS TABLE (
  integration_id text,
  paynow_configured boolean,
  client_admin_activated boolean,
  first_login_completed boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(paynow_integration_id, '25844') AS integration_id,
    COALESCE(paynow_key_configured, false) AS paynow_configured,
    client_admin_email IS NOT NULL AS client_admin_activated,
    COALESCE(first_login_completed, false) AS first_login_completed
  FROM public.app_config
  WHERE id = 1
$$;

REVOKE EXECUTE ON FUNCTION public.get_setup_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_setup_status() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.begin_client_admin_activation(_email text, _setup_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email text := lower(trim(_email));
BEGIN
  IF normalized_email IS NULL OR normalized_email = '' OR position('@' in normalized_email) <= 1 THEN
    RAISE EXCEPTION 'Enter a valid email address';
  END IF;

  IF _setup_code !~ '^\d{4}$' THEN
    RAISE EXCEPTION 'Verification code must be 4 digits';
  END IF;

  INSERT INTO public.app_config (id, paynow_integration_id)
  VALUES (1, '25844')
  ON CONFLICT (id) DO NOTHING;

  UPDATE public.app_config
  SET client_admin_email = normalized_email,
      setup_code = _setup_code,
      first_login_code_hash = NULL,
      first_login_completed = false,
      updated_at = now()
  WHERE id = 1
    AND client_admin_email IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Admin account already activated';
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.begin_client_admin_activation(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.begin_client_admin_activation(text, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.claim_client_admin(_setup_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_email text := lower(COALESCE((auth.jwt() ->> 'email'), ''));
  configured_email text;
  stored_code text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in first';
  END IF;

  IF _setup_code !~ '^\d{4}$' THEN
    RAISE EXCEPTION 'Verification code must be 4 digits';
  END IF;

  SELECT lower(COALESCE(client_admin_email, '')), setup_code
    INTO configured_email, stored_code
  FROM public.app_config
  WHERE id = 1
  FOR UPDATE;

  IF configured_email IS NULL OR configured_email = '' THEN
    RAISE EXCEPTION 'Admin account is not activated yet';
  END IF;

  IF configured_email <> current_email THEN
    RAISE EXCEPTION 'This signed-in account is not the activated admin';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE role = 'client_admin'::public.app_role
      AND user_id <> auth.uid()
  ) THEN
    RAISE EXCEPTION 'Client admin role has already been claimed';
  END IF;

  IF COALESCE((SELECT first_login_completed FROM public.app_config WHERE id = 1), false) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'client_admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN jsonb_build_object('ok', true, 'alreadyCompleted', true);
  END IF;

  IF stored_code IS NULL OR stored_code <> _setup_code THEN
    RAISE EXCEPTION 'Incorrect verification code';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'client_admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.app_config
  SET first_login_completed = true,
      setup_code = NULL,
      first_login_code_hash = NULL,
      updated_at = now()
  WHERE id = 1;

  RETURN jsonb_build_object('ok', true, 'alreadyCompleted', false);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_client_admin(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_client_admin(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.complete_paynow_setup(_integration_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(trim(COALESCE(_integration_key, ''))) < 6 THEN
    RAISE EXCEPTION 'Enter a valid Paynow integration key';
  END IF;

  INSERT INTO public.app_config (id, paynow_integration_id)
  VALUES (1, '25844')
  ON CONFLICT (id) DO NOTHING;

  UPDATE public.app_config
  SET paynow_integration_id = '25844',
      paynow_integration_key = trim(_integration_key),
      paynow_key_configured = true,
      updated_at = now()
  WHERE id = 1
    AND COALESCE(paynow_key_configured, false) = false;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Paynow setup already completed';
  END IF;

  INSERT INTO public.server_secrets (key, value)
  VALUES ('PAYNOW_INTEGRATION_KEY', trim(_integration_key))
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.complete_paynow_setup(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.complete_paynow_setup(text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_paynow_config_public()
RETURNS TABLE (integration_id text, integration_key text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT paynow_integration_id, paynow_integration_key
  FROM public.app_config
  WHERE id = 1
    AND paynow_key_configured = true
    AND paynow_integration_key IS NOT NULL
$$;

REVOKE EXECUTE ON FUNCTION public.get_paynow_config_public() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_paynow_config_public() TO anon, authenticated, service_role;
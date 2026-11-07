CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP FUNCTION IF EXISTS public.get_paynow_config_public();

ALTER TABLE public.app_config
  ADD COLUMN IF NOT EXISTS setup_code_hash text;

UPDATE public.app_config
SET setup_code_hash = crypt(setup_code, gen_salt('bf', 12)),
    setup_code = NULL,
    updated_at = now()
WHERE setup_code IS NOT NULL
  AND setup_code_hash IS NULL;

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
      setup_code = NULL,
      setup_code_hash = crypt(_setup_code, gen_salt('bf', 12)),
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
  stored_hash text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in first';
  END IF;

  IF _setup_code !~ '^\d{4}$' THEN
    RAISE EXCEPTION 'Verification code must be 4 digits';
  END IF;

  SELECT lower(COALESCE(client_admin_email, '')), setup_code_hash
    INTO configured_email, stored_hash
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

  IF stored_hash IS NULL OR crypt(_setup_code, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'Incorrect verification code';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'client_admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.app_config
  SET first_login_completed = true,
      setup_code = NULL,
      setup_code_hash = NULL,
      first_login_code_hash = NULL,
      updated_at = now()
  WHERE id = 1;

  RETURN jsonb_build_object('ok', true, 'alreadyCompleted', false);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_client_admin(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_client_admin(text) TO authenticated, service_role;

REVOKE SELECT ON public.app_config FROM anon, authenticated;
GRANT SELECT (id, paynow_integration_id, paynow_key_configured, client_admin_email, first_login_completed, updated_at) ON public.app_config TO anon, authenticated;
GRANT ALL ON public.app_config TO service_role;
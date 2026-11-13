-- Apply alongside the website release: all existing admin mutation RPCs use this verifier.
CREATE OR REPLACE FUNCTION public.verify_site_admin_passcode(_passcode text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT encode(sha256(convert_to(COALESCE(_passcode, ''), 'UTF8')), 'hex') = '094fb170f2881ac8006d8a3bafdacf695062b6cd24a00e62b43eb50b856ac1f8'
$$;
REVOKE EXECUTE ON FUNCTION public.verify_site_admin_passcode(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_site_admin_passcode(text) TO anon, authenticated, service_role;

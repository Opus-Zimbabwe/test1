REVOKE SELECT ON public.app_config FROM anon, authenticated;
GRANT SELECT (id, paynow_integration_id, paynow_key_configured, client_admin_email, first_login_completed, updated_at) ON public.app_config TO anon, authenticated;
GRANT ALL ON public.app_config TO service_role;
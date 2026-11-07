ALTER FUNCTION public.begin_client_admin_activation(text, text) SET search_path TO 'public', 'extensions';
ALTER FUNCTION public.claim_client_admin(text) SET search_path TO 'public', 'extensions';
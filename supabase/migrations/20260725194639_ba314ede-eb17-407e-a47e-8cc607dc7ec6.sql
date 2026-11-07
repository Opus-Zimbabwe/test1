
-- Clear existing admin accounts and reset activation state
DELETE FROM public.user_roles WHERE role = 'client_admin';
DELETE FROM auth.users WHERE id IN ('d70dffa3-50ff-4ccc-aac4-42417cdab002','c94224cb-96dd-4df0-b402-62a97a3bebe9');

-- Reset activation fields on app_config row 1 (keep Paynow settings intact)
INSERT INTO public.app_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;
UPDATE public.app_config
   SET client_admin_email = NULL,
       first_login_code_hash = NULL,
       first_login_completed = false
 WHERE id = 1;

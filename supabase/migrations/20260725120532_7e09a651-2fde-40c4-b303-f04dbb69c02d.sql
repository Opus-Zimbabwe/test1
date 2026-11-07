
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

DROP POLICY IF EXISTS "Admins update notifications" ON public.notifications;
CREATE POLICY "Admins update notifications" ON public.notifications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'client_admin') OR public.has_role(auth.uid(), 'site_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'client_admin') OR public.has_role(auth.uid(), 'site_admin'));

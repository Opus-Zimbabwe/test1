-- Isolated by site_key: test controls never alter the production website's settings.
BEGIN;
CREATE TABLE public.site_experience (
 site_key text PRIMARY KEY CHECK(site_key ~ '^[A-Za-z0-9_-]{1,80}$'),
 settings jsonb NOT NULL CHECK(jsonb_typeof(settings)='object'),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read public website presentation settings" ON public.site_experience FOR SELECT USING(true);
GRANT SELECT ON public.site_experience TO anon,authenticated;
REVOKE INSERT,UPDATE,DELETE ON public.site_experience FROM anon,authenticated;
CREATE OR REPLACE FUNCTION public.site_admin_save_experience(_passcode text,_site_key text,_section text,_settings jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE result public.site_experience%ROWTYPE;
BEGIN
 IF NOT public.verify_site_admin_passcode(_passcode) THEN RAISE EXCEPTION 'Invalid passcode'; END IF;
 IF _section NOT IN ('hero','availability','message') THEN RAISE EXCEPTION 'Invalid settings section'; END IF;
 IF jsonb_typeof(_settings->'heroSlides') IS DISTINCT FROM 'array' OR jsonb_array_length(_settings->'heroSlides') NOT BETWEEN 1 AND 10 OR jsonb_typeof(_settings->'maintenance'->'enabled') IS DISTINCT FROM 'boolean' THEN RAISE EXCEPTION 'Invalid website settings'; END IF;
 IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(_settings->'heroSlides') slide WHERE slide->>'active'='true') THEN RAISE EXCEPTION 'Keep at least one hero slide visible'; END IF;
 INSERT INTO public.site_experience(site_key,settings) VALUES(_site_key,_settings)
 ON CONFLICT(site_key) DO UPDATE SET settings=CASE _section WHEN 'hero' THEN jsonb_set(site_experience.settings,'{heroSlides}',EXCLUDED.settings->'heroSlides') WHEN 'message' THEN jsonb_set(site_experience.settings,'{maintenance,message}',EXCLUDED.settings#>'{maintenance,message}') ELSE jsonb_set(site_experience.settings,'{maintenance}',EXCLUDED.settings->'maintenance') END,updated_at=now() RETURNING * INTO result;
 RETURN to_jsonb(result);
END;$$;
REVOKE ALL ON FUNCTION public.site_admin_save_experience(text,text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.site_admin_save_experience(text,text,text,jsonb) TO anon,authenticated,service_role;

COMMIT;

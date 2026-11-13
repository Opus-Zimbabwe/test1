CREATE TABLE IF NOT EXISTS public.content_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('youtube','tiktok','facebook')),
  video_id text NOT NULL CHECK (length(video_id) BETWEEN 5 AND 80),
  url text NOT NULL CHECK (length(url) <= 2048 AND url ~ '^https://'),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 180),
  placement text NOT NULL CHECK (placement IN ('podcast','social')),
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  origin_key text CHECK (origin_key IS NULL OR origin_key ~ '^(podcast|social):(youtube|tiktok|facebook):[A-Za-z0-9_-]{5,80}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(platform, video_id, placement)
);
ALTER TABLE public.content_videos ENABLE ROW LEVEL SECURITY;
-- Public rows contain video metadata only; hidden rows override bundled/imported videos.
CREATE POLICY "Read website video metadata" ON public.content_videos FOR SELECT USING (true);
GRANT SELECT ON public.content_videos TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.content_videos FROM anon, authenticated;
CREATE OR REPLACE FUNCTION public.site_admin_save_video(_passcode text, _video jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE result public.content_videos%ROWTYPE;
BEGIN
  IF NOT public.verify_site_admin_passcode(_passcode) THEN RAISE EXCEPTION 'Invalid passcode'; END IF;
  IF COALESCE(_video->>'url','') !~ '^https://(www\.|m\.)?(youtube\.com|youtu\.be|tiktok\.com|facebook\.com|fb\.watch)/' THEN RAISE EXCEPTION 'Unsupported video URL'; END IF;
  IF NULLIF(_video->>'id','') IS NOT NULL THEN
    UPDATE public.content_videos SET platform=_video->>'platform',video_id=_video->>'video_id',url=_video->>'url',title=trim(_video->>'title'),placement=_video->>'placement',sort_order=COALESCE((_video->>'sort_order')::integer,0),active=COALESCE((_video->>'active')::boolean,true),origin_key=_video->>'origin_key'
    WHERE id=(_video->>'id')::uuid RETURNING * INTO result;
    IF result.id IS NULL THEN RAISE EXCEPTION 'Video no longer exists. Refresh the library.'; END IF;
  ELSE
    INSERT INTO public.content_videos(platform,video_id,url,title,placement,sort_order,active,origin_key)
    VALUES(_video->>'platform',_video->>'video_id',_video->>'url',trim(_video->>'title'),_video->>'placement',COALESCE((_video->>'sort_order')::integer,0),COALESCE((_video->>'active')::boolean,true),_video->>'origin_key')
    ON CONFLICT(platform,video_id,placement) DO UPDATE SET url=EXCLUDED.url,title=EXCLUDED.title,sort_order=EXCLUDED.sort_order,active=EXCLUDED.active,origin_key=COALESCE(EXCLUDED.origin_key,content_videos.origin_key) RETURNING * INTO result;
  END IF;
  RETURN to_jsonb(result);
END; $$;
REVOKE ALL ON FUNCTION public.site_admin_save_video(text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.site_admin_save_video(text,jsonb) TO anon,authenticated,service_role;

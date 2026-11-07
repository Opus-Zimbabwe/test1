CREATE OR REPLACE FUNCTION public.verify_site_admin_passcode(_passcode text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(_passcode, '') = 'Google!password7'
$$;

REVOKE EXECUTE ON FUNCTION public.verify_site_admin_passcode(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_site_admin_passcode(text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.site_admin_save_gallery_image(
  _passcode text,
  _id uuid,
  _src text,
  _caption text DEFAULT NULL,
  _sort_order integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_data public.gallery_images%ROWTYPE;
BEGIN
  IF NOT public.verify_site_admin_passcode(_passcode) THEN
    RAISE EXCEPTION 'Invalid passcode';
  END IF;

  IF _src IS NULL OR length(trim(_src)) < 1 THEN
    RAISE EXCEPTION 'Image URL is required';
  END IF;

  IF _id IS NULL THEN
    INSERT INTO public.gallery_images (src, caption, sort_order)
    VALUES (trim(_src), NULLIF(trim(COALESCE(_caption, '')), ''), COALESCE(_sort_order, 0))
    RETURNING * INTO row_data;
  ELSE
    UPDATE public.gallery_images
    SET src = trim(_src),
        caption = NULLIF(trim(COALESCE(_caption, '')), ''),
        sort_order = COALESCE(_sort_order, 0)
    WHERE id = _id
    RETURNING * INTO row_data;
  END IF;

  IF row_data.id IS NULL THEN
    RAISE EXCEPTION 'Gallery image not found';
  END IF;

  RETURN to_jsonb(row_data);
END;
$$;

CREATE OR REPLACE FUNCTION public.site_admin_delete_gallery_image(_passcode text, _id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.verify_site_admin_passcode(_passcode) THEN
    RAISE EXCEPTION 'Invalid passcode';
  END IF;

  DELETE FROM public.gallery_images WHERE id = _id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Gallery image not found';
  END IF;
  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.site_admin_save_announcement(
  _passcode text,
  _id uuid,
  _title text,
  _body text DEFAULT '',
  _date_text text DEFAULT '',
  _location text DEFAULT NULL,
  _image_url text DEFAULT NULL,
  _sort_order integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_data public.announcements%ROWTYPE;
BEGIN
  IF NOT public.verify_site_admin_passcode(_passcode) THEN
    RAISE EXCEPTION 'Invalid passcode';
  END IF;

  IF _title IS NULL OR length(trim(_title)) < 1 THEN
    RAISE EXCEPTION 'Title is required';
  END IF;

  IF _id IS NULL THEN
    INSERT INTO public.announcements (title, body, date_text, location, image_url, sort_order)
    VALUES (
      trim(_title),
      COALESCE(_body, ''),
      COALESCE(_date_text, ''),
      NULLIF(trim(COALESCE(_location, '')), ''),
      NULLIF(trim(COALESCE(_image_url, '')), ''),
      COALESCE(_sort_order, 0)
    )
    RETURNING * INTO row_data;
  ELSE
    UPDATE public.announcements
    SET title = trim(_title),
        body = COALESCE(_body, ''),
        date_text = COALESCE(_date_text, ''),
        location = NULLIF(trim(COALESCE(_location, '')), ''),
        image_url = NULLIF(trim(COALESCE(_image_url, '')), ''),
        sort_order = COALESCE(_sort_order, 0)
    WHERE id = _id
    RETURNING * INTO row_data;
  END IF;

  IF row_data.id IS NULL THEN
    RAISE EXCEPTION 'Announcement not found';
  END IF;

  RETURN to_jsonb(row_data);
END;
$$;

CREATE OR REPLACE FUNCTION public.site_admin_delete_announcement(_passcode text, _id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.verify_site_admin_passcode(_passcode) THEN
    RAISE EXCEPTION 'Invalid passcode';
  END IF;

  DELETE FROM public.announcements WHERE id = _id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Announcement not found';
  END IF;
  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.site_admin_save_gallery_image(text, uuid, text, text, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.site_admin_delete_gallery_image(text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.site_admin_save_announcement(text, uuid, text, text, text, text, text, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.site_admin_delete_announcement(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.site_admin_save_gallery_image(text, uuid, text, text, integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.site_admin_delete_gallery_image(text, uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.site_admin_save_announcement(text, uuid, text, text, text, text, text, integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.site_admin_delete_announcement(text, uuid) TO anon, authenticated, service_role;

ALTER TABLE public.gallery_images REPLICA IDENTITY FULL;
ALTER TABLE public.announcements REPLICA IDENTITY FULL;
ALTER TABLE public.books REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['gallery_images','announcements','books','orders','notifications'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Site images can be uploaded" ON storage.objects;
CREATE POLICY "Site images can be uploaded"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id IN ('gallery','announcements','book-covers'));

DROP POLICY IF EXISTS "Site images can be updated" ON storage.objects;
CREATE POLICY "Site images can be updated"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id IN ('gallery','announcements','book-covers'))
WITH CHECK (bucket_id IN ('gallery','announcements','book-covers'));

DROP POLICY IF EXISTS "Public read book-files" ON storage.objects;
CREATE POLICY "Public read book-files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'book-files');

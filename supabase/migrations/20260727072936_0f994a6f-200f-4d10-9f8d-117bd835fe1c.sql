
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public read announcements" ON storage.objects;
DROP POLICY IF EXISTS "Public read book-covers" ON storage.objects;

CREATE POLICY "Public read site images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id IN ('gallery','announcements','book-covers'));

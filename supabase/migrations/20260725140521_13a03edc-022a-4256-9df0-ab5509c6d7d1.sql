-- Ensure app_config has the single config row
INSERT INTO public.app_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Add stock column to books if it doesn't exist
ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0;

-- Enable Realtime for the public tables that should update live across visitors
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'gallery_images') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_images;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'announcements') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'books') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.books;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

-- Add updated_at triggers to tables that have the column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_books_updated_at') THEN
    CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
    FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at') THEN
    CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_app_config_updated_at') THEN
    CREATE TRIGGER update_app_config_updated_at BEFORE UPDATE ON public.app_config
    FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
  END IF;
END $$;

-- Seed default books if the table is empty (client admin can edit/remove these)
INSERT INTO public.books (title, author, description, price_usd, isbn, stock, active, cover_url, file_url, file_kind)
SELECT *
FROM (VALUES
  ('Foundations of a Great Marriage', 'Pastor Jethro Mukome', 'Biblical principles for building a marriage that lasts a lifetime.', 15.00, NULL, 100, true, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', NULL, NULL),
  ('Before You Say I Do', 'Great Couples Trust', 'A pre-marital counselling companion for engaged couples.', 12.00, NULL, 80, true, 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', NULL, NULL)
) AS v(title, author, description, price_usd, isbn, stock, active, cover_url, file_url, file_kind)
WHERE NOT EXISTS (SELECT 1 FROM public.books);

-- Storage policies: public read on public buckets; admins can upload.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read book-covers') THEN
    CREATE POLICY "Public read book-covers" ON storage.objects FOR SELECT TO public
    USING (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'book-covers'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read gallery') THEN
    CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT TO public
    USING (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read announcements') THEN
    CREATE POLICY "Public read announcements" ON storage.objects FOR SELECT TO public
    USING (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'announcements'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Client admins upload book-covers') THEN
    CREATE POLICY "Client admins upload book-covers" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'book-covers') AND public.has_role(auth.uid(), 'client_admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Client admins upload book-files') THEN
    CREATE POLICY "Client admins upload book-files" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'book-files') AND public.has_role(auth.uid(), 'client_admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Site admins upload gallery') THEN
    CREATE POLICY "Site admins upload gallery" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'gallery') AND public.has_role(auth.uid(), 'site_admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Site admins upload announcements') THEN
    CREATE POLICY "Site admins upload announcements" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = (SELECT id FROM storage.buckets WHERE name = 'announcements') AND public.has_role(auth.uid(), 'site_admin'));
  END IF;
END $$;
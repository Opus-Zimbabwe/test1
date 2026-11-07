DROP POLICY IF EXISTS "Books are viewable by everyone" ON public.books;
CREATE POLICY "Active books viewable by everyone" ON public.books FOR SELECT TO anon USING (active = true);
CREATE POLICY "Client admins can view all books" ON public.books FOR SELECT TO authenticated USING (has_role(auth.uid(), 'client_admin'::app_role));
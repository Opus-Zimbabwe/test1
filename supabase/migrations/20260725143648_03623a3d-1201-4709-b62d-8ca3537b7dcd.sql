
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.gallery_images LIMIT 1) THEN
    INSERT INTO public.gallery_images (src, caption, sort_order) VALUES
      ('/cdn/6ca73651-9776-4287-ac8d-752ff4dd99a1/seminar-flyer.jpg', 'Marriage seminar flyer', 0),
      ('/cdn/e32ef967-c74f-42e5-a8c6-2fe75d3bbf4f/gc-1.jpg', 'Outreach moment', 1),
      ('/cdn/c5595e7d-a55a-4f51-ba90-f6e0b83598b0/gc-2.jpg', 'Outreach moment', 2),
      ('/cdn/b5678dc9-e94a-4d2d-b51e-96ace5f5536b/gc-3.jpg', 'Outreach moment', 3),
      ('/cdn/15be77d8-4141-4ad6-890a-0641d75a9e7b/gc-4.jpg', 'Outreach moment', 4),
      ('/cdn/e3a272ad-7998-440d-9e48-60b21150a0eb/gc-5.jpg', 'Outreach moment', 5),
      ('/cdn/9eb222e3-00a6-41a6-ac31-1643e1ca055d/gc-6.jpg', 'Outreach moment', 6),
      ('/cdn/2902045f-846f-4a7f-9296-5d1e421179eb/gc-7.jpg', 'Outreach moment', 7),
      ('/cdn/4edf1fff-1d53-405c-b8f3-66f688fbc4ad/gc-8.jpg', 'Outreach moment', 8),
      ('/cdn/c64f6742-8c58-4dba-a776-65901c567666/gc-prison-soccer.jpg', 'Prison soccer outreach', 9),
      ('/cdn/8885375a-10c1-465e-9f59-36d26e062cf5/gc-couple-restaurant.jpg', 'Couple time', 10);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.announcements LIMIT 1) THEN
    INSERT INTO public.announcements (title, body, date_text, location, image_url, sort_order) VALUES
      ('Marriage Seminar', 'Join us for a life-changing marriage seminar with practical teachings, testimonies and prayer. Couples and singles preparing for marriage are welcome.', 'Coming Soon', 'Harare, Zimbabwe', '/cdn/6ca73651-9776-4287-ac8d-752ff4dd99a1/seminar-flyer.jpg', 0),
      ('Methodist Church Meet', 'A special session with couples from the Methodist Church community — teaching, sharing and fellowship.', 'By Invitation', 'Methodist Church', '/cdn/fef9fd2e-ea5d-49d1-bdd7-4eb4c98e2e0c/announce-methodist.jpg', 1),
      ('Prison Soccer Outreach', 'Bringing hope through sport, worship and marriage restoration ministry inside correctional facilities.', 'Ongoing', 'Correctional Facilities', '/cdn/09cebee3-d8b7-4cc6-84fa-ed93172357d2/announce-soccer.jpg', 2);
  END IF;
END $$;

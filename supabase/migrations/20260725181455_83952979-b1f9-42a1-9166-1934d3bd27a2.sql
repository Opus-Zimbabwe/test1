ALTER TABLE public.app_config
  ADD COLUMN IF NOT EXISTS first_login_code_hash text,
  ADD COLUMN IF NOT EXISTS first_login_completed boolean NOT NULL DEFAULT false;
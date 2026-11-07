
CREATE TABLE public.server_secrets (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.server_secrets TO service_role;
ALTER TABLE public.server_secrets ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies for anon/authenticated - only service_role bypass reaches this table.

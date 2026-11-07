# Deploy to Vercel while keeping the Lovable Cloud backend

This app can be hosted on a custom domain via Vercel. The frontend and server functions run on Vercel, but the database, auth, and Paynow secrets remain on Lovable Cloud.

## Why this works

- All Paynow and admin setup flows call Lovable Cloud `SECURITY DEFINER` functions.
- The app only needs the Supabase URL and publishable key; the service role key is never used.
- The Vercel build output is configured for the `vercel` Nitro preset in `vite.config.ts`.

## Prerequisites

- A GitHub repository containing this project.
- A Vercel account.
- Your Lovable Cloud Supabase environment variables.

## Required environment variables

In Vercel → Project Settings → Environment Variables, add:

| Name | Value source | Notes |
|------|--------------|-------|
| `VITE_SUPABASE_URL` | Lovable `.env` / Cloud settings | Same as `SUPABASE_URL` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Lovable `.env` / Cloud settings | Public key, safe for browser |
| `VITE_SUPABASE_PROJECT_ID` | Lovable `.env` / Cloud settings | Project identifier |
| `SUPABASE_URL` | Lovable `.env` / Cloud settings | Server-side Supabase URL |
| `SUPABASE_PUBLISHABLE_KEY` | Lovable `.env` / Cloud settings | Server-side Supabase key |

`SUPABASE_SERVICE_ROLE_KEY` is **not** required.

## Deployment steps

1. Push the project to GitHub.
2. In Vercel, create a new project and import the repository.
3. Under **Build & Output Settings**, set:
   - **Framework Preset:** `Other`
   - **Build Command:** `bun run build`
   - **Output Directory:** leave the override disabled; Nitro emits Vercel Build Output API files under `.vercel/output`.
4. Add the environment variables listed above.
5. Click **Deploy**.
6. After the first deployment, verify:
   - `/setup-paynow` loads and saves the Paynow integration key.
   - `/auth` loads and the admin activation flow works.
7. If you are using a custom domain, add it in Vercel → Project Settings → Domains.

## Verification checklist

- [ ] Vercel deployment builds successfully.
- [ ] `/setup-paynow` accepts the Paynow integration key and self-destructs after submission.
- [ ] `/auth` allows the first admin activation and sign-in.
- [ ] Signed-in admin can access `/client-admin` and manage books/orders.

## Troubleshooting

- **Build fails on Vercel:** Make sure the Vercel preset is set in `vite.config.ts` (`nitro: { preset: "vercel" }`).
- **Supabase errors after deploy:** Double-check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are exactly the same as the Lovable Cloud values.
- **Protected server functions return 401:** Confirm `src/start.ts` includes `attachSupabaseAuth` in `functionMiddleware`. This is already configured by default.

## October 2026 deployment repair

The Arena podcast PR #8 was merged as commit `59c60c6`; the Vercel deployment, not the merge, failed. Vercel blocked the pinned `@tanstack/react-start@1.168.32` for CVE-2026-102989. The repository now pins patched Start `1.168.60`, aligns its router packages and uses a frozen Bun lockfile. No vulnerable-deployment override is enabled. Node 22.12+ is required; the generated Vercel function targets Node 22.

The previously omitted `nitro: { preset: "vercel" }` is explicit in `vite.config.ts`; the static `dist` override is removed so server routes use `.vercel/output`. Keep this setting when changing the Lovable wrapper.

The real brand symbol is used without the old white square/circular crop. Browser icons are versioned and the app manifest identifies Great Couples rather than Mockup. Original brand artwork remains available in `public/cdn/`.

`Opus maintenance record` sends minimal main-branch commit and Vercel status evidence to Opus using GitHub Actions OIDC. It needs Actions enabled and `id-token: write`; no permanent webhook secret is needed. After an organisation transfer, verify the existing Vercel project's GitHub integration points to this exact repository and posts statuses. This workflow does not fetch private Vercel runtime logs or modify client billing.

Local verification: `bun install --frozen-lockfile`, `bun run build`, and a direct request to the generated Vercel handler returned HTTP 200 with the homepage, brand mark and podcast section. The repository-wide standalone TypeScript check reports existing strict typing issues in gallery, carousel and UI/store components; Vite production build succeeds. Those unrelated issues are not suppressed by this repair.

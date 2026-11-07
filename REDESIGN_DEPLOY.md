# Great Couples Reimagined

Independent redesign inspired by immersive campaign websites: oversized typography, real photography, white and soft-grey sections, a plum podcast theatre and dedicated Facebook community section.

## Run

Node 22.12+ and Bun 1.4.4:

```sh
bun install --frozen-lockfile
bun run dev --host 0.0.0.0 --port 3000
bun run build
```

Each cloud task is already isolated. Use this checkout; do not create worktrees unless requested.

## Configure

Copy the variable names from `.env.example` into environment settings. Supply the project's Supabase URL and publishable key securely. Local `.env.local` is ignored and is not included in the delivery archive. No private keys are needed by the browser. Store/admin routes remain from the original project and depend on the configured Supabase backend. Using the original backend also uses its real data; use a staging Supabase project to isolate changes while testing. Payments and monthly reporting have not been changed by this visual redesign.

## GitHub repository

This redesign replaces the application files in `Opus-Zimbabwe/test1` while retaining its existing Git history. The original Great Couples production repository is separate. A recoverable archive of test1 before replacement is retained in the cloud workspace.

## Separate Vercel project

Create a new Vercel project and import `Opus-Zimbabwe/test1` with production branch `main`. Framework: Other. Install: `bun install --frozen-lockfile`. Build: `bun run build`. Leave Output Directory override disabled: Nitro creates `.vercel/output`. Add Supabase environment variables listed in `.env.example` securely. Use a new generated `.vercel.app` domain; do not assign the existing production domain.

No Vercel deployment is confirmed. Earlier credentials denied project creation. The app uses a Vercel server build, so Cloudflare deployment needs a compatible server adapter rather than a static upload.

## Validation and media limits

Production build and targeted ESLint checks pass. Chromium desktop/mobile tests cover navigation, podcast selection in both directions, modal opening/closing, archive pause during playback, no mobile horizontal overflow and local image loading. Actual external video playback requires availability and permission from YouTube, TikTok and Facebook, and is not claimed verified. Fullscreen uses the browser Fullscreen API and stays within the site when supported. Facebook has an explicit direct-link fallback. External thumbnails fall back to existing Great Couples photography; those photographs are illustrative previews, not extracted video frames. Six existing episode IDs are featured, not a live monthly feed.

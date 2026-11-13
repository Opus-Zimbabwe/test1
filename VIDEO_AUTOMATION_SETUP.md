# Video library and YouTube updates

## What is ready

`/admin` → **Videos & podcast** supports YouTube, TikTok and Facebook links. Admins can preview a link, change its title and position, choose Podcast or Social videos, hide/show a video, and add a social video to the podcast. Drafts recover on the same device. Publishing succeeds only after the database confirms the write. Public visitors can never write directly to the table.

YouTube uploads are read from Great Couples' public RSS feed. The website caches successful reads for one hour and retries failures after five minutes. A GitHub Actions workflow also checks hourly and saves changed results to `src/data/youtube-feed.json`. It retains up to 60 previously discovered uploads. Current videos remain visible on a failed read; nothing is replaced with fabricated videos.

New YouTube uploads enter **Social videos**, not the podcast automatically. An admin deliberately selects podcast conversations with **Add to podcast**. Manual titles, positions and hidden overrides survive YouTube refreshes. TikTok and Facebook use links supplied by the client/admin.

## One-time database activation

Apply **only** the contents of [`supabase/migrations/20261114001000_content_videos.sql`](supabase/migrations/20261114001000_content_videos.sql) in the project's Supabase SQL editor. This adds a metadata table, public read policy, and the passcode-gated `site_admin_save_video` RPC. It uses the existing database passcode verifier. No service role secret belongs in the browser.

This migration was prepared but **not applied**: the current environment has the public Supabase key, which cannot create tables/functions. A database owner or an authorized database management connection must apply it. Before activation, the admin page clearly marks publishing unavailable and retains device-local drafts. Existing public video sections continue to work.

After applying the migration, click **Recheck setup** in the admin video section, then publish a real video and verify its public placement. No real content was created during testing.

## YouTube automation

The workflow `.github/workflows/youtube-sync.yml` runs at minute 17 every hour and can be started manually from GitHub Actions → **Update Great Couples YouTube videos**. It needs the repository's Actions setting **Read and write permissions** for `GITHUB_TOKEN`; it does not require an OpenAI key or a personal GitHub token. Commits occur only when the feed contents change. Normal branch protection still applies.

The fixed `@greatcouples` handle is resolved to its channel ID. If YouTube blocks handle discovery in a deployment or runner, set the public `UC…` channel ID as the repository variable `YOUTUBE_CHANNEL_ID`, and optionally the same environment variable in Vercel. This is a public identifier, not an API key. No arbitrary external feed URLs are accepted.

Live YouTube discovery/feed retrieval could not be verified in this environment because requests to `www.youtube.com` are blocked. Parser/discovery behavior was verified with fixtures, including duplicate removal, owner checks, dates, retained history and provider failures. A successful first workflow run must still be confirmed. A bundled last-success snapshot is used when available.

## Validation

- Production build and public responsive browser checks.
- `node --experimental-strip-types --test scripts/verify-video-library.mjs` validates provider parsing, URLs, merging and outage behavior.
- `scripts/verify-video-admin.cjs` starts a disposable local database fixture and local app. With `GC_TEST_ADMIN_PASSCODE` supplied privately, it verifies publication, editing, duplicate upsert, hiding, homepage updates, drafts, mobile layout and unauthorized-write rejection. It performs no live database mutations.

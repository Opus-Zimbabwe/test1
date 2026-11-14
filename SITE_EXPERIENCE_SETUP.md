# Hero editing and test-site availability

## Ready in the test deployment

The hero retains the five headings and descriptions from the actual Great Couples website. They were verified against the live route bundle at `https://www.greatcouples.org.zw/assets/routes-CSbK-h7q.js` on 14 November 2026. Existing photographs are retained. Four compatible SVG compositions morph between slides, while photographs and headings transition separately. Nunito remains the font; selected words use a subtle printed texture. The carousel pauses on hover/focus, when off-screen or the tab is hidden, and respects reduced motion. Touch and arrow-key navigation remain available.

Payment-method selection scrolls the checkout dialog to the relevant details form. No payment is created by selection. The OneMoney asset is the actual OneMoney mark from its official site; see `public/images/payments/SOURCES.md`. Book descriptions remain the existing Supabase catalogue text.

The live site has both `/admin` (content administration) and `/auth` → `/client-admin` (account-based books/orders management). Both are retained with their existing authorization. The bookshop console has clearer styling and a link back to website controls.

## One-time activation of website controls

Apply only `supabase/migrations/20261114020000_site_experience.sql` in the Supabase SQL editor. The new metadata table and passcode-gated RPC are isolated by `site_key`. The test Vercel project's `SITE_INSTANCE_ID` is `greatcouples-test`; the original website is untouched. The migration does not modify announcements, books, customer records, credentials or payments.

After applying it, sign into `/admin`, choose **Website controls**, and click **Recheck setup**. Controls become available without another code change. With the current public-only database credentials, this migration cannot be applied from the environment. The interface explicitly keeps publishing and the off switch disabled until the backend exists.

The earlier `20261114001000_content_videos.sql` migration is separately required for video publishing. This settings migration does not replace it.

## Hero editor

Select a slide to change the heading, textured words, description, image URL or shape. Move slides up/down or hide them without deleting their content. At least one slide must stay visible. Drafts are device-local and recoverable; changes affect visitors only after **Publish hero changes** succeeds. Hero writes update only the `heroSlides` JSON key, atomically preserving maintenance state.

## Turn the test website off/on

**Website controls → Site availability** provides a visitor message, confirmation and reversible off/on actions. It does not delete the project or DNS. Availability writes are separate from hero writes; saving a hero draft cannot silently toggle availability. Saving a visitor message also preserves availability.

Public page requests return HTTP 503 with no-store and retry headers during maintenance. Only protected administration and required assets remain reachable. Public receipts and downloads are blocked along with the store and checkout. Signed payment-provider notifications can still settle existing transactions. Already-open public pages check for changes periodically. New checkout requests are also checked server-side before any payment/order creation. The existing production website's checkout remains independent. The account-admin entry at `/auth` is restored in the public navigation; its original role checks and privileges are unchanged.

The runtime caches settings for up to 15 seconds, and browsers refresh them every 30 seconds. Failed refreshes retain last-known-good settings in the running server instance. If an owner uses the optional `SITE_MAINTENANCE_MODE=true` deployment variable as an emergency override, it must be cleared through deployment settings to restore public access.

## Verification

- Local fixture integration: five source headings, shape changes, hero edit/reorder/save, mobile layout, confirmed off/on, 503 responses, reachable admin/auth and payment creation blocked while off.
- Checkout scrolling is checked for EcoCash, card payment and OneMoney. No real prompt, purchase or live shutdown is performed.
- Pure policy tests check path exceptions, animation topology and original-heading parity.
- The current public Supabase key cannot create tables/functions. Live control activation remains a separate database-owner step.

## Updated presentation and loading

The hero now uses straight-sided SVG compositions inspired by the supplied reference, with independent mobile lower-edge masks that also change on every slide. Both variants keep compatible polygon topology for interpolation. The account administrator's original `/auth` entry is restored in the navigation, separately from `/admin`; account authentication, role checks and book/order privileges were not changed.

TikTok no longer starts every preview embed across the whole page. Official oEmbed metadata is cached and requested near the viewport; where TikTok supplies a thumbnail, a lightweight image is used. For these links the provider currently returns no poster metadata, so genuine player previews mount only on visible cards and unload when they leave view. Background previews stop while the selected clip plays. Provider restrictions and network speed still affect playback; unrelated website photos are never substituted.

The store's reading-room display supports selecting real featured books, opening full-description panels and adding to the existing cart. Alternating book presentations replace the repeated card grid. Catalogue data, prices, descriptions and payment/order processing remain unchanged.

The entire “Designed & developed by Opus Zimbabwe” credit links to `https://opuszim.co.zw/`.

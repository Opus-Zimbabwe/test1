# Original-site content retained

Compared the homepage at https://www.greatcouples.org.zw/ with the original repository components on 8 November 2026 (Africa/Harare).

| Original content | Retained implementation |
| --- | --- |
| Brand and marriage-foundations identity | Full original logo artwork in header and footer; white opening with crimson serif headline |
| Counselling, pre-marital and face-to-face/online services | Original Services component, descriptions, three photographs and telephone booking links |
| Moving marriage-foundations message | Original Marquee component |
| Organisation, outreach, vision, mission and programmes | Original About component |
| Seven values and governance information | Original Values component |
| Gallery | Original Gallery component and lightbox; bundled ten photographs remain alongside live gallery images |
| Separate podcast area | MediaTheatre, six existing episode IDs, archive, arrows, dialog and fullscreen control |
| Social videos | Original Videos component with four YouTube and three TikTok embeds and follow links |
| Facebook | Dedicated additional Reel and Facebook community section |
| Announcements | Original live announcement component; original three flyers shown as programme archive when no live rows are available |
| Social profiles and regional groups | Original Community component: Facebook, YouTube, TikTok, Instagram and all five WhatsApp group invitations |
| Contact and booking | Original Contact content, email/phone/address/WhatsApp links and booking bubble; enquiry form opens email composer instead of claiming an unsent message was delivered |
| Bookshop, authentication, admin and payment routes | Existing route files retained |

Validation: production build and targeted ESLint passed. Chromium checks confirmed all sections, three service photographs, at least ten gallery images, five groups, social video embeds, announcements, gallery controls and podcast selection/dialog/pause controls. Mobile navigation and overflow checked at 390, 760 and 1024 pixels. No broken local images or JavaScript page errors were observed. External media playback, payment processing and admin operations were not exercised.

## 13 November reference update

Replaced the static opening with an inset, rounded photo carousel with a bottom-to-transparent teal gradient. Added a Who We Are photo carousel with blurred neighbours. Rebuilt the three service cards around the supplied pale-blue photographic reference, including curved description panels. Rounded Nunito typography is bundled locally with its OFL licence; service headings retain the reference's serif treatment. Removed decorative heading labels and decorative icon badges while keeping functional controls, social links and accessibility labels. Original content sections and Supabase support remain.

The production build without Supabase settings passed the public-page regression at 1440px and 390px. Separate browser checks covered carousel arrows, blur navigation, service images, original sections, groups and no horizontal overflow at 390/760/1024px. The previous Supabase crash fix remains unchanged.

## Brand refinement — 13 November

Returned the interface to the logo's purple and pink-red, with white/grey content surfaces and grey secondary text. Nunito now applies to every text section, including service headings. Hero copy is centred. Navigation sticks above the page and gains a translucent blurred surface after scrolling. The footer's boxed logo was replaced by a transparent decorative watermark, and the header uses transparent artwork.

Service photographs now form the entire rounded card, with shaped heading/description overlays and motion on hover/focus. Country group links retain all five original invitations and include local Zimbabwe, Kenya, Malawi and Zambia flags; the men's group has a non-country symbol. Scroll entry, flag and service transitions respect reduced-motion preferences. Gallery overlays remain above the sticky navigation.

Verified: production build; changed-component lint; desktop brand/typography checks; sticky/blur navigation; service hover motion; footer watermark; flag loading; group preservation; no overflow at 390/760/1024 pixels; public-page production fallback without Supabase variables at 1440 and 390 pixels. External media playback and live Vercel deployment remain unverified.

## Cinematic media and footer integration — 13 November

Integrated the supplied Beam Wordmark Footer into the existing shadcn-style `src/components/ui` directory. Adapted its colours, Nunito family, brand name, social marks, real links and credits to Great Couples. The beam responds to the pointer and drifts only while visible; reduced-motion settings are respected. No component dependency installation was needed.

Navigation now uses a smaller logo crop without the tagline and has no booking button. Added local canonical social brand marks, a prominent WhatsApp mark, scroll-responsive background finishing and curved section boundaries. The gallery is now two opposing photographic ribbons with pause, manual scrolling and an accessible lightbox. All original photographs remain. Announcements use a featured full-size flyer and selectable event index, with an explicitly identified archive when live data is unavailable.

The podcast is now an inline player with an eight-item playlist, transport controls and fullscreen. It includes the three existing YouTube IDs plus the five TikTok podcast links supplied by the user: 7707735777718930706, 7707357261047532821, 7705848215546891540, 7704939703518121237 and 7705073907186863380. The general social section separately retains four YouTube and three older TikTok posts. Video dialogs have keyboard dismissal, focus management, fullscreen and source-link fallbacks. Where remote thumbnails are unavailable, existing Great Couples community photographs are used as cover artwork; these are not extracted video frames.

Validation: changed-component lint and production build pass. Desktop/mobile checks covered the supplied TikTok IDs, inline playback selection/stop, media dialogs, gallery and flyer interactions, brand image loading, all five group invitations, footer links and no horizontal overflow at 390/760/1024px. Generated production output without Supabase variables returned HTTP 200 and retained all public sections at 1440 and 390px. Gallery motion/pause and footer pointer/beam/letter interactions were also checked. Actual external video playback and the live Vercel deployment remain unverified. Existing repository-wide type errors outside changed files remain.

Brand mark assets are sourced from the Simple Icons project. The footer component was supplied by the user in Pasted text.txt and adapted to this project.

## Store, navigation and final framing refinements

The pending experience redesign was recovered after the environment restart. Added shared scroll-responsive navigation with a moving active-link surface, an inset glass treatment and reading progress. Both the homepage and storefront use it. Hero transport buttons are removed; automatic slides, swipe and slide selectors remain. Hero motion pauses on hover/focus and respects reduced motion.

Renamed the services heading to Our Services. Removed the repeated thumbnail/filmstrip rows from the podcast, keeping one player and one eight-item playlist. Replaced the empty About highlight circles with visible bold rounded symbols. About portrait framing now uses top-aligned portrait compositions, checked visually on desktop/mobile to keep heads visible. Vision, Mission and What We Do retain their original copy with larger type and an editorial split composition. The guiding-values marquee is now large moving typography. Social logos use recognisable brand colours, including the colour Instagram gradient and TikTok mark.

Store changes preserve the existing catalogue, download and Paynow handlers. Added branded store typography, cover-led display, search, print/digital filtering, a useful empty state, explicit Back home navigation and an accessible cart/checkout dialog. Missing CMS configuration is handled safely for cover images. No fictitious books were added to the production catalogue. Store browser checks use explicitly named test products intercepted in the browser only; they do not submit a purchase or create products in the database.

Validation: production builds with and without Supabase settings pass; changed-component lint passes; no type errors are reported in the changed files (pre-existing unrelated repository type errors remain). Desktop/mobile/tablet checks cover the service heading, absent hero transport buttons, simplified podcast, visible About symbols, framing, navigation, catalogue search/filtering, cart quantities, checkout validation and Escape dismissal. The production build without Supabase settings also passes homepage/gallery tests and storefront/empty-cart/Back home tests. All five group links and all original sections remain. Real payment submission, actual external video playback and live Vercel deployment have not been exercised.

## Separate channels and image-led announcements

YouTube and TikTok are now separate visible sections in both the podcast and general social-video areas, rather than mixed playlists or platform tabs. The podcast keeps its three YouTube conversations and the five TikTok links supplied by the user, in the supplied order. Only one podcast player can be active. TikTok preview rotation advances every 8.5 seconds while visible and idle; it pauses during playback, hover/focus, offscreen or reduced-motion preference. Videos themselves do not autoplay with preview rotation.

Every announcement now has its own independent image-and-details presentation. Original portrait and square proportions are retained using natural sizing and contain fitting, without an arch mask or cropping. Full-size image dialogs and meaningful archive context remain. Navigation highlights the parent Podcast/Social videos entry while browsing a nested channel.

Verified: production build; changed-file lint and type checks; desktop/mobile/tablet section separation and image fitting; all five TikTok embed IDs; mutually exclusive podcast playback; flyer dialogs; preview advance and hover pause in production; and public-page regression without Supabase variables. External media playback and the live deployment are not claimed verified.

### Content publishing workflow
- Announcement composer now includes live wide/mobile previews, browser-local autosaved drafts with explicit recovery, reusable formats, and reuse of existing posts.
- Existing server-authorized publication remains the only publish path. No background scheduling, social publishing, payment automation, or live upload has been enabled or claimed by this change.
- A discreet, accessible footer lock opens `/admin`; hiding the link does not replace authentication.
- Podcast channels now pan slowly as horizontal rails, stop on hover/focus/open player, respect reduced motion, and use provider media rather than unrelated website photos for TikTok previews. Provider availability still controls external playback.
- Marriage counselling copy no longer promises that counselling is free.

### Channel visibility and admin verifier
- Confirmed the requested admin password is already accepted by the live database verifier, while an incorrect password is rejected. Replaced the plaintext server copy with a SHA-256 verifier and timing-safe comparison; client bundles contain no verifier. Included a matching SQL migration to replace the database's existing plaintext comparison when migrations are applied; it preserves the accepted credential.
- Podcast channel headings are white, with prominent Subscribe/Follow actions. General TikTok shelf now includes all five supplied podcast clips plus three original clips (eight total).
- Strengthened YouTube/TikTok/Facebook follow actions and added direct links to each channel's full video library.
- The supplied Facebook share link resolves to the already embedded Reel; it is not repeated. Additional YouTube/Facebook embeds require verified links: YouTube listing requests were blocked and Facebook's public channel listing did not expose additional video IDs. Existing four YouTube videos and original Facebook Reel are retained.
- Validation: production build; browser password acceptance/rejection (no content mutations); white headings and channel actions; public experience suite at desktop/mobile widths.

### YouTube automation and editable video library
- Added YouTube public-feed discovery, cache/retry, retained feed snapshots, and an hourly GitHub Actions workflow. New uploads go into the YouTube social section; podcast selection stays curated.
- Added shared video metadata/RPC migration and an admin video workspace with link validation, preview, device-local draft recovery, title/position/placement controls, hide/show, search, and Add to podcast.
- Homepage podcast/social/Facebook sections merge curated records with existing content and YouTube imports; hidden/manual overrides survive refreshes. No original default videos were removed.
- Database migration activation and a successful live YouTube workflow remain unverified/blocked by current access. See VIDEO_AUTOMATION_SETUP.md. The admin page does not claim to publish before database setup.

### Live announcements/books connection and admin workspace
- Configured the test Vercel project's public/browser and server Supabase variables using the existing live content source. No live announcement, book, price, stock, gallery or payment records were changed.
- Verified all 8 current announcements and all 3 active books. Their storage flyers/covers return HTTP 200. Equal announcement priorities now use newest creation time first; failed refreshes retain last-known-good content.
- Resolved signed storage book covers in the store opening display as well as catalogue cards; protected against stale asynchronous image results.
- Added a responsive admin sidebar, larger typography, catalogue view with search/prices/stock and secure book-management link, announcement search/order/refresh/preview tools, and a sign-in readiness guard.
- Configured a server-only password verifier environment variable and verified the requested credential against the existing database; incorrect credentials fail. The database password itself was already the requested value.
- Content remains connected to the original CMS: subsequent authenticated edits to shared records affect both sites. Read-only verification and local checks did not publish any content or submit payments. The separate content_videos migration remains required for video publishing.

### Morphing hero, checkout handoff and website controls
- Replaced the three rewritten hero captions with all five exact headings/descriptions verified in the live site's route bundle. Added compatible morphing photo masks, printed-text emphasis, reduced-motion behavior and accessible carousel navigation. Original people/photos remain; mobile keeps faces above the copy.
- Checkout selection scrolls to the appropriate form, with the official OneMoney logo bundled from its own website. Catalogue descriptions are unchanged source data.
- Added an uncluttered hero editor and reversible, confirmed maintenance control under Website controls. Settings are scoped to the test site; atomic section writes prevent hero changes from toggling availability. No live shutdown was performed.
- Maintenance returns public 503 responses, preserves admin/account/receipt access and guards checkout server-side. New settings require the documented site_experience migration; disabled controls clearly report pending setup.
- Preserved both actual admin routes and account authorization, and refined the bookshop console's presentation and navigation. See SITE_EXPERIENCE_SETUP.md for activation and limitations.

### Angular/mobile hero, reading room, admin restoration and strict off mode
- Replaced wavy photo masks with compatible polygon cuts and added independent changing mobile masks. The five original headings remain intact.
- Restored the separate `/auth` account-admin entry without altering authentication or role-gated book/order functions. The `/admin` content workspace stays separate.
- Off mode now blocks all public pages including receipts, plus public receipt/download actions. Protected admin recovery and signed provider POST notifications remain available; the previous public-receipt exception was removed. Control activation still needs the settings migration.
- TikTok uses cached official poster metadata when supplied, otherwise visible-only genuine previews, with background previews removed during playback. The provider currently returns no poster metadata for the supplied clips; no unrelated images were added.
- Rebuilt the store as a reading room with a selectable book display, alternating full-width product presentations and book-detail-to-cart flow. All data and existing checkout logic are retained.
- Linked the whole developer credit to https://opuszim.co.zw/.

### Scroll progress refinement
- Replaced width-stepped progress with a spring-smoothed transform running left to right, using the requested purple-to-reddish-pink gradient. Document/window resizing updates the target, while reduced-motion visitors receive direct progress updates.
- Verified a genuine intermediate animation position, the settled reading fraction, and both gradient endpoints in the browser.

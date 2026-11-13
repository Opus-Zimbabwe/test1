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

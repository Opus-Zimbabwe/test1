import { SiteNavigation } from "./SiteNavigation";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { BrandLogo } from "./BrandLogo";
import { SignatureHero } from "./SignatureHero";
import { WhoWeAre } from "./WhoWeAre";
import { ArrowRight } from "lucide-react";
import { About } from "./About";
import { Values } from "./Values";
import { Services } from "./Services";
import { Gallery } from "./Gallery";
import { Videos } from "./Videos";
import { Announcements } from "./Announcements";
import { Community } from "./Community";
import { Contact } from "./Contact";
import { Marquee } from "./Marquee";

import { MediaTheatre } from "./MediaTheatre";
import { Footer } from "./Footer";
import "./editorial.css";
import "./experience.css";
const reel = "https://www.facebook.com/reel/29635817456011458/";
export function EditorialHome() {
  return (
    <main className="gc-editorial" id="top">
      <AmbientBackdrop />
      <SiteNavigation />
      <SignatureHero />
      <WhoWeAre />
      <Services />
      <Marquee />
      <About />
      <Values />
      <Gallery />
      <MediaTheatre />
      <Videos />
      <section id="facebook" className="gc-facebook">
        <div>
          <BrandLogo brand="facebook" className="gc-facebook-emblem" size={52} />
          <h2>
            More than a feed.
            <br />
            <em>A community.</em>
          </h2>
          <p>
            Conversations, celebrations and everyday encouragement from the Great Couples family.
            Keep up with our stories and join the conversation.
          </p>
          <a
            className="gc-button gc-button-light"
            href="https://www.facebook.com/share/1DMYvcv24u/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit our Facebook <ArrowRight size={17} />
          </a>
        </div>
        <div className="gc-facebook-frame">
          <iframe
            title="Great Couples Facebook Reel"
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reel)}&show_text=false&width=360`}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
          <a href={reel} target="_blank" rel="noopener noreferrer">
            Watch the shared Reel on Facebook <ArrowRight size={17} />
          </a>
          <p>Can't play the Reel? Open it on Facebook.</p>
        </div>
        <img
          className="gc-facebook-photo"
          src="/cdn/e32ef967-c74f-42e5-a8c6-2fe75d3bbf4f/gc-1.jpg"
          alt="A couple sharing a joyful moment at a Great Couples gathering"
          loading="lazy"
        />
      </section>
      <Announcements />
      <Community />
      <Contact />
      <Footer />
    </main>
  );
}

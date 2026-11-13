import { useVideos } from "@/lib/use-video-library";
import { clipLink } from "./media";
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
export function EditorialHome() {
  const facebookVideos = useVideos("social", "facebook");
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
            className="gc-button gc-facebook-follow"
            href="https://www.facebook.com/share/1DMYvcv24u/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on Facebook <ArrowRight size={17} />
          </a>
          <a
            className="gc-video-library"
            href="https://www.facebook.com/gr8couples/videos/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore all Facebook videos <ArrowRight size={19} />
          </a>
        </div>
        <div className="gc-facebook-reels" aria-label="Great Couples Facebook videos">
          {facebookVideos.map((clip, index) => {
            const video = clipLink(clip);
            return (
              <div className="gc-facebook-frame" key={video}>
                <iframe
                  title={`Great Couples Facebook Reel ${index + 1}`}
                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video)}&show_text=false&width=360`}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                />
                <a href={video} target="_blank" rel="noopener noreferrer">
                  Watch on Facebook <ArrowRight size={17} />
                </a>
              </div>
            );
          })}
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

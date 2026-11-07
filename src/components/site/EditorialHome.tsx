import { useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { MediaTheatre } from "./MediaTheatre";

import { Footer } from "./Footer";
import "./editorial.css";
const photos = {
  hero: "/cdn/4edf1fff-1d53-405c-b8f3-66f688fbc4ad/gc-8.jpg",
  couple: "/cdn/b5678dc9-e94a-4d2d-b51e-96ace5f5536b/gc-3.jpg",
  love: "/cdn/e32ef967-c74f-42e5-a8c6-2fe75d3bbf4f/gc-1.jpg",
};
const reel = "https://www.facebook.com/reel/29635817456011458/";
export function EditorialHome() {
  const [menu, setMenu] = useState(false);
  return (
    <main className="gc-editorial" id="top">
      <header className="gc-nav">
        <a className="gc-brand" href="#top">
          <img
            src="/cdn/cbb32bda-7bdd-4316-8ee2-a08473075ba3/gc-logo.png"
            alt="Great Couples International Trust"
          />
        </a>
        <button
          className="gc-menu"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <nav className={menu ? "is-open" : ""} aria-label="Main navigation">
          {[
            ["#about", "Our story"],
            ["#services", "Counselling"],
            ["#podcast", "Podcast"],
            ["#facebook", "Facebook"],
            ["/store", "Bookshop"],
          ].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
          <a className="gc-button" href="#contact" onClick={() => setMenu(false)}>
            Book a session <ArrowUpRight size={16} />
          </a>
        </nav>
      </header>
      <section className="gc-hero">
        <img
          className="gc-hero-photo"
          src={photos.hero}
          alt="A Great Couples couple celebrating together"
          fetchPriority="high"
        />
        <div className="gc-hero-shade" />
        <div className="gc-hero-copy">
          <p className="gc-eyebrow">Great Couples International Trust / Zimbabwe</p>
          <h1>
            Love, for the
            <br />
            <em>long run.</em>
            <br />
          </h1>
          <p>
            Real connection. Renewed commitment. A community walking with you through every season
            of love.
          </p>
          <a className="gc-button" href="#services">
            Find your next chapter <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="gc-hero-foot">
          <span>Building & promoting marriage foundations</span>
          <a href="#about" aria-label="Explore our story">
            <ArrowDown size={22} />
          </a>
        </div>
      </section>
      <section id="about" className="gc-story gc-section">
        <div>
          <p className="gc-eyebrow">01 / Our purpose</p>
          <h2>
            More than a moment.
            <br />
            <em>A life together.</em>
          </h2>
          <p className="gc-body">
            We are a Christian faith-based organisation helping couples build lasting foundations
            through marriage guidance, counselling and community.
          </p>
          <p className="gc-body">
            From the first steps towards marriage to finding your way back to each other, there is a
            place for you here.
          </p>
          <a className="gc-text-link" href="#contact">
            Get to know us <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="gc-photo-composition">
          <img
            src={photos.couple}
            alt="A couple holding hands at a Great Couples gathering"
            loading="lazy"
          />
          <img src={photos.love} alt="A joyful moment shared by a couple" loading="lazy" />
          <span>
            Rooted in faith.
            <br />
            Built on love.
          </span>
        </div>
      </section>
      <section id="services" className="gc-services gc-section">
        <div className="gc-section-heading">
          <div>
            <p className="gc-eyebrow">02 / Here for you</p>
            <h2>
              Every season.
              <br />
              <em>Every step.</em>
            </h2>
          </div>
          <p className="gc-body">
            Meaningful support for your relationship, in person in Harare or online wherever life
            takes you.
          </p>
        </div>
        <div className="gc-service-list">
          {[
            [
              "01",
              "Marriage counselling",
              "Space to reconnect, rebuild trust and strengthen your marriage.",
            ],
            [
              "02",
              "Preparing for marriage",
              "Practical, biblical guidance for a shared life together.",
            ],
            ["03", "Face to face & online", "Personal support that fits your life, near or far."],
          ].map(([n, title, body]) => (
            <a href="#contact" key={n}>
              <span className="gc-service-number">{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <ArrowUpRight />
            </a>
          ))}
        </div>
      </section>
      <div className="gc-podcast">
        <MediaTheatre />
      </div>
      <section id="facebook" className="gc-facebook gc-section">
        <div>
          <p className="gc-eyebrow">
            <span className="gc-facebook-mark">f</span> Facebook / Our community
          </p>
          <h2>
            Real people.
            <br />
            <em>Real connection.</em>
          </h2>
          <p className="gc-body">
            The conversations, celebrations and everyday moments that bring our community closer.
            Discover more from Great Couples on Facebook.
          </p>
          <a className="gc-text-link" href={reel} target="_blank" rel="noopener noreferrer">
            View the shared Reel <ArrowUpRight size={18} />
          </a>
          <p className="gc-caption">
            Facebook controls video availability and may require sign-in.
          </p>
        </div>
        <div className="gc-facebook-player">
          <iframe
            title="Great Couples Facebook Reel"
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(reel)}&show_text=false&width=360`}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
          <a href={reel} target="_blank" rel="noopener noreferrer">
            Open Reel on Facebook <ArrowUpRight size={16} />
          </a>
        </div>
        <img
          className="gc-facebook-photo"
          src={photos.love}
          loading="lazy"
          alt="Great Couples community members enjoying time together"
        />
      </section>

      <section id="contact" className="gc-contact gc-section">
        <p className="gc-eyebrow">Your next chapter starts here</p>
        <h2>
          Make time for
          <br />
          <em>what matters.</em>
        </h2>
        <p>Reach out for counselling, marriage guidance or a conversation about how we can help.</p>
        <a className="gc-button" href="mailto:greatcouplestrust@gmail.com">
          Let’s talk <ArrowUpRight size={18} />
        </a>
        <a className="gc-contact-email" href="mailto:greatcouplestrust@gmail.com">
          greatcouplestrust@gmail.com
        </a>
      </section>
      <Footer />
    </main>
  );
}

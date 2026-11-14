import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PHOTOS } from "./assets";
const images = [PHOTOS[2]!, PHOTOS[7]!, PHOTOS[0]!, PHOTOS[8]!];
export function WhoWeAre() {
  const [index, setIndex] = useState(0);
  return (
    <section id="who-we-are" className="gc-who" aria-labelledby="gc-who-title">
      <div className="gc-who-copy">
        <h2 id="gc-who-title">Who we are.</h2>
        <p>
          We’re Great Couples International Trust. We believe strong marriages build stronger
          families — and stronger communities.
        </p>
        <p>
          Through faith, counselling and hands-on outreach, we walk with men, women and children in
          Zimbabwe, across Africa and beyond.
        </p>
        <a href="#about">
          Our story <ArrowRight size={18} />
        </a>
      </div>
      <div className="gc-blur-gallery" aria-label="Great Couples photo stories">
        <img
          className="gc-blur-prev"
          src={images[(index + images.length - 1) % images.length]}
          alt=""
          aria-hidden="true"
        />
        <img
          className="gc-blur-current"
          src={images[index]}
          alt={`Great Couples community photograph ${index + 1}`}
        />
        <img
          className="gc-blur-next"
          src={images[(index + 1) % images.length]}
          alt=""
          aria-hidden="true"
        />
        <div className="gc-blur-controls">
          <button
            aria-label="Previous community photograph"
            onClick={() => setIndex((i) => (i + images.length - 1) % images.length)}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            aria-label="Next community photograph"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

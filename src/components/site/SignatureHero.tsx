import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { PHOTOS } from "./assets";
const slides = [
  {
    src: PHOTOS[7],
    title: "A stronger love.\nA fuller life.",
    body: "Build a marriage rooted in faith, friendship and the joy of growing together.",
  },
  {
    src: PHOTOS[2],
    title: "Every chapter.\nTogether.",
    body: "Practical guidance and compassionate counselling for every season of your relationship.",
  },
  {
    src: PHOTOS[0],
    title: "Real connection.\nLasting foundations.",
    body: "A community walking with couples and families across Zimbabwe and beyond.",
  },
];
export function SignatureHero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const touchStart = useRef<number | null>(null);
  const step = (direction: number) =>
    setIndex((i) => (i + direction + slides.length) % slides.length);
  useEffect(() => {
    if (paused || focused || reduced) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(timer);
  }, [paused, focused, reduced]);
  const slide = slides[index]!;
  return (
    <section
      className="gc-signature-hero"
      aria-roledescription="carousel"
      aria-label="Great Couples stories"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX;
        if (start !== null && end !== undefined && Math.abs(end - start) > 50)
          step(end > start ? -1 : 1);
        touchStart.current = null;
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="gc-hero-images">
        {slides.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={i === index ? "A couple at a Great Couples gathering" : ""}
            aria-hidden={i !== index}
            className={i === index ? "active" : ""}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        ))}
      </div>
      <div className="gc-hero-tint" />
      <div className="gc-signature-copy" aria-live={paused || focused ? "polite" : "off"}>
        <h1>
          {slide.title.split("\n").map((line, i) => (
            <span key={line}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>
        <p>{slide.body}</p>
        <a className="gc-button" href="#contact">
          Start your journey <ArrowRight size={18} />
        </a>
      </div>
      <div className="gc-hero-controls">
        <div className="gc-hero-dots">
          {slides.map((s, i) => (
            <button
              key={s.src}
              aria-label={`Show hero slide ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div>
          <button aria-label="Previous hero slide" onClick={() => step(-1)}>
            <ArrowLeft size={18} />
          </button>
          <button
            aria-label={paused ? "Resume hero slideshow" : "Pause hero slideshow"}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button aria-label="Next hero slide" onClick={() => step(1)}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

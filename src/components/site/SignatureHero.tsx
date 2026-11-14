import {
  HERO_PATHS,
  MOBILE_HERO_PATHS,
  HEART_HERO_PATH,
  MOBILE_HEART_HERO_PATH,
} from "./hero-shapes";
import { useEffect, useId, useRef, useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useInView } from "framer-motion";
import { useSiteExperience } from "@/lib/use-site-experience";
import type { HeroSlide } from "@/lib/site-experience";
import "./morph-hero.css";
function TexturedTitle({ slide }: { slide: HeroSlide }) {
  const start = slide.emphasis
    ? slide.title.toLowerCase().indexOf(slide.emphasis.toLowerCase())
    : -1;
  return (
    <h1>
      {start < 0 ? (
        slide.title
      ) : (
        <>
          {slide.title.slice(0, start)}
          <span className="gc-grain-type">
            {slide.title.slice(start, start + slide.emphasis.length)}
          </span>
          {slide.title.slice(start + slide.emphasis.length)}
        </>
      )}
    </h1>
  );
}
export function SignatureHero() {
  const { settings } = useSiteExperience();
  const slides = useMemo(
    () => settings.heroSlides.filter((slide) => slide.active),
    [settings.heroSlides],
  );
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();
  const container = useRef<HTMLElement>(null);
  const inView = useInView(container, { amount: 0.15 });
  const touch = useRef<number | null>(null);
  const uid = useId().replace(/:/g, "");
  const current = index % slides.length;
  const slide = slides[current]!;
  const isHeart = (item: HeroSlide) =>
    item.id === "enjoy-marriage" || /you deserve to enjoy your marriage/i.test(item.title);
  const desktopPath = (item: HeroSlide) =>
    isHeart(item) ? HEART_HERO_PATH : HERO_PATHS[item.shape];
  const mobilePath = (item: HeroSlide) =>
    isHeart(item) ? MOBILE_HEART_HERO_PATH : MOBILE_HERO_PATHS[item.shape];
  useEffect(() => {
    const next = slides[(current + 1) % slides.length];
    if (next) {
      const preload = new Image();
      preload.decoding = "async";
      preload.fetchPriority = "low";
      preload.src = next.image;
    }
  }, [current, slides]);
  useEffect(() => {
    const changed = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", changed);
    return () => document.removeEventListener("visibilitychange", changed);
  }, []);
  useEffect(() => {
    if (!inView || hovered || focused || hidden || reduced || slides.length < 2) return;
    const timer = setTimeout(() => setIndex((value) => (value + 1) % slides.length), 7500);
    return () => clearTimeout(timer);
  }, [current, slides.length, hovered, focused, hidden, reduced, inView]);
  const step = (direction: number) =>
    setIndex((value) => (value + direction + slides.length) % slides.length);
  return (
    <section
      ref={container}
      className="gc-signature-hero gc-morph-hero"
      data-shape={isHeart(slide) ? "heart" : slide.shape}
      data-long-title={slide.title.length > 36}
      data-foundations={slide.id === "foundations"}
      aria-label="Great Couples stories"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
      onTouchStart={(event) => {
        touch.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const end = event.changedTouches[0]?.clientX;
        if (touch.current !== null && end !== undefined && Math.abs(end - touch.current) > 50)
          step(end > touch.current ? -1 : 1);
        touch.current = null;
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <svg width="0" height="0" aria-hidden="true" className="gc-hero-clip-defs">
        <defs>
          <clipPath id={`gc-morph-${uid}`} clipPathUnits="objectBoundingBox">
            <motion.path
              initial={{ d: desktopPath(slides[0]!) }}
              animate={{ d: desktopPath(slide) }}
              transition={{ duration: reduced ? 0 : 1.25, ease: [0.22, 0.68, 0.1, 1] }}
            />
          </clipPath>
          <clipPath id={`gc-morph-mobile-${uid}`} clipPathUnits="objectBoundingBox">
            <motion.path
              initial={{ d: mobilePath(slides[0]!) }}
              animate={{ d: mobilePath(slide) }}
              transition={{ duration: reduced ? 0 : 1.25, ease: [0.22, 0.68, 0.1, 1] }}
            />
          </clipPath>
          <mask
            id={`gc-heart-extension-${uid}`}
            maskUnits="objectBoundingBox"
            maskContentUnits="objectBoundingBox"
            x="0"
            y="0"
            width="1"
            height="1"
            style={{ maskType: "luminance" }}
          >
            <path
              fill="white"
              d="M .19 0 L 1 0 L 1 1 L .50 .98 C .51 .98 .52 .97 .54 .95 C .76 .75 1 .50 1 .28 C 1 .04 .82 -.12 .54 .19 C .52 .21 .515 .225 .50 .225 C .485 .225 .48 .21 .46 .19 C .35 .07 .26 .02 .19 .02 Z"
            />
            <path
              d={HEART_HERO_PATH}
              fill="black"
              stroke="black"
              strokeWidth=".035"
              strokeLinejoin="round"
            />
            <path d={HEART_HERO_PATH} fill="white" />
          </mask>
        </defs>
      </svg>
      <div
        className="gc-morph-photograph"
        style={
          {
            "--gc-desktop-clip": `url(#gc-morph-${uid})`,
            "--gc-mobile-clip": `url(#gc-morph-mobile-${uid})`,
            "--gc-heart-extension": `url(#gc-heart-extension-${uid})`,
          } as React.CSSProperties
        }
      >
        <AnimatePresence initial={false}>
          {
            <motion.img
              key={slide.image}
              src={slide.image}
              alt="Great Couples members sharing a moment together"
              initial={{ opacity: 0, scale: reduced ? 1 : 1.035 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 1.3 }}
              fetchPriority={current === 0 ? "high" : "auto"}
            />
          }
        </AnimatePresence>
        <div className="gc-morph-photo-wash" />
      </div>
      <div className="gc-morph-copy" aria-live={focused ? "polite" : "off"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -10 }}
            transition={{ duration: reduced ? 0 : 0.35 }}
          >
            <TexturedTitle slide={slide} />
            <p>{slide.body}</p>
            <a className="gc-button" href="#contact">
              Start your journey <ArrowRight size={20} />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="gc-morph-navigation">
        <div className="gc-hero-dots">
          {slides.map((item, i) => (
            <button
              key={item.id}
              disabled={!ready}
              aria-label={`Show hero slide ${i + 1}`}
              title={item.title}
              aria-pressed={i === current}
              onClick={() => setIndex(i)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

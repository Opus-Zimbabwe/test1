import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, ArrowRight, Store } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PHOTOS } from "./assets";

const SLIDES = [
  {
    img: PHOTOS[0],
    title: "Building & Promoting Marriage Foundations",
    sub: "God-centered families across Africa and beyond.",
  },
  {
    img: PHOTOS[2],
    title: "Marriage Counselling Sessions",
    sub: "Compassionate, biblical counselling for couples in every season.",
  },
  {
    img: PHOTOS[1],
    title: "Pre-Marital Counselling",
    sub: "Lay a firm foundation before you say I do.",
  },
  {
    img: PHOTOS[4],
    title: "Prison & Community Outreach",
    sub: "Restoring hope in Harare Central, Chikurubi, Mutoko, Hwedza and beyond.",
  },
  {
    img: PHOTOS[7],
    title: "You Deserve to Enjoy Your Marriage",
    sub: "Book your session today. We're one call away.",
  },
];

const PROGRAMMES = ["Marriage Counselling", "Pre-Marital", "Relationship Coaching"];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % SLIDES.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

return (
  <div id="top" className="relative">
    <section className="relative isolate min-h-[28rem] overflow-hidden bg-charcoal sm:min-h-[32rem]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          <div
            className="ken-burns absolute inset-0 bg-cover bg-center grayscale-[.35]"
            style={{ backgroundImage: `url(${slide.img})`, backgroundPosition: "center 35%" }}
          />
          <div className="absolute inset-0 bg-charcoal/67 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,13,33,.5),rgba(24,13,33,.35),rgba(24,13,33,.55))]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-6xl flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:min-h-[32rem] sm:px-6 sm:pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="max-w-3xl"
          >
            <p className="mb-3 text-[.62rem] font-semibold uppercase tracking-[.2em] text-white/75">
              Great Couples International Trust
            </p>
            <h1 className="text-[clamp(2.35rem,5vw,4.1rem)] font-bold leading-[1.1] text-white drop-shadow-sm">
              {slide.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-[.98rem]">
              {slide.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          <a
            href="tel:+263777308726"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-bold text-accent-foreground shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:brightness-105"
          >
            <Phone className="h-3.5 w-3.5" /> Book Your Session
          </a>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/5 px-5 py-3 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-primary"
          >
            <Store className="h-3.5 w-3.5" /> Visit Store
          </Link>
          <a
            href="#about"
            className="hidden items-center gap-1.5 px-2 py-3 text-xs font-bold text-white/80 transition hover:text-white sm:inline-flex"
          >
            Explore <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-12">
        {SLIDES.map((_, slideIndex) => (
          <button
            key={slideIndex}
            aria-label={`Slide ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            onClick={() => setIndex(slideIndex)}
            className={`h-1.5 rounded-full transition-all ${slideIndex === index ? "w-7 bg-accent" : "w-1.5 bg-white/55 hover:bg-white"}`}
          />
         ))}
      </div>
    </section>

    <div className="relative z-20 mx-auto hidden w-[min(90%,48rem)] items-center justify-around rounded-xl border border-primary/8 bg-white px-5 py-4 shadow-[0_16px_40px_-24px_rgba(31,15,48,.55)] sm:-mt-8 sm:flex">
      {PROGRAMMES.map((programme, programmeIndex) => (
        <div
          key={programme}
          className="flex items-center gap-2.5 text-[.68rem] font-semibold text-primary"
        >
          {programmeIndex > 0 && (
            <span className="-ml-4 mr-1.5 h-6 w-px bg-primary/10" />
          )}
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {programme}
        </div>
      ))}
    </div>
  </div>
);
}

import { useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play, X } from "lucide-react";
import { PHOTOS } from "./assets";
import { useGalleryImages, useSignedImageUrl } from "@/lib/db";
function Photo({ src, alt }: { src: string; alt: string }) {
  const url = useSignedImageUrl(src, "gallery");
  return <img src={url || src} alt={alt} loading="lazy" />;
}
export function Gallery() {
  const { rows } = useGalleryImages();
  const images = useMemo(() => [...new Set([...rows.map((v) => v.src), ...PHOTOS])], [rows]);
  const [open, setOpen] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const section = useRef<HTMLElement>(null);
  const visible = useInView(section, { amount: 0.1 });
  const rails = useRef<(HTMLDivElement | null)[]>([]);
  const move = (d: number) =>
    rails.current.forEach((r) => r?.scrollBy({ left: d * 350, behavior: "smooth" }));
  return (
    <section
      id="gallery"
      ref={section}
      className={`gc-restoration ${paused || open !== null || !visible ? "motion-paused" : ""}`}
    >
      <div className="gc-restoration-heading">
        <h2>
          Moments of
          <br />
          <span>restoration.</span>
        </h2>
        <div>
          <button
            aria-label={paused ? "Resume gallery motion" : "Pause gallery motion"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={19} /> : <Pause size={19} />}
          </button>
          <button aria-label="Scroll gallery left" onClick={() => move(-1)}>
            <ArrowLeft size={21} />
          </button>
          <button aria-label="Scroll gallery right" onClick={() => move(1)}>
            <ArrowRight size={21} />
          </button>
        </div>
      </div>
      {[0, 1].map((row) => {
        const subset = images
          .map((src, index) => ({ src, index }))
          .filter((v) => v.index % 2 === row);
        return (
          <div
            key={row}
            ref={(e) => {
              rails.current[row] = e;
            }}
            className={`gc-gallery-ribbon row-${row}`}
            tabIndex={0}
            aria-label={`Gallery row ${row + 1}; scroll or pause to browse`}
          >
            <div className="gc-gallery-track">
              {[...subset, ...subset].map((v, i) => (
                <button
                  key={v.src + i}
                  className="gc-gallery-photo"
                  aria-label={`Open gallery photograph ${v.index + 1}`}
                  aria-hidden={i >= subset.length || undefined}
                  tabIndex={i >= subset.length ? -1 : 0}
                  onClick={() => setOpen(v.index)}
                >
                  <Photo src={v.src} alt={`Great Couples photograph ${v.index + 1}`} />
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <Dialog.Root
        open={open !== null}
        onOpenChange={(value) => {
          if (!value) setOpen(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="gc-dialog-overlay" />
          <Dialog.Content
            className="gc-gallery-dialog"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft")
                setOpen((i) => (i === null ? 0 : (i + images.length - 1) % images.length));
              if (e.key === "ArrowRight")
                setOpen((i) => (i === null ? 0 : (i + 1) % images.length));
            }}
          >
            <Dialog.Title className="sr-only">Moments of restoration</Dialog.Title>
            <Dialog.Description className="sr-only">
              Browse the Great Couples photographs. Use the arrow keys or buttons to move between
              photographs.
            </Dialog.Description>
            <Dialog.Close className="gc-gallery-close" aria-label="Close">
              <X size={24} />
            </Dialog.Close>
            <button
              className="gc-gallery-prev"
              aria-label="Previous"
              onClick={() =>
                setOpen((i) => (i === null ? 0 : (i + images.length - 1) % images.length))
              }
            >
              <ArrowLeft size={25} />
            </button>
            {open !== null && (
              <Photo
                src={images[open] || PHOTOS[0]!}
                alt={
                  rows.find((v) => v.src === images[open])?.caption ||
                  `Great Couples photograph ${open + 1}`
                }
              />
            )}
            <button
              className="gc-gallery-next"
              aria-label="Next"
              onClick={() => setOpen((i) => (i === null ? 0 : (i + 1) % images.length))}
            >
              <ArrowRight size={25} />
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

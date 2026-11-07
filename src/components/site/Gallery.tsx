import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { PHOTOS } from "./assets";
import { useGalleryImages, useSignedImageUrl } from "@/lib/db";

function SignedImage({
  src,
  bucket,
  alt,
  className,
}: {
  src: string;
  bucket: string;
  alt: string;
  className?: string;
}) {
  const url = useSignedImageUrl(src, bucket);
  return <img src={url || src} alt={alt} loading="lazy" className={className} />;
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const { rows: custom } = useGalleryImages();
  const images = useMemo(
    () => [...new Set([...custom.map((item) => item.src), ...PHOTOS])],
    [custom],
  );

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () =>
      setOpen((value) => (value === null ? value : (value - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setOpen((value) => (value === null ? value : (value + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  return (
    <section id="gallery" className="bg-muted py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-kicker">In the field</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
              Moments of <span className="text-gradient-brand">restoration.</span>
            </h2>
            <p className="mt-4 text-[.98rem] leading-7 text-muted-foreground">
              Snapshots from prisons, rural outreach, seminars and moments of restoration.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-12 columns-2 gap-4 sm:columns-3 lg:columns-4 [column-fill:_balance]">
            {images.map((src, imageIndex) => (
              <button
                key={`${imageIndex}-${src}`}
                aria-label={`Open gallery photograph ${imageIndex + 1}`}
                onClick={() => setOpen(imageIndex)}
                className="mb-4 block w-full overflow-hidden rounded-2xl bg-white shadow-[0_12px_28px_-22px_rgba(42,18,70,.4)] ring-1 ring-primary/7 transition hover:-translate-y-1 hover:shadow-[0_18px_35px_-22px_rgba(42,18,70,.5)]"
              >
                <SignedImage
                  src={src}
                  bucket="gallery"
                  alt={`Great Couples outreach ${imageIndex + 1}`}
                  className={`w-full transition duration-500 hover:scale-[1.03] ${imageIndex === 0 ? "aspect-[3/4]" : imageIndex % 3 === 0 ? "aspect-[3/4]" : imageIndex % 2 ? "aspect-[4/5]" : "aspect-square"} object-cover ${imageIndex === 0 ? "bg-white object-contain" : "[object-position:center_20%]"}`}
                />
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
            onClick={close}
          >
            <button
              onClick={(event) => {
                event.stopPropagation();
                close();
              }}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] overflow-hidden rounded-2xl shadow-2xl"
            >
              <SignedImage
                src={images[open]}
                bucket="gallery"
                alt=""
                className="h-full w-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

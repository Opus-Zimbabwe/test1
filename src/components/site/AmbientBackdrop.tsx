import { useEffect, useRef } from "react";
export function AmbientBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty(
          "--gc-scroll-shift",
          `${Math.min(window.scrollY * 0.025, 350)}px`,
        );
        frame = 0;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={ref} className="gc-ambient-finish" aria-hidden="true" />;
}

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
const homeLinks = [
  ["#about", "Our story"],
  ["#services", "Counselling"],
  ["#gallery", "Gallery"],
  ["#podcast", "Podcast"],
  ["#videos", "Social videos"],
  ["#announcements", "Announcements"],
  ["#community", "Groups"],
  ["/store", "Bookshop"],
  ["#contact", "Contact"],
];
export function SiteNavigation({ store = false, action }: { store?: boolean; action?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(store ? "/store" : "");
  const [hovered, setHovered] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const links = store
    ? [
        ["/", "Home"],
        ["/store", "Bookshop"],
        ["/#podcast", "Podcast"],
        ["/#contact", "Contact"],
      ]
    : homeLinks;
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(scrollY > 24);
        const height = document.documentElement.scrollHeight - innerHeight;
        header.current?.style.setProperty(
          "--gc-reading",
          `${height > 0 ? (scrollY / height) * 100 : 0}%`,
        );
        if (!store) {
          let current = "";
          document.querySelectorAll<HTMLElement>("main section[id]").forEach((section) => {
            const r = section.getBoundingClientRect();
            if (r.top < innerHeight * 0.3 && r.bottom > innerHeight * 0.2)
              current = "#" + section.id;
          });
          setActive(current);
        }
        frame = 0;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, [store]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header ref={header} className={`gc-nav gc-orbit-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="gc-nav-main">
        <a className="gc-brand" href={store ? "/" : "#top"} aria-label="Great Couples home">
          <img src="/images/gc-logo-transparent.png" alt="Great Couples" />
        </a>
        <nav
          className={open ? "is-open" : ""}
          aria-label="Main navigation"
          onMouseLeave={() => setHovered(null)}
        >
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              aria-current={active === href ? (store ? "page" : "location") : undefined}
              onMouseEnter={() => setHovered(href!)}
              onFocus={() => setHovered(href!)}
              onBlur={() => setHovered(null)}
              onClick={() => setOpen(false)}
            >
              {(hovered || active) === href && (
                <motion.span
                  className="gc-nav-active"
                  layoutId="gc-navigation-highlight"
                  transition={
                    reduced ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 35 }
                  }
                />
              )}
              <span>{label}</span>
            </a>
          ))}
        </nav>
        {action && <div className="gc-nav-action">{action}</div>}
        <button
          className="gc-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className="gc-reading-progress" aria-hidden="true" />
    </header>
  );
}

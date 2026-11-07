import { useEffect, useState } from "react";
import { Menu, X, Phone, Store, Lock, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LOGO } from "./assets";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#values", label: "Values" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#podcast", label: "Podcast" },
  { href: "#videos", label: "Videos" },
  { href: "#community", label: "Community" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const surface = scrolled
    ? "border-primary/10 bg-white/95 shadow-[0_10px_30px_-18px_rgba(42,18,70,0.45)] backdrop-blur-xl"
    : "border-transparent bg-transparent";
  const navigationTone = scrolled
    ? "text-foreground/75 hover:text-primary"
    : "text-white/90 hover:text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${surface}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:py-4">
        <a href="#top" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <img
            src={LOGO}
            alt="Great Couples"
            className={`h-10 w-10 shrink-0 object-contain`}
          />
          <span
            className={`font-display text-base font-bold leading-none sm:text-lg ${scrolled ? "text-primary" : "text-white"}`}
          >
            Great Couples
          </span>
        </a>

        <ul
          className={`hidden items-center gap-5 text-[.77rem] font-semibold xl:flex ${navigationTone}`}
        >
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link to="/store" className="transition-colors">
              Store
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            to="/store"
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${scrolled ? "text-primary hover:bg-primary/8" : "text-white hover:bg-white/10"}`}
          >
            <Store className="h-3.5 w-3.5" /> Store <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href="tel:+263777308726"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4.5 py-2.5 text-xs font-bold text-accent-foreground shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:brightness-105"
          >
            <Phone className="h-3.5 w-3.5" /> Book Now
          </a>
          <Link
            to="/auth"
            aria-label="Admin sign in"
            title="Admin sign in"
            className={`grid h-9 w-9 place-items-center rounded-full border transition ${scrolled ? "border-primary/15 text-primary hover:bg-primary/8" : "border-white/30 text-white hover:bg-white/10"}`}
          >
            <Lock className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            to="/auth"
            aria-label="Admin sign in"
            title="Admin sign in"
            className={`grid h-9 w-9 place-items-center rounded-full border transition sm:hidden ${scrolled ? "border-primary/15 text-primary" : "border-white/30 text-white"}`}
          >
            <Lock className="h-3.5 w-3.5" />
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`grid h-10 w-10 place-items-center rounded-full border transition active:scale-95 ${scrolled ? "border-primary/15 bg-primary text-primary-foreground" : "border-white/35 bg-white/10 text-white"}`}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-primary/10 bg-white px-4 py-3 shadow-xl sm:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition hover:bg-primary/6 hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/store"
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition hover:bg-primary/6 hover:text-primary"
              >
                Store
              </Link>
            </li>
            <li>
              <a
                href="tel:+263777308726"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground"
              >
                <Phone className="h-4 w-4" /> Book Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

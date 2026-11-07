import { Facebook, Youtube, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { LOGO } from "./assets";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.35fr_.7fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={LOGO} alt="Great Couples" className="h-12 w-12 object-contain" />
              <div>
                <p className="text-xl font-bold leading-none text-white">Great Couples</p>
                <p className="mt-1 text-[.63rem] font-bold uppercase tracking-[.16em] text-white/55">
                  International Trust
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
              Building &amp; Promoting Marriage Foundations — restoring families across Africa and
              beyond through Christ-centered counselling, outreach and seminars.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                {
                  icon: Facebook,
                  url: "https://www.facebook.com/share/1DMYvcv24u/?mibextid=wwXIfr",
                  label: "Facebook",
                },
                { icon: Youtube, url: "https://youtube.com/@greatcouples", label: "YouTube" },
                {
                  icon: Instagram,
                  url: "https://instagram.com/great.couplestrust",
                  label: "Instagram",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/8 text-white/80 transition hover:bg-accent hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[.67rem] font-bold uppercase tracking-[.16em] text-white/45">
              Explore
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              {[
                ["About", "#about"],

                ["Services", "#services"],

                ["Podcast", "#podcast"],
                ["Facebook", "#facebook"],
                ["Contact", "#contact"],
                ["Store", "/store"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition hover:text-accent">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[.67rem] font-bold uppercase tracking-[.16em] text-white/45">
              Contact information
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-white/65">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                <a href="tel:+263777308726" className="transition hover:text-accent">
                  +263 777 308 726
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                <a
                  href="mailto:greatcouplestrust@gmail.com"
                  className="break-all transition hover:text-accent"
                >
                  greatcouplestrust@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                <span>15 Norwich Road, Eastlea, Harare</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45">
          <p>
            © {new Date().getFullYear()} Great Couples International Trust{" "}
            <a href="/admin" aria-label="Site admin" className="mx-1 transition hover:text-white">
              ·
            </a>{" "}
            All rights reserved.
          </p>
          <p>"Building and Promoting Marriage Foundations."</p>
        </div>
        <div className="mt-3 text-center text-xs text-white/45">
          Designed and Developed by{" "}
          <a
            href="https://www.opuszim.co.zw"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-white/65 transition hover:text-accent"
          >
            Opus Zimbabwe
          </a>
        </div>
      </div>
    </footer>
  );
}

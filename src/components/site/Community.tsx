import { ArrowUpRight } from "lucide-react";
import { BrandLogo, type BrandName } from "./BrandLogo";
import { Reveal } from "./Reveal";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.134 1.585 5.94L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Facebook",
    handle: "Great Couples",
    url: "https://www.facebook.com/share/1DMYvcv24u/?mibextid=wwXIfr",
  },
  {
    label: "YouTube",
    handle: "@greatcouples",
    url: "https://youtube.com/@greatcouples?si=DvHsuAbCXt7t9uLR",
  },
  {
    label: "TikTok",
    handle: "@greatcouplestrust",
    url: "https://www.tiktok.com/@greatcouplestrust",
  },
  {
    label: "Instagram",
    handle: "@great.couplestrust",
    url: "https://instagram.com/great.couplestrust",
  },
];

const WHATSAPP = [
  {
    flag: "zw",
    country: "Zimbabwe",
    region: "International & Zimbabwe",
    url: "https://chat.whatsapp.com/Lb8qKiv5ZSbJBUqrOJF7zX",
  },
  {
    flag: null,
    country: null,
    region: "Great Men (Men's Group)",
    url: "https://chat.whatsapp.com/DIX2abr71daIqLNzTqyXEG",
  },
  {
    flag: "ke",
    country: "Kenya",
    region: "Kenya",
    url: "https://chat.whatsapp.com/HPmCi3XHlbODdPqcrMJNy6",
  },
  {
    flag: "mw",
    country: "Malawi",
    region: "Malawi",
    url: "https://chat.whatsapp.com/ERSFxmmiCpi2GR6fmcXwGn",
  },
  {
    flag: "zm",
    country: "Zambia",
    region: "Zambia",
    url: "https://chat.whatsapp.com/FwIAtxJgHnYBj3QZsIwExi",
  },
];

export function Community() {
  return (
    <section id="community" className="bg-muted py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-kicker">Community hub</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Join the movement.</h2>
            <p className="mt-4 text-[.98rem] leading-7 text-muted-foreground">
              Follow us, tap in with your region on WhatsApp, and stay close to what God is doing
              through Great Couples.
            </p>
          </div>
        </Reveal>

        <div className="gc-social-profile-grid mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOCIALS.map((social, index) => (
            <Reveal key={social.label} delay={index * 0.04}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="hover-lift flex items-center gap-4 rounded-2xl bg-card p-5 shadow-[0_12px_28px_-22px_rgba(42,18,70,.42)]"
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ${index % 2 ? "bg-accent/10 text-accent" : "bg-primary/9 text-primary"}`}
                >
                  <BrandLogo brand={social.label.toLowerCase() as BrandName} size={28} />
                </span>
                <div className="min-w-0">
                  <p className="text-[.65rem] font-bold uppercase tracking-[.14em] text-muted-foreground">
                    {social.label}
                  </p>
                  <p className="truncate text-sm font-bold text-primary">{social.handle}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="gc-groups" aria-labelledby="gc-groups-heading">
            <div className="gc-groups-heading">
              <BrandLogo brand="whatsapp" className="gc-whatsapp-emblem" size={100} />
              <h3 id="gc-groups-heading">
                Find your people.
                <br />
                <span>Grow together.</span>
              </h3>
              <p>Join the Great Couples WhatsApp family, wherever you call home.</p>
            </div>
            <div className="gc-groups-grid">
              {WHATSAPP.map((group, index) => (
                <a
                  key={group.region}
                  href={group.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gc-country-group"
                  style={{ "--group-delay": `${index * 65}ms` } as React.CSSProperties}
                >
                  <span className="gc-country-emblem">
                    {group.flag ? (
                      <img
                        src={`/images/flags/${group.flag}.svg`}
                        alt={`${group.country} flag`}
                        width="48"
                        height="32"
                        loading="lazy"
                      />
                    ) : (
                      <WhatsAppIcon aria-hidden="true" className="h-6 w-6" />
                    )}
                  </span>
                  <span className="gc-country-name">{group.region}</span>
                  <span className="gc-country-join">
                    Join{" "}
                    <span aria-hidden="true">
                      <ArrowUpRight size={15} />
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

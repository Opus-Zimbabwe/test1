import { Users2, HeartHandshake, Laptop2, Phone, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { PHOTOS } from "./assets";
import faceToFace from "@/assets/gc/service-facetoface.jpg.asset.json";

const SERVICES = [
  {
    icon: Users2,
    title: "Marriage Counselling Sessions",
    body: "Private, judgement-free counselling for couples in every season — reconnect, rebuild, restore.",
    img: PHOTOS[3],
  },
  {
    icon: HeartHandshake,
    title: "Pre-Marital Counselling",
    body: "Lay a firm foundation before you say I do. Practical, biblical preparation for lifelong union.",
    img: PHOTOS[1],
  },
  {
    icon: Laptop2,
    title: "Face to Face & Online",
    body: "In-person at our Harare HQ or via secure video call — wherever you are, we meet you there.",
    img: faceToFace.url,
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-[4.5rem] sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker">What we do</p>
            <h2 className="mt-5 text-4xl font-bold sm:text-[2.75rem]">
              Support for every <span className="text-gradient-brand">season.</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              You deserve to enjoy your marriage — you owe it to yourself. Book a session with the
              Great Couples team today.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <article className="group h-full overflow-hidden rounded-2xl bg-card shadow-[0_15px_34px_-25px_rgba(42,18,70,.42)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-25px_rgba(42,18,70,.55)]">
                <div className="h-56 overflow-hidden bg-muted">
                  <img
                    src={service.img}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative px-5 pb-6">
                  <div className="-mt-7 flex min-h-14 items-center gap-3 rounded-xl bg-accent px-3.5 py-2.5 text-white shadow-lg shadow-accent/18">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/18">
                      <service.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-[.88rem] font-semibold leading-4 tracking-[-.025em] text-white">
                        {service.title}
                      </h3>
                      <p className="mt-0.5 text-[.57rem] font-medium uppercase tracking-[.11em] text-white/72">
                        Great Couples service
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[.74rem] leading-5 text-muted-foreground">
                    {service.body}
                  </p>
                  <a
                    href="tel:+263777308726"
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-accent transition hover:gap-2.5"
                  >
                    Book a session <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <a
              href="tel:+263777308726"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-xs font-bold text-accent-foreground shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <Phone className="h-4 w-4" /> Book Your Session — +263 777 308 726
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

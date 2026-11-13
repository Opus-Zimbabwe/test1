import { Play } from "lucide-react";
import { PrincipleMark } from "./PrincipleMark";
import { Reveal } from "./Reveal";
import { PHOTOS } from "./assets";

const SERVICES = [
  "Free marriage counselling",
  "Couple & family counselling",
  "Prison outreach programs",
  "Rural outreach programs",
  "Corporate outreach programs",
  "Marriage seminars & gatherings",
];

const HIGHLIGHTS = [
  {
    kind: "care" as const,
    title: "Care that listens",
    body: "Support rooted in compassion and dignity.",
  },
  {
    kind: "faith" as const,
    title: "Christian foundations",
    body: "Biblical values for healthy families.",
  },
  {
    kind: "community" as const,
    title: "Community impact",
    body: "Outreach that reaches beyond the room.",
  },
];

export function About() {
  return (
    <section id="about" className="bg-white py-[4.5rem] sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="grid items-start gap-7 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <p className="section-kicker">About us</p>
              <h2 className="mt-5 text-4xl font-bold sm:text-[2.75rem]">
                Building stronger <span className="text-gradient-brand">foundations</span> for every
                family.
              </h2>
            </div>
            <p className="text-sm leading-6 text-muted-foreground lg:col-span-3 lg:pt-10">
              The Great Couples is a non-governmental organization focused on building and promoting
              marriage foundations. The family is the product of this institution and we focus on
              guiding &amp; sharpening all parties involved which are men, women and children.
            </p>
            <p className="text-sm leading-6 text-muted-foreground lg:col-span-4 lg:pt-10">
              In Zimbabwe we have conducted successful outreach programs in prisons such as Harare
              Central &amp; Chikurubi Maximum, also in rural areas such as Mutoko and Hwedza with
              attendance spanning into the thousands. Our vision is to do this work beyond every
              nation in the continent and beyond.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((highlight, index) => (
            <Reveal key={highlight.title} delay={index * 0.05}>
              <article className="flex h-full items-center gap-4 rounded-2xl bg-card p-[1.125rem] shadow-[0_14px_30px_-23px_rgba(42,18,70,.34)] ring-1 ring-primary/5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_34px_-22px_rgba(42,18,70,.48)]">
                <span
                  className={`gc-principle-emblem grid h-11 w-11 shrink-0 place-items-center rounded-full ${index === 1 ? "bg-charcoal text-white" : "bg-accent text-white"}`}
                >
                  <PrincipleMark kind={highlight.kind} />
                </span>
                <div>
                  <h3 className="text-[.9rem] font-semibold tracking-[-.025em]">
                    {highlight.title}
                  </h3>
                  <p className="mt-0.5 text-[.68rem] leading-4 text-muted-foreground">
                    {highlight.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <div className="gc-about-portraits relative mt-10 min-h-[24rem] sm:mt-14 sm:min-h-[30rem]">
            <img
              src={PHOTOS[7]}
              alt="Great Couples community gathering"
              className="absolute inset-y-0 left-0 h-[calc(100%-1rem)] w-[74%] rounded-2xl object-cover shadow-[0_24px_52px_-30px_rgba(42,18,70,.5)] sm:h-full"
            />
            <a
              href="#videos"
              className="group absolute bottom-0 right-0 block h-[58%] w-[48%] overflow-hidden rounded-2xl border-[5px] border-white bg-charcoal shadow-[0_22px_44px_-25px_rgba(42,18,70,.58)]"
            >
              <img
                src={PHOTOS[2]}
                alt="Great Couples gathering"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-charcoal/32" />
              <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-white shadow-lg transition group-hover:scale-110">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
            </a>
          </div>
        </Reveal>

        <div className="gc-purpose-spread">
          <article className="gc-purpose-vision">
            <h3>Vision.</h3>
            <p>
              To build strong, healthy, and God-centered families by promoting and strengthening
              marriage foundations across Africa and beyond.
            </p>
          </article>
          <article className="gc-purpose-mission">
            <h3>Mission.</h3>
            <p>
              To empower men, women, children, couples, and communities through marriage
              counselling, family support programs, outreach initiatives, seminars, and practical
              Christian teachings that foster stable families and transformed societies.
            </p>
          </article>
        </div>
        <div className="gc-work-editorial">
          <div>
            <h3>What We Do.</h3>
            <p>
              Founded on Christian values, with a hands-on expert team and transparency at the heart
              of every programme.
            </p>
          </div>
          <ul>
            {SERVICES.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

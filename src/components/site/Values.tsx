import {
  Cross,
  Heart,
  HandHeart,
  Award,
  ShieldCheck,
  Globe2,
  Sparkles,
  Landmark,
} from "lucide-react";
import { Reveal } from "./Reveal";

const VALUES = [
  {
    icon: Cross,
    title: "Christian Faith",
    body: "We uphold biblical principles as the foundation for strong marriages, families, and communities.",
  },
  {
    icon: Heart,
    title: "Family Restoration",
    body: "We are committed to strengthening relationships and restoring families through guidance, counselling, and support.",
  },
  {
    icon: HandHeart,
    title: "Compassionate Service",
    body: "We serve individuals and communities with care, dignity, and genuine concern for their well-being.",
  },
  {
    icon: Award,
    title: "Excellence",
    body: "We strive for high standards in all our programs, counselling services, and outreach activities.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Transparency",
    body: "We operate with honesty, accountability, and openness in all our dealings.",
  },
  {
    icon: Globe2,
    title: "Community Transformation",
    body: "We believe in creating lasting social impact through prison, rural, corporate, and community outreach initiatives.",
  },
  {
    icon: Sparkles,
    title: "Empowerment",
    body: "We equip individuals and families with practical knowledge, counselling, and resources to navigate life's challenges successfully.",
  },
];

export function Values() {
  return (
    <section id="values" className="bg-muted py-[4.5rem] sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker">Seven pillars</p>
            <h2 className="mt-5 text-4xl font-bold sm:text-[2.75rem]">
              Values that guide <span className="text-gradient-brand">our work.</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              The principles that shape our work with couples, families and communities.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.04}>
              <article className="group relative h-full overflow-hidden rounded-2xl border-t-4 border-accent bg-card p-6 shadow-[0_14px_32px_-25px_rgba(42,18,70,.38)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_21px_42px_-25px_rgba(42,18,70,.5)]">
                <span className="absolute right-5 top-4 text-[.72rem] font-bold tracking-[.12em] text-primary/17">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`grid h-12 w-12 place-items-center rounded-full transition duration-200 group-hover:scale-105 ${index % 3 === 1 ? "bg-charcoal text-white" : "bg-accent/10 text-accent"}`}
                >
                  <value.icon className="h-5 w-5" />
                </span>
                <p className="mt-6 text-[.58rem] font-bold uppercase tracking-[.14em] text-muted-foreground">
                  Core pillar
                </p>
                <h3 className="mt-2 text-[1.05rem] font-semibold tracking-[-.03em]">
                  {value.title}
                </h3>
                <p className="mt-3 text-[.72rem] leading-5 text-muted-foreground">{value.body}</p>
              </article>
            </Reveal>
          ))}
          <Reveal delay={0.28}>
            <article className="relative flex min-h-[16.5rem] h-full flex-col justify-between overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-[0_16px_38px_-24px_rgba(42,18,70,.55)]">
              <span className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/70" />
              <Landmark className="relative h-8 w-8 text-white/90" />
              <div className="relative">
                <p className="text-[.6rem] font-bold uppercase tracking-[.16em] text-white/60">
                  Organizational Motto
                </p>
                <p className="mt-3 text-xl font-semibold leading-7 text-white">
                  "Building and Promoting Marriage Foundations."
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

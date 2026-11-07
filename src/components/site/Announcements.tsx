import { CalendarDays, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { type Announcement, useAnnouncements, useSignedImageUrl } from "@/lib/db";

function SignedImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const url = useSignedImageUrl(src, "announcements");
  return <img src={url || src} alt={alt} className={className} />;
}

const ARCHIVE: Announcement[] = [
  {
    id: "archive-seminar",
    title: "Marriage Seminar",
    body: "Practical teachings, testimonies and prayer for couples and singles preparing for marriage.",
    date_text: "Programme archive",
    location: "Harare, Zimbabwe",
    image_url: "/cdn/6ca73651-9776-4287-ac8d-752ff4dd99a1/seminar-flyer.jpg",
    sort_order: 0,
    created_at: "",
  },
  {
    id: "archive-methodist",
    title: "Methodist Church Meet",
    body: "Teaching, sharing and fellowship with couples from the Methodist Church community.",
    date_text: "Programme archive",
    location: "Methodist Church",
    image_url: "/cdn/fef9fd2e-ea5d-49d1-bdd7-4eb4c98e2e0c/announce-methodist.jpg",
    sort_order: 1,
    created_at: "",
  },
  {
    id: "archive-soccer",
    title: "Prison Soccer Outreach",
    body: "Bringing hope through sport, worship and marriage restoration ministry inside correctional facilities.",
    date_text: "Programme archive",
    location: "Correctional Facilities",
    image_url: "/cdn/09cebee3-d8b7-4cc6-84fa-ed93172357d2/announce-soccer.jpg",
    sort_order: 2,
    created_at: "",
  },
];
export function Announcements() {
  const { rows } = useAnnouncements();
  const items = rows.length ? rows : ARCHIVE;

  return (
    <section id="announcements" className="bg-muted py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="section-kicker">What's on</p>
            <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Announcements</h2>
            {!rows.length && (
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Explore our programme archive. Contact the team for the next event dates.
              </p>
            )}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <article
                className={`overflow-hidden rounded-2xl bg-card shadow-[0_16px_38px_-26px_rgba(42,18,70,.45)] ${item.image_url ? "md:grid md:grid-cols-[minmax(15rem,.7fr)_1.3fr]" : ""}`}
              >
                {item.image_url && (
                  <div className="min-h-56 bg-primary/5 md:min-h-full">
                    <SignedImage
                      src={item.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-7 sm:p-9">
                  <span className="inline-flex items-center gap-2 text-[.7rem] font-bold uppercase tracking-[.14em] text-accent">
                    <CalendarDays className="h-4 w-4" /> {item.date_text}
                  </span>
                  <h3 className="mt-4 text-2xl sm:text-3xl">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-[.96rem] leading-7 text-muted-foreground">
                    {item.body}
                  </p>
                  {item.location && (
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      <MapPin className="h-4 w-4 text-accent" /> {item.location}
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

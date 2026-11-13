import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import { type Announcement, useAnnouncements, useSignedImageUrl } from "@/lib/db";
function Flyer({ src, alt }: { src: string; alt: string }) {
  const url = useSignedImageUrl(src, "announcements");
  return <img src={url || src} alt={alt} loading="lazy" />;
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
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const active = items[selected] || items[0]!;
  return (
    <section id="announcements" className="gc-announcement-editorial">
      <div className="gc-announcement-heading">
        <h2>
          Good things.
          <br />
          <span>Coming together.</span>
        </h2>
        <a href="#contact">
          Talk to our team <ArrowUpRight size={21} />
        </a>
      </div>
      <div className="gc-announcement-feature">
        <div className="gc-announcement-flyer">
          {active.image_url ? (
            <button onClick={() => setExpanded(true)} aria-label={`Enlarge ${active.title} flyer`}>
              <Flyer src={active.image_url} alt={active.title} />
              <span>
                View full flyer <ArrowUpRight size={17} />
              </span>
            </button>
          ) : (
            <div className="gc-announcement-typography">
              Great
              <br />
              Couples.
            </div>
          )}
        </div>
        <div className="gc-announcement-story">
          <h3>{active.title}</h3>
          <p>{active.body}</p>
          <p className="gc-event-facts">
            {rows.length
              ? [active.date_text, active.location].filter(Boolean).join(" · ")
              : "From our programme archive. Contact us for the next dates."}
          </p>
          <div className="gc-announcement-index" aria-label="Announcements">
            {items.map((item, i) => (
              <article key={item.id}>
                <button aria-pressed={active.id === item.id} onClick={() => setSelected(i)}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h4>{item.title}</h4>
                  <ArrowUpRight size={21} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Dialog.Root open={expanded} onOpenChange={setExpanded}>
        <Dialog.Portal>
          <Dialog.Overlay className="gc-dialog-overlay" />
          <Dialog.Content className="gc-flyer-dialog">
            <Dialog.Title className="sr-only">{active.title}</Dialog.Title>
            <Dialog.Description className="sr-only">Full announcement flyer</Dialog.Description>
            <Dialog.Close aria-label="Close announcement flyer">
              <X size={24} />
            </Dialog.Close>
            {active.image_url && <Flyer src={active.image_url} alt={active.title} />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

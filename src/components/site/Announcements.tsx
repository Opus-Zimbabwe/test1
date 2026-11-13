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
  const [expanded, setExpanded] = useState<Announcement | null>(null);
  return (
    <section id="announcements" className="gc-announcement-editorial gc-announcements-separated">
      <div className="gc-announcement-heading">
        <h2>Announcements.</h2>
        <a href="#contact">
          Talk to our team <ArrowUpRight size={21} />
        </a>
      </div>
      {!rows.length && (
        <p className="gc-announcement-archive-note">
          From our programme archive. Contact us for the next dates.
        </p>
      )}
      <div className="gc-announcement-stories">
        {items.map((item) => (
          <article
            key={item.id}
            className={`gc-announcement-entry${item.image_url ? "" : " is-text-only"}`}
            aria-labelledby={`announcement-${item.id}`}
          >
            {item.image_url && (
              <button
                className="gc-announcement-original-image"
                onClick={() => setExpanded(item)}
                aria-label={`Enlarge ${item.title} flyer`}
              >
                <Flyer src={item.image_url} alt={item.title} />
                <span>
                  View full image <ArrowUpRight size={19} />
                </span>
              </button>
            )}
            <div className="gc-announcement-copy">
              <h3 id={`announcement-${item.id}`}>{item.title}</h3>
              <p>{item.body}</p>
              {(item.location || (rows.length && item.date_text)) && (
                <p className="gc-announcement-details">
                  {[rows.length ? item.date_text : null, item.location].filter(Boolean).join(" · ")}
                </p>
              )}
              <a href="#contact">
                Enquire about this programme <ArrowUpRight size={19} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <Dialog.Root
        open={!!expanded}
        onOpenChange={(open) => {
          if (!open) setExpanded(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="gc-dialog-overlay" />
          <Dialog.Content className="gc-flyer-dialog">
            <Dialog.Title className="sr-only">{expanded?.title}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Full announcement image, shown without cropping.
            </Dialog.Description>
            <Dialog.Close aria-label="Close announcement flyer">
              <X size={24} />
            </Dialog.Close>
            {expanded?.image_url && <Flyer src={expanded.image_url} alt={expanded.title} />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

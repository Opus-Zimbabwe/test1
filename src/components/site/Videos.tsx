import { Youtube } from "lucide-react";
import { Reveal } from "./Reveal";

const YT_VIDEOS = [
  { id: "q5FlDKsrzQk", title: "Great Couples — Featured" },
  { id: "UAd23JgzSfk", title: "Great Couples — Ministry Moment" },
  { id: "fiYK5rlIIrY", title: "Great Couples — Teaching" },
  { id: "im1SsciswOE", title: "Great Couples — Outreach" },
];

const TIKTOK_VIDEOS = ["7662832812252204308", "7664308578534034696", "7661685641851227413"];

export function Videos() {
  return (
    <section id="videos" className="bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex max-w-5xl flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-kicker">Watch</p>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Recent Videos</h2>
              <p className="mt-4 max-w-lg text-[.98rem] leading-7 text-muted-foreground">
                Ministry moments, teachings and outreach — from our YouTube channel and TikTok.
              </p>
            </div>
            <a
              href="https://youtube.com/@greatcouples"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF0033] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-700/15 transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <Youtube className="h-4 w-4" /> Subscribe on YouTube
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {YT_VIDEOS.map((video, index) => (
            <Reveal key={video.id} delay={index * 0.08}>
              <div className="overflow-hidden rounded-2xl bg-card shadow-[0_14px_34px_-25px_rgba(42,18,70,.42)] ring-1 ring-primary/7 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-25px_rgba(42,18,70,.52)]">
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 flex max-w-5xl flex-wrap items-end justify-between gap-6">
            <div>
              <p className="section-kicker">On TikTok</p>
              <h3 className="mt-4 text-3xl font-bold sm:text-4xl">@greatcouplestrust</h3>
            </div>
            <a
              href="https://www.tiktok.com/@greatcouplestrust"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-125"
            >
              Follow on TikTok
            </a>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TIKTOK_VIDEOS.map((id, index) => (
            <Reveal key={id} delay={index * 0.08}>
              <div className="overflow-hidden rounded-2xl bg-card shadow-[0_14px_34px_-25px_rgba(42,18,70,.42)] ring-1 ring-primary/7 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-25px_rgba(42,18,70,.52)]">
                <div className="relative bg-black" style={{ aspectRatio: "9 / 16" }}>
                  <iframe
                    src={`https://www.tiktok.com/embed/v2/${id}`}
                    title={`TikTok video ${id}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                    allow="encrypted-media;"
                    allowFullScreen
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

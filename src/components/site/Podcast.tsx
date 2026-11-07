import { useState } from "react";
import { Headphones, Podcast as PodcastIcon, Play, Search, X } from "lucide-react";
import { Reveal } from "./Reveal";

type Platform = "YouTube" | "TikTok";
type PodcastVideo = { id: string; platform: Platform; title: string };

// Static featured clips shared on Great Couples' channels. Add new episode IDs here as they are published.
const RECENT_VIDEOS: PodcastVideo[] = [
  { id: "q5FlDKsrzQk", platform: "YouTube", title: "Podcast conversation 1" },
  { id: "UAd23JgzSfk", platform: "YouTube", title: "Podcast conversation 2" },
  { id: "fiYK5rlIIrY", platform: "YouTube", title: "Podcast conversation 3" },
  { id: "7662832812252204308", platform: "TikTok", title: "Podcast conversation 1" },
  { id: "7664308578534034696", platform: "TikTok", title: "Podcast conversation 2" },
  { id: "7661685641851227413", platform: "TikTok", title: "Podcast conversation 3" },
];

// Older clips lead the slow-moving archive; the fourth known YouTube clip is placed first.
const ARCHIVE_VIDEOS: PodcastVideo[] = [
  { id: "im1SsciswOE", platform: "YouTube", title: "Earlier podcast conversation" },
  ...RECENT_VIDEOS,
];

function embedUrl(video: PodcastVideo) {
  return video.platform === "YouTube"
    ? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`
    : `https://www.tiktok.com/embed/v2/${video.id}`;
}

export function Podcast() {
  const [search, setSearch] = useState("");
  const [activeVideo, setActiveVideo] = useState<PodcastVideo | null>(null);
  const query = search.trim().toLowerCase();
  const results = RECENT_VIDEOS.filter((video) =>
    `${video.title} ${video.platform} ${video.id}`.toLowerCase().includes(query),
  );
  const archiveLoop = [...ARCHIVE_VIDEOS, ...ARCHIVE_VIDEOS];

  return (
    <section id="podcast" className="relative overflow-hidden bg-primary py-16 text-white sm:py-24 lg:py-28">
      <div aria-hidden className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[60px] border-white/[.04]" />
      <div aria-hidden className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative">
        <Reveal>
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[.16em] text-white/85">
              <PodcastIcon className="h-4 w-4 text-accent" /> The Great Couples Podcast
            </p>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="text-[#FFF8E7]">Real conversations.</span>{" "}
              <span className="text-accent">Stronger relationships.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Honest conversations about love, marriage and faith. Find practical guidance and thoughtful perspectives for every step of your relationship journey.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">Latest episodes</p>
                <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Recent podcast videos</h3>
                <p className="mt-2 text-sm text-white/70">Three recent clips from each channel. Scroll or swipe in either direction to browse.</p>
              </div>
              <label className="relative block w-full sm:max-w-xs">
                <span className="sr-only">Search podcast videos</span>
                <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search videos or platform"
                  className="w-full rounded-full border border-white/25 bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/60 focus:border-accent focus:ring-2 focus:ring-accent/50"
                />
              </label>
            </div>
            <p className="mb-3 text-xs text-white/60" aria-live="polite">{results.length} video{results.length === 1 ? "" : "s"} · swipe or scroll left and right</p>
            <div className="podcast-video-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-5 sm:gap-6" aria-label="Recent podcast videos; scroll horizontally">
              {results.map((video, index) => (
                <article key={video.id} className="w-[min(78vw,290px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/15 bg-white/[.08] shadow-xl sm:w-[300px]">
                  <button type="button" onClick={() => setActiveVideo(video)} className="group relative block aspect-[9/16] w-full bg-black text-left" aria-label={`Play ${video.platform} ${video.title}`}>
                    <iframe src={video.platform === "YouTube" ? `https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&rel=0` : `https://www.tiktok.com/embed/v2/${video.id}`} title={`${video.platform}: ${video.title}`} loading="lazy" tabIndex={-1} className="pointer-events-none absolute inset-0 h-full w-full" allow="encrypted-media; picture-in-picture" />
                    <span className="absolute inset-0 grid place-items-center bg-black/15 transition group-hover:bg-black/35"><span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg"><Play className="ml-1 h-6 w-6 fill-current" /></span></span>
                    <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white">{video.platform}</span>
                  </button>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <p className="text-sm font-semibold text-white">{video.title}</p>
                    <span className="text-xs text-white/55">#{index + 1}</span>
                  </div>
                </article>
              ))}
              {!results.length && <p className="w-full py-10 text-center text-sm text-white/70">No videos found. Try searching for YouTube, TikTok or a video ID.</p>}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 border-y border-white/10 py-8 sm:mt-16 sm:py-10">
            <div className="mx-auto mb-5 max-w-7xl px-4 sm:px-6">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">From the archive</p>
              <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">More podcast moments</h3>
              <p className="mt-2 text-sm text-white/70">Browse older conversations first. Pause the moving row by hovering or focusing a clip.</p>
            </div>
            <div className={`podcast-marquee overflow-x-auto ${activeVideo ? "is-playing" : ""}`} aria-label="Podcast archive marquee; scroll horizontally" tabIndex={0}>
              <div className="podcast-marquee-track flex w-max gap-5 px-4 sm:gap-6 sm:px-6">
                {archiveLoop.map((video, index) => (
                  <button key={`${video.id}-${index}`} type="button" onClick={() => setActiveVideo(video)} className="group relative w-[220px] shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black text-left sm:w-[250px]" aria-label={`Play ${video.platform} ${video.title}`}>
                    <div className="relative aspect-video">
                      {video.platform === "YouTube" ? <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" /> : <div className="grid h-full place-items-center bg-gradient-to-br from-[#17121c] to-[#362044]"><PodcastIcon className="h-10 w-10 text-white/60" /></div>}
                      <span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground"><Play className="ml-0.5 h-4 w-4 fill-current" /></span></span>
                    </div>
                    <span className="block px-3 py-2.5 text-xs font-semibold text-white">{video.platform} · {video.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center px-4 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><Headphones className="h-6 w-6" /></span>
            <p className="mt-4 text-sm font-semibold text-white/80">Listen · Learn · Grow</p>
          </div>
        </Reveal>
      </div>

      {activeVideo && (
        <div className="podcast-player-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label={`${activeVideo.platform} ${activeVideo.title}`} onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveVideo(null); }}>
          <button type="button" onClick={() => setActiveVideo(null)} className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-lg" aria-label="Close video player"><X className="h-4 w-4" /> Close</button>
          <div className="h-[min(88vh,900px)] w-[min(96vw,500px)] overflow-hidden rounded-2xl bg-black shadow-2xl">
            <iframe src={embedUrl(activeVideo)} title={`${activeVideo.platform}: ${activeVideo.title}`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        </div>
      )}
    </section>
  );
}

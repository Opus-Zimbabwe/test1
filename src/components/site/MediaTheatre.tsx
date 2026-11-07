import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Expand, Play, X } from "lucide-react";
const episodes = [
  { id: "q5FlDKsrzQk", kind: "youtube" },
  { id: "UAd23JgzSfk", kind: "youtube" },
  { id: "fiYK5rlIIrY", kind: "youtube" },
  { id: "7662832812252204308", kind: "tiktok" },
  { id: "7664308578534034696", kind: "tiktok" },
  { id: "7661685641851227413", kind: "tiktok" },
] as const;
const archive = [{ id: "im1SsciswOE", kind: "youtube" }, ...episodes];
type Episode = { id: string; kind: string };
export function MediaTheatre() {
  const [active, setActive] = useState<Episode | null>(null);
  const [index, setIndex] = useState(0);
  const player = useRef<HTMLDivElement>(null);
  const [fullscreenError, setFullscreenError] = useState("");
  const selected = episodes[index];
  function step(amount: number) {
    setIndex((i) => (i + amount + episodes.length) % episodes.length);
  }
  async function fullscreen() {
    try {
      await player.current?.requestFullscreen();
    } catch {
      setFullscreenError(
        "Fullscreen is unavailable in this browser. You can continue watching here.",
      );
    }
  }
  return (
    <section id="podcast" className="gc-theatre">
      <div className="gc-theatre-heading">
        <p className="gc-eyebrow">Press play. Grow closer.</p>
        <h2>
          The Great Couples
          <br />
          <em>Podcast.</em>
        </h2>
        <p>Honest conversations about love, faith and the life you build together.</p>
      </div>
      <div className="gc-theatre-stage">
        <div className="gc-stage-copy">
          <span className="gc-eyebrow">The conversation continues</span>
          <h3>
            A little perspective.
            <br />A deeper connection.
          </h3>
          <p>Make room for a meaningful conversation.</p>
          <div className="gc-episode-controls">
            <button aria-label="Previous podcast" onClick={() => step(-1)}>
              <ArrowLeft />
            </button>
            <span aria-live="polite">{String(index + 1).padStart(2, "0")} / 06</span>
            <button aria-label="Next podcast" onClick={() => step(1)}>
              <ArrowRight />
            </button>
          </div>
        </div>
        <button
          className="gc-stage-video"
          onClick={() => setActive(selected)}
          aria-label={`Play podcast ${index + 1}`}
          onTouchStart={(e) => {
            e.currentTarget.dataset.touch = String(e.touches[0].clientX);
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - Number(e.currentTarget.dataset.touch);
            if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
          }}
        >
          {selected.kind === "youtube" ? (
            <img
              src={`https://i.ytimg.com/vi/${selected.id}/hqdefault.jpg`}
              alt="Podcast preview"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/cdn/4edf1fff-1d53-405c-b8f3-66f688fbc4ad/gc-8.jpg";
              }}
              loading="lazy"
            />
          ) : (
            <div className="gc-short-preview">
              <span>
                GREAT
                <br />
                COUPLES
              </span>
              <small>Short conversations. Lasting meaning.</small>
            </div>
          )}
          <span className="gc-play">
            <Play fill="currentColor" />
          </span>
          <span className="gc-stage-caption">
            Watch conversation {String(index + 1).padStart(2, "0")} <Expand size={18} />
          </span>
        </button>
      </div>
      <div className="gc-episode-tabs" aria-label="Choose podcast">
        {episodes.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setIndex(i)}
            aria-label={`Select podcast ${i + 1}`}
            aria-pressed={i === index}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <div className={`gc-filmstrip ${active ? "is-playing" : ""}`}>
        <p className="gc-eyebrow">From the archive / More moments together</p>
        <div
          className="gc-filmstrip-window"
          tabIndex={0}
          aria-label="Podcast archive; focus or hover to pause"
        >
          <div className="gc-filmstrip-track">
            {[...archive, ...archive].map((v, i) => (
              <button
                key={`${v.id}-${i}`}
                onClick={() => setActive(v)}
                aria-label={`Play archived conversation ${(i % archive.length) + 1}`}
                tabIndex={i >= archive.length ? -1 : 0}
                aria-hidden={i >= archive.length || undefined}
              >
                {v.kind === "youtube" ? (
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "/cdn/b5678dc9-e94a-4d2d-b51e-96ace5f5536b/gc-3.jpg";
                    }}
                  />
                ) : (
                  <span className="gc-archive-type">
                    LOVE.
                    <br />
                    FAITH.
                    <br />
                    TOGETHER.
                  </span>
                )}
                <Play size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <Dialog.Root
        open={!!active}
        onOpenChange={(open) => {
          if (!open) {
            setActive(null);
            setFullscreenError("");
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="gc-dialog-overlay" />
          <Dialog.Content className="gc-dialog">
            <Dialog.Title className="gc-eyebrow">The Great Couples Podcast</Dialog.Title>
            <Dialog.Description className="sr-only">
              Watch your selected podcast. Use Escape or the close button to return to the page.
            </Dialog.Description>
            <div className="gc-dialog-toolbar">
              <button onClick={fullscreen}>
                <Expand size={18} /> Fullscreen
              </button>
              <Dialog.Close aria-label="Close podcast player">
                <X size={22} />
              </Dialog.Close>
            </div>
            <div
              ref={player}
              className={`gc-player ${active?.kind === "tiktok" ? "gc-player-portrait" : ""}`}
            >
              {active && (
                <iframe
                  title="Selected Great Couples podcast"
                  src={
                    active.kind === "youtube"
                      ? `https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&playsinline=1&rel=0`
                      : `https://www.tiktok.com/player/v1/${active.id}?autoplay=1`
                  }
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {fullscreenError && <p role="status">{fullscreenError}</p>}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

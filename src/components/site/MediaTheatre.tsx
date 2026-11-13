import { useEffect, useRef, useState } from "react";
import { Play, Square, Expand, ArrowLeft, ArrowRight } from "lucide-react";
import { PODCAST_CLIPS, clipEmbed, clipLink, type MediaClip } from "./media";
import { MediaArtwork } from "./MediaArtwork";
export function MediaTheatre() {
  const [selected, setSelected] = useState<MediaClip>(PODCAST_CLIPS[0]!);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const player = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const index = PODCAST_CLIPS.findIndex((v) => v.id === selected.id);
  function choose(clip: MediaClip) {
    setSelected(clip);
    setPlaying(true);
    setMessage("");
  }
  function step(d: number) {
    setSelected(
      PODCAST_CLIPS[((index < 0 ? 0 : index) + d + PODCAST_CLIPS.length) % PODCAST_CLIPS.length]!,
    );
    setPlaying(false);
  }
  useEffect(() => {
    if (!playing) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [playing]);
  return (
    <section id="podcast" className="gc-podcast-studio">
      <svg
        className="gc-curve-edge"
        viewBox="0 0 1440 65"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 0H1440V8C1050 72 420 72 0 8Z" />
      </svg>
      <div className="gc-studio-wrap">
        <h2>
          The Great Couples
          <br />
          <span>Podcast.</span>
        </h2>
        <div className="gc-studio-layout">
          <div>
            <div
              ref={player}
              className={`gc-studio-player ${selected.platform === "tiktok" ? "is-portrait" : ""}`}
            >
              {playing ? (
                <iframe
                  title="Selected Great Couples podcast"
                  src={clipEmbed(selected)}
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  className="gc-studio-poster"
                  onClick={() => setPlaying(true)}
                  aria-label={`Play ${selected.title.toLowerCase()}`}
                >
                  <MediaArtwork clip={selected} />
                  <span className="gc-large-play">
                    <Play fill="currentColor" size={26} />
                  </span>
                  <span className="gc-poster-title">{selected.title}</span>
                </button>
              )}
            </div>
            <div className="gc-studio-transport">
              <div>
                <button aria-label="Previous podcast" onClick={() => step(-1)}>
                  <ArrowLeft size={20} />
                </button>
                <button
                  aria-label={playing ? "Stop podcast playback" : "Play selected podcast"}
                  onClick={() => setPlaying(!playing)}
                >
                  {playing ? <Square size={20} /> : <Play size={20} />}
                </button>
                <button aria-label="Next podcast" onClick={() => step(1)}>
                  <ArrowRight size={20} />
                </button>
              </div>
              <button
                onClick={async () => {
                  try {
                    await player.current?.requestFullscreen();
                  } catch {
                    setMessage(
                      "Fullscreen is unavailable in this browser. You can continue watching here.",
                    );
                  }
                }}
              >
                <Expand size={18} /> Fullscreen
              </button>
            </div>
            {playing && (
              <a
                className="gc-player-fallback"
                href={clipLink(selected)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open original video if playback is unavailable ↗
              </a>
            )}
            {message && <p role="status">{message}</p>}
          </div>
          <div className="gc-studio-playlist" ref={list} aria-label="Podcast conversations">
            {PODCAST_CLIPS.map((clip, i) => (
              <button
                key={clip.id}
                className={selected.id === clip.id ? "is-selected" : ""}
                aria-pressed={selected.id === clip.id}
                onClick={() => choose(clip)}
              >
                <span className="gc-playlist-number">{String(i + 1).padStart(2, "0")}</span>

                <span>{clip.title}</span>
                <Play size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

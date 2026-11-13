import { useEffect, useRef, useState } from "react";
import { Play, Square, Expand, ArrowLeft, ArrowRight } from "lucide-react";
import { PODCAST_CLIPS, clipEmbed, clipLink, type MediaClip } from "./media";
import { MediaArtwork } from "./MediaArtwork";
import { BrandLogo } from "./BrandLogo";
import { useInView, useReducedMotion } from "framer-motion";
export function MediaTheatre() {
  const [activePlatform, setActivePlatform] = useState<MediaClip["platform"] | null>(null);
  useEffect(() => {
    const stop = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePlatform(null);
    };
    window.addEventListener("keydown", stop);
    return () => window.removeEventListener("keydown", stop);
  }, []);
  return (
    <section id="podcast" className="gc-podcast-studio gc-podcast-separated">
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
        {(["youtube", "tiktok"] as const).map((platform) => (
          <PodcastChannel
            key={platform}
            platform={platform}
            clips={PODCAST_CLIPS.filter((clip) => clip.platform === platform)}
            playing={activePlatform === platform}
            rotationPaused={activePlatform !== null}
            onPlay={() => setActivePlatform(platform)}
            onStop={() => setActivePlatform(null)}
          />
        ))}
      </div>
    </section>
  );
}
function PodcastChannel({
  platform,
  clips,
  playing,
  rotationPaused,
  onPlay,
  onStop,
}: {
  platform: MediaClip["platform"];
  clips: MediaClip[];
  playing: boolean;
  rotationPaused: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const [index, setIndex] = useState(0);
  const selected = clips[index] || clips[0]!;
  const [message, setMessage] = useState("");
  const player = useRef<HTMLDivElement>(null);
  const name = platform === "youtube" ? "YouTube" : "TikTok";
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const engaged = hovered || focused;
  const channel = useRef<HTMLElement>(null);
  const visible = useInView(channel, { amount: 0.15 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (platform !== "tiktok" || rotationPaused || engaged || reduced || !visible) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % clips.length), 8500);
    return () => window.clearInterval(timer);
  }, [platform, rotationPaused, engaged, reduced, clips.length, visible]);

  const step = (direction: number) => {
    setIndex((i) => (i + direction + clips.length) % clips.length);
    onStop();
    setMessage("");
  };
  return (
    <section
      ref={channel}
      id={`podcast-${platform}`}
      className={`gc-podcast-channel ${platform}`}
      aria-labelledby={`podcast-${platform}-title`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="gc-podcast-channel-heading">
        <BrandLogo brand={platform} size={42} />
        <h3 id={`podcast-${platform}-title`}>{name}</h3>
      </div>
      <div className="gc-studio-layout">
        <div>
          <div
            ref={player}
            className={`gc-studio-player ${platform === "tiktok" ? "is-portrait" : ""}`}
          >
            {playing ? (
              <iframe
                title={`${name} Great Couples podcast`}
                src={clipEmbed(selected)}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                className="gc-studio-poster"
                onClick={onPlay}
                aria-label={`Play ${name} conversation ${index + 1}`}
              >
                <MediaArtwork clip={selected} />
                <span className="gc-large-play">
                  <Play fill="currentColor" size={26} />
                </span>
                <span className="gc-poster-title">
                  Conversation {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            )}
          </div>
          <div className="gc-studio-transport">
            <div>
              <button aria-label={`Previous ${name} podcast`} onClick={() => step(-1)}>
                <ArrowLeft size={20} />
              </button>
              <button
                aria-label={
                  playing ? `Stop ${name} podcast playback` : `Play selected ${name} podcast`
                }
                onClick={playing ? onStop : onPlay}
              >
                {playing ? <Square size={20} /> : <Play size={20} />}
              </button>
              <button aria-label={`Next ${name} podcast`} onClick={() => step(1)}>
                <ArrowRight size={20} />
              </button>
            </div>
            <button
              aria-label={`Fullscreen ${name} podcast`}
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
        <div className="gc-studio-playlist" aria-label={`${name} podcast conversations`}>
          {clips.map((clip, i) => (
            <button
              key={clip.id}
              aria-pressed={index === i}
              className={index === i ? "is-selected" : ""}
              aria-label={`Select ${name} podcast ${i + 1}`}
              onClick={() => {
                setIndex(i);
                setMessage("");
                onPlay();
              }}
            >
              <span className="gc-playlist-number">{String(i + 1).padStart(2, "0")}</span>
              <span>Conversation {String(i + 1).padStart(2, "0")}</span>
              <Play size={16} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

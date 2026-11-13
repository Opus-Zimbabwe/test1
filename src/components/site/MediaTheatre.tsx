import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { PODCAST_CLIPS, type MediaClip } from "./media";
import { BrandLogo } from "./BrandLogo";
import { MediaArtwork } from "./MediaArtwork";
import { VideoDialog } from "./VideoDialog";
export function MediaTheatre() {
  const [active, setActive] = useState<MediaClip | null>(null);
  return (
    <section id="podcast" className="gc-podcast-studio gc-podcast-separated gc-podcast-rotations">
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
          <PodcastRotation
            key={platform}
            platform={platform}
            clips={PODCAST_CLIPS.filter((clip) => clip.platform === platform)}
            paused={!!active}
            onPlay={setActive}
          />
        ))}
      </div>
      <VideoDialog clip={active} onClose={() => setActive(null)} />
    </section>
  );
}
function PodcastRotation({
  platform,
  clips,
  paused,
  onPlay,
}: {
  platform: MediaClip["platform"];
  clips: MediaClip[];
  paused: boolean;
  onPlay: (clip: MediaClip) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const visible = useInView(container, { amount: 0.15 });
  const reduced = useReducedMotion();
  const name = platform === "youtube" ? "YouTube" : "TikTok";
  useEffect(() => {
    const el = container.current;
    if (!el || paused || hovered || focused || reduced || !visible) return;
    let frame = 0;
    let last = performance.now();
    let position = el.scrollLeft;
    let direction = 1;
    const move = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const maximum = el.scrollWidth - el.clientWidth;
      if (maximum > 0) {
        position += direction * 18 * dt;
        if (position >= maximum) {
          position = maximum;
          direction = -1;
        }
        if (position <= 0) {
          position = 0;
          direction = 1;
        }
        el.scrollLeft = position;
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [paused, hovered, focused, reduced, visible]);
  return (
    <section
      id={`podcast-${platform}`}
      className={`gc-podcast-channel gc-rotation-channel ${platform}`}
      aria-labelledby={`podcast-${platform}-title`}
    >
      <div className="gc-rotation-heading">
        <div>
          <BrandLogo brand={platform} size={42} />
          <h3 id={`podcast-${platform}-title`}>{name}</h3>
        </div>
        <div className="gc-rotation-actions">
          <a
            className="gc-channel-follow"
            href={
              platform === "youtube"
                ? "https://youtube.com/@greatcouples"
                : "https://www.tiktok.com/@greatcouplestrust"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {platform === "youtube" ? "Subscribe" : "Follow"} ↗
          </a>
          <button
            aria-label={`Previous ${name} podcast videos`}
            onClick={() =>
              container.current?.scrollBy({ left: -450, behavior: reduced ? "auto" : "smooth" })
            }
          >
            <ArrowLeft size={21} />
          </button>
          <button
            aria-label={`Next ${name} podcast videos`}
            onClick={() =>
              container.current?.scrollBy({ left: 450, behavior: reduced ? "auto" : "smooth" })
            }
          >
            <ArrowRight size={21} />
          </button>
        </div>
      </div>
      <div
        ref={container}
        className={`gc-podcast-rail ${platform}`}
        aria-label={`${name} podcast rotation`}
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        {clips.map((clip, i) => (
          <button
            key={clip.id}
            className="gc-podcast-clip"
            onClick={() => onPlay(clip)}
            aria-label={`Play ${name} podcast ${i + 1}`}
          >
            <MediaArtwork clip={clip} />
            <span className="gc-rotation-play">
              <Play size={24} fill="currentColor" />
            </span>
            <span className="gc-rotation-title">Conversation {String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { MediaArtwork } from "./MediaArtwork";
import { VideoDialog } from "./VideoDialog";
import { PODCAST_CLIPS, type MediaClip } from "./media";
const clips: MediaClip[] = [
  ...PODCAST_CLIPS.filter((clip) => clip.platform === "youtube"),
  { id: "im1SsciswOE", platform: "youtube", title: "Great Couples — Outreach" },
  ...["7662832812252204308", "7664308578534034696", "7661685641851227413"].map((id, i) => ({
    id,
    platform: "tiktok" as const,
    title: `Great Couples social video ${i + 1}`,
  })),
];
export function Videos() {
  const [active, setActive] = useState<MediaClip | null>(null);
  return (
    <section id="videos" className="gc-social-cinema gc-social-separated">
      <div className="gc-cinema-heading">
        <h2>
          Life beyond
          <br />
          <span>the conversation.</span>
        </h2>
      </div>
      {(["youtube", "tiktok"] as const).map((platform) => (
        <SocialChannel key={platform} platform={platform} onPlay={setActive} />
      ))}
      <VideoDialog clip={active} onClose={() => setActive(null)} />
    </section>
  );
}
function SocialChannel({
  platform,
  onPlay,
}: {
  platform: MediaClip["platform"];
  onPlay: (clip: MediaClip) => void;
}) {
  const shelf = useRef<HTMLDivElement>(null);
  const name = platform === "youtube" ? "YouTube" : "TikTok";
  return (
    <section
      id={`videos-${platform}`}
      className={`gc-social-channel ${platform}`}
      aria-labelledby={`social-${platform}-title`}
    >
      <div className="gc-social-channel-heading">
        <div>
          <BrandLogo brand={platform} size={36} />
          <h3 id={`social-${platform}-title`}>{name}</h3>
        </div>
        <a
          href={
            platform === "youtube"
              ? "https://youtube.com/@greatcouples"
              : "https://www.tiktok.com/@greatcouplestrust"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {platform === "youtube" ? "Subscribe on YouTube" : "Follow on TikTok"} ↗
        </a>
      </div>
      <div
        className={`gc-social-reel ${platform}`}
        ref={shelf}
        tabIndex={0}
        aria-label={`${name} videos; scroll horizontally`}
      >
        {clips
          .filter((clip) => clip.platform === platform)
          .map((clip, i) => (
            <button
              key={clip.id}
              onClick={() => onPlay(clip)}
              className="gc-social-video"
              aria-label={`Play ${platform} video ${i + 1}`}
            >
              <MediaArtwork clip={clip} />
              <span className="gc-reel-play">
                <Play fill="currentColor" size={23} />
              </span>
              <span className="gc-reel-number">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
      </div>
      <div className="gc-reel-controls">
        <div>
          <button
            aria-label={`Previous ${name} social videos`}
            onClick={() => shelf.current?.scrollBy({ left: -500, behavior: "smooth" })}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label={`Next ${name} social videos`}
            onClick={() => shelf.current?.scrollBy({ left: 500, behavior: "smooth" })}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

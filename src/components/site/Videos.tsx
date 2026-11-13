import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { MediaArtwork } from "./MediaArtwork";
import { VideoDialog } from "./VideoDialog";
import { PODCAST_CLIPS, type MediaClip } from "./media";
const clips: MediaClip[] = [
  ...PODCAST_CLIPS.filter((v) => v.platform === "youtube"),
  { id: "im1SsciswOE", platform: "youtube", title: "Great Couples — Outreach" },
  ...["7662832812252204308", "7664308578534034696", "7661685641851227413"].map((id, i) => ({
    id,
    platform: "tiktok" as const,
    title: `Great Couples social video ${i + 1}`,
  })),
];
export function Videos() {
  const [platform, setPlatform] = useState<"youtube" | "tiktok">("youtube");
  const [active, setActive] = useState<MediaClip | null>(null);
  const shelf = useRef<HTMLDivElement>(null);
  return (
    <section id="videos" className="gc-social-cinema">
      <div className="gc-cinema-heading">
        <h2>
          Life beyond
          <br />
          <span>the conversation.</span>
        </h2>
        <div className="gc-platform-switch" role="group" aria-label="Choose video channel">
          <button
            aria-pressed={platform === "youtube"}
            onClick={() => {
              setPlatform("youtube");
              shelf.current?.scrollTo({ left: 0 });
            }}
          >
            <BrandLogo brand="youtube" size={32} />
            YouTube
          </button>
          <button
            aria-pressed={platform === "tiktok"}
            onClick={() => {
              setPlatform("tiktok");
              shelf.current?.scrollTo({ left: 0 });
            }}
          >
            <BrandLogo brand="tiktok" size={27} />
            TikTok
          </button>
        </div>
      </div>
      <div
        className={`gc-social-reel ${platform}`}
        ref={shelf}
        tabIndex={0}
        aria-label={`${platform} videos; scroll horizontally`}
      >
        {clips
          .filter((v) => v.platform === platform)
          .map((clip, i) => (
            <button
              key={clip.id}
              onClick={() => setActive(clip)}
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
        <div>
          <button
            aria-label="Previous social videos"
            onClick={() => shelf.current?.scrollBy({ left: -500, behavior: "smooth" })}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label="Next social videos"
            onClick={() => shelf.current?.scrollBy({ left: 500, behavior: "smooth" })}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <VideoDialog clip={active} onClose={() => setActive(null)} />
    </section>
  );
}

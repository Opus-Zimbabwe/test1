import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getTikTokPreview } from "@/lib/tiktok-preview.functions";
import type { MediaClip } from "./media";
import { clipEmbed } from "./media";
import { BrandLogo } from "./BrandLogo";
export function MediaArtwork({
  clip,
  previewPaused = false,
}: {
  clip: MediaClip;
  previewPaused?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const near = useInView(container, { margin: "600px", once: true });
  const visible = useInView(container, { margin: "100px 0px", amount: 0.15 });
  const getPreview = useServerFn(getTikTokPreview);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["tiktok-preview", clip.id],
    queryFn: () => getPreview({ data: { id: clip.id } }),
    enabled: clip.platform === "tiktok" && near,
    staleTime: 1800000,
    retry: false,
  });
  const source =
    clip.platform === "youtube"
      ? `https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`
      : clip.platform === "tiktok"
        ? data?.thumbnail
        : null;
  return (
    <div
      ref={container}
      className={`gc-media-artwork provider-${clip.platform}`}
      data-preview-id={clip.id}
    >
      {source && source !== failedSource && (
        <img
          key={source}
          className="gc-episode-image"
          src={source}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailedSource(source)}
        />
      )}
      {(clip.platform === "facebook" ||
        (clip.platform === "tiktok" &&
          visible &&
          !previewPaused &&
          (!source || source === failedSource))) && (
        <iframe
          key={clip.id}
          className="gc-provider-preview"
          title={`${clip.platform} preview ${clip.id}`}
          src={
            clip.platform === "facebook"
              ? clipEmbed(clip)
              : `https://www.tiktok.com/player/v1/${clip.id}?autoplay=0&muted=1&controls=0&description=0&music_info=0`
          }
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          allow="encrypted-media"
        />
      )}
      <div className="gc-media-fallback">
        <BrandLogo brand={clip.platform} size={50} />
      </div>
    </div>
  );
}

import type { MediaClip } from "./media";
import { clipEmbed } from "./media";
import { BrandLogo } from "./BrandLogo";
export function MediaArtwork({ clip }: { clip: MediaClip }) {
  return (
    <div className={`gc-media-artwork provider-${clip.platform}`} data-preview-id={clip.id}>
      {clip.platform === "youtube" ? (
        <img
          key={clip.id}
          className="gc-episode-image"
          src={`https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
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

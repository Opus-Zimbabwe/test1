import type { MediaClip } from "./media";
import { BrandLogo } from "./BrandLogo";
import { PHOTOS } from "./assets";
export function MediaArtwork({ clip }: { clip: MediaClip }) {
  const artwork =
    PHOTOS[
      Array.from(clip.id).reduce((sum, character) => sum + character.charCodeAt(0), 0) %
        PHOTOS.length
    ]!;
  return (
    <div className="gc-media-artwork">
      {clip.platform === "youtube" ? (
        <img
          key={clip.id}
          className="gc-episode-image"
          src={`https://i.ytimg.com/vi/${clip.id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <div className="gc-media-fallback">
        <img className="gc-context-art" src={artwork} alt="" loading="lazy" />
        <BrandLogo brand={clip.platform} size={38} />
      </div>
    </div>
  );
}

export type MediaClip = { id: string; platform: "youtube" | "tiktok"; title: string };
export const PODCAST_CLIPS: MediaClip[] = [
  { id: "q5FlDKsrzQk", platform: "youtube", title: "Conversation 01" },
  { id: "UAd23JgzSfk", platform: "youtube", title: "Conversation 02" },
  { id: "fiYK5rlIIrY", platform: "youtube", title: "Conversation 03" },
  { id: "7707735777718930706", platform: "tiktok", title: "Conversation 04" },
  { id: "7707357261047532821", platform: "tiktok", title: "Conversation 05" },
  { id: "7705848215546891540", platform: "tiktok", title: "Conversation 06" },
  { id: "7704939703518121237", platform: "tiktok", title: "Conversation 07" },
  { id: "7705073907186863380", platform: "tiktok", title: "Conversation 08" },
];
export const MEDIA_ARCHIVE: MediaClip[] = [
  { id: "im1SsciswOE", platform: "youtube", title: "Earlier conversation" },
  ...PODCAST_CLIPS,
];
export function clipEmbed(clip: MediaClip) {
  return clip.platform === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${clip.id}?autoplay=1&playsinline=1&rel=0`
    : `https://www.tiktok.com/player/v1/${clip.id}?autoplay=1`;
}
export function clipLink(clip: MediaClip) {
  return clip.platform === "youtube"
    ? `https://www.youtube.com/watch?v=${clip.id}`
    : `https://www.tiktok.com/@greatcouplestrust/video/${clip.id}`;
}

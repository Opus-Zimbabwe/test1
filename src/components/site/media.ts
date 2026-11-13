export type MediaClip = {
  id: string;
  platform: "youtube" | "tiktok" | "facebook";
  title: string;
  url?: string;
};
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
export const SOCIAL_CLIPS: MediaClip[] = [
  ...PODCAST_CLIPS,
  { id: "im1SsciswOE", platform: "youtube", title: "Great Couples — Outreach" },
  ...["7662832812252204308", "7664308578534034696", "7661685641851227413"].map((id, i) => ({
    id,
    platform: "tiktok" as const,
    title: `Great Couples social video ${i + 1}`,
  })),
  {
    id: "29635817456011458",
    platform: "facebook",
    title: "Great Couples Facebook Reel",
    url: "https://www.facebook.com/reel/29635817456011458/",
  },
];
export function clipEmbed(clip: MediaClip) {
  if (clip.platform === "facebook")
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clipLink(clip))}&show_text=false`;

  return clip.platform === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${clip.id}?autoplay=1&playsinline=1&rel=0`
    : `https://www.tiktok.com/player/v1/${clip.id}?autoplay=1`;
}
export function clipLink(clip: MediaClip) {
  if (clip.url) return clip.url;
  if (clip.platform === "facebook") return `https://www.facebook.com/reel/${clip.id}/`;

  return clip.platform === "youtube"
    ? `https://www.youtube.com/watch?v=${clip.id}`
    : `https://www.tiktok.com/@greatcouplestrust/video/${clip.id}`;
}

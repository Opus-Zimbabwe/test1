export type VideoPlatform = "youtube" | "tiktok" | "facebook";
export type VideoPlacement = "podcast" | "social";
export type VideoRecord = {
  id: string;
  platform: VideoPlatform;
  video_id: string;
  url: string;
  title: string;
  placement: VideoPlacement;
  sort_order: number;
  active: boolean;
  created_at: string;
  origin_key?: string | null;
};
export function parseVideoLink(input: string): {
  platform: VideoPlatform;
  id: string;
  url: string;
} {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("Paste a full YouTube, TikTok or Facebook video link.");
  }
  if (url.protocol !== "https:" || url.port || url.username || url.password)
    throw new Error("Use a secure video link without login details.");
  const host = url.hostname
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/^m\./, "");
  let id: string | null = null;
  if (host === "youtube.com" || host === "youtu.be") {
    id =
      host === "youtu.be"
        ? url.pathname.split("/")[1] || null
        : url.pathname === "/watch"
          ? url.searchParams.get("v")
          : /^\/(?:shorts|embed|live)\/([\w-]{11})\/?$/.exec(url.pathname)?.[1] || null;
    if (!id || !/^[\w-]{11}$/.test(id))
      throw new Error("Use a YouTube video link, rather than a channel or playlist.");
    return { platform: "youtube", id, url: `https://www.youtube.com/watch?v=${id}` };
  }
  if (host === "tiktok.com") {
    id = /^\/@[\w.-]+\/video\/(\d{15,22})\/?$/.exec(url.pathname)?.[1] || null;
    if (!id) throw new Error("Use the full TikTok link containing /@account/video/…");
    return {
      platform: "tiktok",
      id,
      url: `https://www.tiktok.com${url.pathname.replace(/\/$/, "")}`,
    };
  }
  if (host === "facebook.com" || host === "fb.watch") {
    const match = /^\/(?:reel\/(\d+)|[^/]+\/videos\/(?:[^/]+\/)?(\d+)|share\/r\/([\w-]+))\/?$/.exec(
      url.pathname,
    );
    id =
      url.pathname === "/watch/" || url.pathname === "/watch"
        ? url.searchParams.get("v")
        : match?.[1] || match?.[2] || match?.[3] || null;
    if (host === "fb.watch") id = /^\/([\w-]+)\/?$/.exec(url.pathname)?.[1] || null;
    if (!id || !/^[\w-]{5,80}$/.test(id)) throw new Error("Use a Facebook Reel or video link.");
    return {
      platform: "facebook",
      id,
      url: `https://${host}${url.pathname}${url.searchParams.has("v") ? "?v=" + id : ""}`,
    };
  }
  throw new Error("Only YouTube, TikTok and Facebook video links are supported.");
}

export function mergeVideoEntries<
  T extends { id: string; platform: VideoPlatform; title: string; url?: string },
>(
  base: T[],
  records: VideoRecord[],
  placement: VideoPlacement,
): { id: string; platform: VideoPlatform; title: string; url?: string }[] {
  const map = new Map<
    string,
    { clip: { id: string; platform: VideoPlatform; title: string; url?: string }; order: number }
  >();
  for (const clip of base)
    if (!map.has(`${clip.platform}:${clip.id}`))
      map.set(`${clip.platform}:${clip.id}`, { clip, order: 10000 });
  for (const row of records) {
    if (row.origin_key?.startsWith(`${placement}:`))
      map.delete(row.origin_key.slice(placement.length + 1));
    if (row.placement !== placement) continue;
    const key = `${row.platform}:${row.video_id}`;
    if (!row.active) {
      map.delete(key);
      continue;
    }
    map.set(key, {
      clip: { id: row.video_id, platform: row.platform, title: row.title, url: row.url },
      order: row.sort_order,
    });
  }
  return [...map.values()].sort((a, b) => a.order - b.order).map((item) => item.clip);
}

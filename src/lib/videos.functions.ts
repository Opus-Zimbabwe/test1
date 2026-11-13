import { createServerFn } from "@tanstack/react-start";
import snapshot from "@/data/youtube-feed.json";
import type { VideoRecord } from "./video-library";
import type { YouTubeSnapshot } from "./youtube-feed.mjs";
let cached: YouTubeSnapshot | null = null;
let retryAfter = 0;
let pending: Promise<YouTubeSnapshot | null> | null = null;
async function youtubeFeed() {
  if (Date.now() < retryAfter) return cached;
  if (!pending)
    pending = (async () => {
      try {
        const { fetchYouTubeFeed, mergeYouTubeSnapshots } = await import("./youtube-feed.mjs");
        const channelId =
          process.env["YOUTUBE_CHANNEL_ID"] || cached?.channelId || snapshot.channelId;
        cached = mergeYouTubeSnapshots(
          { videos: [...(cached?.videos || []), ...snapshot.videos] },
          await fetchYouTubeFeed(channelId ? { channelId } : {}),
        );
        retryAfter = Date.now() + 3600000;
      } catch {
        retryAfter = Date.now() + 300000;
      } finally {
        pending = null;
      }
      return cached;
    })();
  return pending;
}
export const getVideoLibrary = createServerFn({ method: "GET" }).handler(async () => {
  const recordsPromise = (async () => {
    try {
      const { createServerPublicSupabase } = await import("./supabase-public.server");
      const client = createServerPublicSupabase();
      const { data, error } = await client
        .from("content_videos" as never)
        .select("*")
        .order("sort_order")
        .abortSignal(AbortSignal.timeout(5000));
      return { records: (data || []) as unknown as VideoRecord[], storageAvailable: !error };
    } catch {
      return { records: [] as VideoRecord[], storageAvailable: false };
    }
  })();
  const [storage, live] = await Promise.all([recordsPromise, youtubeFeed()]);
  return {
    ...storage,
    youtube: {
      videos: live?.videos || snapshot.videos,
      updatedAt: live?.updatedAt || snapshot.updatedAt,
      channelId: live?.channelId || snapshot.channelId,
      status: live
        ? ("live" as const)
        : snapshot.updatedAt
          ? ("saved" as const)
          : ("unavailable" as const),
    },
  };
});

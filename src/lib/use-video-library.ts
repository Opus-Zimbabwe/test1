import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getVideoLibrary } from "./videos.functions";
import { PODCAST_CLIPS, SOCIAL_CLIPS, type MediaClip } from "@/components/site/media";
import {
  mergeVideoEntries,
  type VideoPlacement,
  type VideoPlatform,
  type VideoRecord,
} from "./video-library";
export function useVideoLibrary() {
  const get = useServerFn(getVideoLibrary);
  return useQuery({
    queryKey: ["video-library"],
    queryFn: () => get(),
    staleTime: 60000,
    refetchInterval: 60000,
    retry: false,
  });
}
export function mergeVideos(
  placement: VideoPlacement,
  records: VideoRecord[],
  youtube: MediaClip[] = [],
): MediaClip[] {
  const base = placement === "podcast" ? PODCAST_CLIPS : [...youtube, ...SOCIAL_CLIPS];
  return mergeVideoEntries(base, records, placement);
}
export function useVideos(placement: VideoPlacement, platform?: VideoPlatform) {
  const { data } = useVideoLibrary();
  const clips = mergeVideos(
    placement,
    data?.records || [],
    (data?.youtube.videos || []) as MediaClip[],
  );
  return platform ? clips.filter((clip) => clip.platform === platform) : clips;
}

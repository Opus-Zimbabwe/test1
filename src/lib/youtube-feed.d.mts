export const CHANNEL_HANDLE: string;
export type YouTubeSnapshot = {channelId:string;updatedAt:string;videos:{id:string;platform:'youtube';title:string;publishedAt:string}[]};
export function parseYouTubeFeed(xml:string,channelId:string):YouTubeSnapshot['videos'];
export function resolveChannelId(html:string):string;
export function fetchYouTubeFeed(options?:{channelId?:string;fetcher?:typeof fetch}):Promise<YouTubeSnapshot>;
export function mergeYouTubeSnapshots(previous:{videos:YouTubeSnapshot['videos']}|null,current:YouTubeSnapshot):YouTubeSnapshot;

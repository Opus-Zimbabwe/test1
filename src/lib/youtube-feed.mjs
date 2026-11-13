export const CHANNEL_HANDLE = 'greatcouples';
const decode = value => value.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1').replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code))).replace(/&(amp|lt|gt|quot|apos);/g, (_, key) => ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"})[key]);
const tag = (xml, name) => decode(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`))?.[1]?.trim() || '');
export function parseYouTubeFeed(xml, channelId) {
  if (!/^UC[\w-]{22}$/.test(channelId)) throw new Error('Invalid YouTube channel ID');
  if (tag(xml.split('<entry>')[0], 'yt:channelId') !== channelId) throw new Error('YouTube feed does not match the configured channel');
  const seen = new Set();
  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
    const id = tag(entry, 'yt:videoId'); const title = tag(entry, 'title'); const publishedAt = tag(entry, 'published');
    if (!/^[\w-]{11}$/.test(id) || !title || seen.has(id) || tag(entry,'yt:channelId') !== channelId || !Number.isFinite(Date.parse(publishedAt))) return [];
    seen.add(id); return [{id, platform:'youtube', title, publishedAt}];
  });
  if (!videos.length) throw new Error('YouTube returned no valid videos; retaining existing content');
  return videos.sort((a,b) => Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,30);
}
export function resolveChannelId(html) {
  const patterns = [/<meta[^>]+itemprop=["']channelId["'][^>]+content=["'](UC[\w-]{22})["']/i, /"(?:channelId|externalId)"\s*:\s*"(UC[\w-]{22})"/, /https:\/\/www\.youtube\.com\/channel\/(UC[\w-]{22})/];
  for (const pattern of patterns) { const match = html.match(pattern); if (match) return match[1]; }
  throw new Error('Cannot resolve the Great Couples YouTube channel. Set YOUTUBE_CHANNEL_ID to its public UC… channel ID.');
}
export async function fetchYouTubeFeed({channelId, fetcher = fetch} = {}) {
  const get = async url => {const response = await fetcher(url, {signal:AbortSignal.timeout(7000),headers:{Accept:'application/atom+xml,text/html'}});if (!response.ok) throw new Error(`YouTube responded ${response.status}`);const body = await response.text();if (body.length > 4000000) throw new Error('YouTube response is too large');return body;};
  const resolved = channelId || resolveChannelId(await get(`https://www.youtube.com/@${CHANNEL_HANDLE}`));
  if (!/^UC[\w-]{22}$/.test(resolved)) throw new Error('Invalid YouTube channel ID');
  return {channelId:resolved, updatedAt:new Date().toISOString(), videos:parseYouTubeFeed(await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${resolved}`),resolved)};
}
export function mergeYouTubeSnapshots(previous, current) {
  const byId = new Map();
  for (const video of [...current.videos,...(previous?.videos || [])]) if (!byId.has(video.id)) byId.set(video.id,video);
  return {...current,videos:[...byId.values()].sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt)).slice(0,60)};
}

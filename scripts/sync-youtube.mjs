import {readFile,writeFile} from 'node:fs/promises';
import {fetchYouTubeFeed,mergeYouTubeSnapshots} from '../src/lib/youtube-feed.mjs';
const file = new URL('../src/data/youtube-feed.json',import.meta.url);
const previous = JSON.parse(await readFile(file,'utf8'));
try {
  const channelId = process.env.YOUTUBE_CHANNEL_ID || previous.channelId;
  const snapshot = mergeYouTubeSnapshots(previous, await fetchYouTubeFeed(channelId ? {channelId} : {}));
  if (JSON.stringify(previous.videos) !== JSON.stringify(snapshot.videos) || previous.channelId !== snapshot.channelId) {await writeFile(file,JSON.stringify(snapshot,null,2)+'\n'); console.log(`Updated ${snapshot.videos.length} YouTube videos.`);} else console.log('YouTube videos are up to date.');
} catch (error) {console.error(`YouTube sync failed; existing videos were retained. ${error.message}`);process.exitCode=1;}

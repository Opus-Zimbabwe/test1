import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
type Preview = { thumbnail: string | null; title: string | null };
const cache = new Map<string, { expires: number; value: Preview }>();
const pending = new Map<string, Promise<Preview>>();
export const getTikTokPreview = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ id: z.string().regex(/^\d{15,22}$/) }).parse(input))
  .handler(async ({ data }) => {
    const cached = cache.get(data.id);
    if (cached && cached.expires > Date.now()) return cached.value;
    if (pending.has(data.id)) return pending.get(data.id)!;
    const promise = (async () => {
      let value: Preview = { thumbnail: null, title: null };
      let lifetime = 180000;
      try {
        const url = new URL("https://www.tiktok.com/oembed");
        url.searchParams.set("url", `https://www.tiktok.com/@greatcouplestrust/video/${data.id}`);
        const response = await fetch(url, {
          signal: AbortSignal.timeout(4000),
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          const json = (await response.json()) as { thumbnail_url?: unknown; title?: unknown };
          const thumbnail = typeof json.thumbnail_url === "string" ? json.thumbnail_url : null;
          value = {
            thumbnail:
              thumbnail && thumbnail.startsWith("https://") && thumbnail.length < 5000
                ? thumbnail
                : null,
            title: typeof json.title === "string" ? json.title.slice(0, 300) : null,
          };
          if (value.thumbnail) lifetime = 1800000;
        }
      } catch {
        /* A provider outage must not delay rendering a usable video control. */
      }
      cache.set(data.id, { expires: Date.now() + lifetime, value });
      if (cache.size > 100) {
        const first = cache.keys().next().value;
        if (first) cache.delete(first);
      }
      pending.delete(data.id);
      return value;
    })();
    pending.set(data.id, promise);
    return promise;
  });

// Sitemap for search engines — lists the public, indexable pages only.
import { createFileRoute } from "@tanstack/react-router";

const PUBLIC_PAGES = [{ path: "/", priority: "1.0", changefreq: "weekly" }];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const urls = PUBLIC_PAGES.map(
          (page) =>
            `  <url>\n    <loc>${origin}${page.path}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});

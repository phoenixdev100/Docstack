import { CHANGELOG } from "@/lib/changelog";
import { site } from "@/lib/site";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed of changelog entries - subscribe for release updates. */
export function GET() {
  const items = CHANGELOG.map((entry) => {
    const body = [
      entry.summary ?? "",
      ...entry.groups.map(
        (g) => `${g.type.toUpperCase()}: ${g.items.join(" · ")}`
      ),
    ].join("\n\n");
    return `    <item>
      <title>${escapeXml(`${site.name} ${entry.version}`)}</title>
      <link>${site.url}/docs/changelog#${entry.version}</link>
      <guid isPermaLink="false">${entry.version}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description>${escapeXml(body)}</description>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${site.name} Changelog`)}</title>
    <link>${site.url}/docs/changelog</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(CHANGELOG[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

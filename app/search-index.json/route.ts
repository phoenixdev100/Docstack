import { buildSearchIndex } from "@/lib/docs";
import { flattenNavigation, VERSIONS } from "@/lib/navigation";

export const dynamic = "force-static";

/** Statically generated search index consumed by the local search provider. */
export function GET() {
  const sectionMap = new Map<string, string>();
  for (const v of VERSIONS) {
    for (const item of flattenNavigation(v.id)) {
      sectionMap.set(item.href, item.group);
    }
  }
  return Response.json(buildSearchIndex((href) => sectionMap.get(href) ?? "Docs"));
}

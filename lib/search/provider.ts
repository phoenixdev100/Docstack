/**
 * Search provider abstraction.
 *
 * The UI only talks to the `SearchProvider` interface, so the backend can be
 * swapped (Algolia DocSearch, Typesense, Meilisearch, Elasticsearch, ...) by
 * implementing this interface and returning it from `getSearchProvider()`
 * without touching any component.
 */

export interface SearchResultItem {
  title: string;
  href: string;
  section: string;
  description: string;
}

export interface SearchProvider {
  search(query: string, limit?: number): Promise<SearchResultItem[]>;
}

interface IndexDoc extends SearchResultItem {
  headings: string;
  excerpt: string;
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function score(doc: IndexDoc, terms: string[]): number {
  let total = 0;
  const title = normalize(doc.title);
  const headings = normalize(doc.headings);
  const section = normalize(doc.section);
  const desc = normalize(doc.description);
  const excerpt = normalize(doc.excerpt);

  for (const term of terms) {
    let s = 0;
    if (title === term) s += 60;
    else if (title.startsWith(term)) s += 30;
    else if (title.includes(term)) s += 18;
    if (headings.includes(term)) s += 8;
    if (section.includes(term)) s += 4;
    if (desc.includes(term)) s += 6;
    if (excerpt.includes(term)) s += 2;
    if (s === 0) return -1; // every term must match somewhere
    total += s;
  }
  return total;
}

/** Fetches the statically generated index once and scores it in-memory. */
export class LocalSearchProvider implements SearchProvider {
  private indexPromise: Promise<IndexDoc[]> | null = null;

  private load(): Promise<IndexDoc[]> {
    if (!this.indexPromise) {
      this.indexPromise = fetch("/search-index.json").then((res) => {
        if (!res.ok) throw new Error(`Failed to load search index (${res.status})`);
        return res.json() as Promise<IndexDoc[]>;
      });
    }
    return this.indexPromise;
  }

  async search(query: string, limit = 12): Promise<SearchResultItem[]> {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const index = await this.load();
    return index
      .map((doc) => ({ doc, s: score(doc, terms) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, limit)
      .map(({ doc }) => ({
        title: doc.title,
        href: doc.href,
        section: doc.section,
        description: doc.description,
      }));
  }
}

/**
 * Point this at an external provider to go live:
 *
 *   export function getSearchProvider(): SearchProvider {
 *     return new AlgoliaProvider(appId, apiKey, indexName);
 *   }
 */
let provider: SearchProvider | null = null;

export function getSearchProvider(): SearchProvider {
  if (!provider) provider = new LocalSearchProvider();
  return provider;
}

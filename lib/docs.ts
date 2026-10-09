import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { DEFAULT_VERSION, VERSIONS, isVersionId } from "./navigation";

const CONTENT_ROOT = path.join(process.cwd(), "content", "docs");

export interface DocFrontmatter {
  title: string;
  description?: string;
  updatedAt?: string;
  badge?: string;
  draft?: boolean;
  deprecated?: boolean;
}

export interface TocHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface Doc {
  version: string;
  /** Path segments under the version root, e.g. ["guides","webhooks"] */
  slug: string[];
  /** Public href, e.g. /docs/guides/webhooks or /docs/v1/api */
  href: string;
  frontmatter: DocFrontmatter;
  content: string;
  headings: TocHeading[];
  filePath: string;
  /** Estimated reading time in minutes (200 wpm). */
  readingMinutes: number;
}

export function docHref(version: string, slug: string[]): string {
  const prefix = version === DEFAULT_VERSION ? "/docs" : `/docs/${version}`;
  return slug.length ? `${prefix}/${slug.join("/")}` : prefix;
}

/** Strip fenced code blocks so heading extraction ignores `#` inside code. */
function stripCodeFences(source: string): string {
  return source.replace(/```[\s\S]*?(```|$)/g, "");
}

export function extractHeadings(source: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  for (const line of stripCodeFences(source).split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line.trimEnd());
    if (!match) continue;
    const text = match[2].replace(/[`*]/g, "").trim();
    headings.push({
      depth: match[1].length as 2 | 3,
      text,
      id: slugger.slug(text),
    });
  }
  return headings;
}

function docPath(version: string, slug: string[]): string | null {
  const base = path.join(CONTENT_ROOT, version, ...slug);
  for (const candidate of [`${base}.mdx`, path.join(base, "index.mdx")]) {
    if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) return candidate;
  }
  return null;
}

export function getDoc(version: string, slug: string[]): Doc | null {
  const filePath = docPath(version, slug);
  if (!filePath) return null;
  const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as DocFrontmatter;
  if (fm.draft) return null;
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    version,
    slug,
    href: docHref(version, slug),
    frontmatter: fm,
    content,
    headings: extractHeadings(content),
    filePath,
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

function walk(dir: string, base: string[] = []): string[][] {
  if (!fs.existsSync(dir)) return [];
  const out: string[][] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      out.push(...walk(path.join(dir, entry.name), [...base, entry.name]));
    } else if (entry.name.endsWith(".mdx")) {
      const name = entry.name.replace(/\.mdx$/, "");
      out.push(name === "index" ? base : [...base, name]);
    }
  }
  return out;
}

export function getAllDocs(): Doc[] {
  const docs: Doc[] = [];
  for (const v of VERSIONS) {
    for (const slug of walk(path.join(CONTENT_ROOT, v.id))) {
      const doc = getDoc(v.id, slug);
      if (doc) docs.push(doc);
    }
  }
  return docs;
}

/**
 * Parse a route slug into (version, docSlug).
 * `/docs/getting-started` -> (v2, ["getting-started"])
 * `/docs/v1/api`         -> (v1, ["api"])
 */
export function parseDocSlug(segments: string[]): {
  version: string;
  slug: string[];
} {
  if (segments.length && isVersionId(segments[0]) && segments[0] !== DEFAULT_VERSION) {
    return { version: segments[0], slug: segments.slice(1) };
  }
  return { version: DEFAULT_VERSION, slug: segments };
}

/* ---------------- Search index ---------------- */

export interface SearchDoc {
  title: string;
  href: string;
  section: string;
  description: string;
  headings: string;
  excerpt: string;
}

/** Rough markdown-to-text for search excerpts. */
function toPlainText(source: string): string {
  return stripCodeFences(source)
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[>*_`|~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchIndex(
  sectionFor: (href: string, version: string) => string
): SearchDoc[] {
  return getAllDocs().map((doc) => {
    const text = toPlainText(doc.content);
    return {
      title: doc.frontmatter.title,
      href: doc.href,
      section: sectionFor(doc.href, doc.version),
      description: doc.frontmatter.description ?? "",
      headings: doc.headings.map((h) => h.text).join(" "),
      excerpt: text.slice(0, 320),
    };
  });
}

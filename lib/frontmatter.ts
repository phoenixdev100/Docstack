import { parse } from "yaml";

const FENCE = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/;

/**
 * Minimal gray-matter equivalent: parses a leading YAML frontmatter block
 * delimited by `---` and returns { data, content }. Files without frontmatter
 * return the full source as content with empty data.
 */
export function frontmatter(source: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = FENCE.exec(source);
  if (!match) return { data: {}, content: source };

  const data = (parse(match[1]) ?? {}) as Record<string, unknown>;
  return { data, content: source.slice(match[0].length) };
}

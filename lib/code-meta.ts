/** Shared parsing for code fence meta strings and language display names. */

export const LANG_ALIASES: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  rb: "ruby",
  md: "markdown",
  "c++": "cpp",
};

export const LANG_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  jsx: "JSX",
  typescript: "TypeScript",
  tsx: "TSX",
  python: "Python",
  bash: "Shell",
  curl: "cURL",
  go: "Go",
  java: "Java",
  ruby: "Ruby",
  php: "PHP",
  json: "JSON",
  yaml: "YAML",
  toml: "TOML",
  sql: "SQL",
  http: "HTTP",
  text: "Text",
  markdown: "Markdown",
  xml: "XML",
  ini: "INI",
  diff: "Diff",
};

export function normalizeLang(lang?: string | null): string {
  const l = (lang ?? "text").toLowerCase();
  return LANG_ALIASES[l] ?? l;
}

export function langLabel(lang?: string | null): string {
  const raw = (lang ?? "text").toLowerCase();
  return LANG_LABELS[raw] ?? LANG_LABELS[normalizeLang(raw)] ?? raw;
}

export interface ParsedMeta {
  title?: string;
  /** Raw `{1,3-5}` expression consumed by transformerMetaHighlight. */
  highlightRaw?: string;
  lineNumbers: boolean;
}

export function parseMeta(meta?: string | null): ParsedMeta {
  const out: ParsedMeta = { lineNumbers: false };
  if (!meta) return out;
  const titleMatch = /title=(?:"([^"]*)"|'([^']*)'|(\S+))/.exec(meta);
  const title = titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3];
  if (title) out.title = title;
  const hl = /\{([\d,\-\s]+)\}/.exec(meta);
  if (hl) out.highlightRaw = `{${hl[1]}}`;
  if (/\b(lineNumbers|showLineNumbers|numberLines)\b/i.test(meta)) {
    out.lineNumbers = true;
  }
  return out;
}

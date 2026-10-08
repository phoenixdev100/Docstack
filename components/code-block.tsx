import { codeToHtml } from "shiki";
import { transformerMetaHighlight } from "@shikijs/transformers";
import {
  langLabel,
  normalizeLang,
  parseMeta,
} from "@/lib/code-meta";
import { CopyButton } from "./copy-button";

interface CodeBlockProps {
  code: string;
  lang?: string;
  /** Raw fence meta string, e.g. `title="app.ts" {2,4-6} lineNumbers`. */
  meta?: string;
  title?: string;
  /** Explicit `{1,3-4}` line highlight expression. */
  highlight?: string;
  lineNumbers?: boolean;
}

/**
 * Async server component - highlighting happens at build/request time with
 * zero client JS. Dual Shiki themes emit `--shiki-light*` / `--shiki-dark*`
 * CSS variables which globals.css resolves per theme.
 */
export async function CodeBlock({
  code,
  lang = "text",
  meta,
  title,
  highlight,
  lineNumbers,
}: CodeBlockProps) {
  if (!code) return null;

  const parsed = parseMeta(meta);
  const resolvedTitle = title ?? parsed.title;
  const resolvedLang = normalizeLang(lang);
  const showLineNumbers = lineNumbers ?? parsed.lineNumbers;

  const rawMeta = [parsed.highlightRaw, highlight]
    .filter(Boolean)
    .join(" ");

  const html = await codeToHtml(code.replace(/\n$/, ""), {
    lang: resolvedLang === "curl" ? "bash" : resolvedLang,
    themes: {
      light: "github-light-default",
      dark: "github-dark-default",
    },
    defaultColor: false,
    transformers: [transformerMetaHighlight()],
    meta: { __raw: rawMeta },
  });

  return (
    <figure className="code-block" data-line-numbers={showLineNumbers}>
      {resolvedTitle ? (
        <figcaption className="code-header">
          <span className="code-title">{resolvedTitle}</span>
          <span className="code-lang-tag">{langLabel(resolvedLang)}</span>
          <CopyButton text={code} />
        </figcaption>
      ) : (
        <div className="code-copy-float">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className="code-scroll"
        role="region"
        aria-label={`${langLabel(resolvedLang)} code sample`}
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

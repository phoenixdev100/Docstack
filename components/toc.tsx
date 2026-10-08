"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, ChevronDown, Copy, FileText, MessageSquare, Pencil, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { site } from "@/lib/site";
import clsx from "clsx";
import type { TocHeading } from "@/lib/docs";

function TocList({
  headings,
  active,
}: {
  headings: TocHeading[];
  active: string | null;
}) {
  return (
    <nav className="toc-list" aria-label="On this page">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={clsx(
            "toc-link",
            h.depth === 3 && "depth-3",
            active === h.id && "active"
          )}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}

/** Lightweight "Was this page helpful?" - persisted locally per page. */
function Feedback() {
  const pathname = usePathname() ?? "";
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    try {
      setVote(
        (localStorage.getItem(`meridian-feedback:${pathname}`) as "up" | "down") ??
          null
      );
    } catch {
      /* storage unavailable */
    }
  }, [pathname]);

  function submit(v: "up" | "down") {
    setVote(v);
    try {
      localStorage.setItem(`meridian-feedback:${pathname}`, v);
    } catch {
      /* storage unavailable */
    }
  }

  if (vote) {
    return (
      <p className="toc-feedback" role="status">
        Thanks for the feedback.
      </p>
    );
  }

  return (
    <div className="toc-feedback">
      <span>Was this page helpful?</span>
      <button
        type="button"
        className="feedback-btn"
        aria-label="Yes, this page was helpful"
        onClick={() => submit("up")}
      >
        <ThumbsUp aria-hidden />
      </button>
      <button
        type="button"
        className="feedback-btn"
        aria-label="No, this page was not helpful"
        onClick={() => submit("down")}
      >
        <ThumbsDown aria-hidden />
      </button>
    </div>
  );
}

/** "Copy page as Markdown" - fetches the raw .mdx source and copies it. */
function CopyMarkdown({ rawHref }: { rawHref: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      const res = await fetch(rawHref);
      if (!res.ok) throw new Error(String(res.status));
      await navigator.clipboard.writeText(await res.text());
      setState("copied");
      setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  return (
    <button type="button" className="toc-footer-link" onClick={copy}>
      {state === "copied" ? <Copy aria-hidden /> : <FileText aria-hidden />}
      {state === "copied"
        ? "Copied markdown"
        : state === "error"
          ? "Couldn't copy"
          : "Copy page as Markdown"}
    </button>
  );
}

/** Scroll-spy table of contents for the right rail. */
export function TableOfContents({
  headings,
  editHref,
  rawHref,
}: {
  headings: TocHeading[];
  editHref?: string;
  rawHref?: string;
}) {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    function onScroll() {
      const offset = 96;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= offset) current = el.id;
        else break;
      }
      setActive(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (!headings.length) return <aside className="docs-toc" aria-hidden />;

  return (
    <aside className="docs-toc">
      <div className="toc-inner">
        <p className="toc-title">On this page</p>
        <TocList headings={headings} active={active} />
        <div className="toc-footer">
          <Feedback />
          {rawHref && <CopyMarkdown rawHref={rawHref} />}
          {rawHref && (
            <>
              <a
                className="toc-footer-link"
                href={`https://chatgpt.com/?q=${encodeURIComponent(
                  `Read this documentation page and answer questions about it: ${site.url}${rawHref.replace("/raw", "/docs")}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare aria-hidden />
                Open in ChatGPT
              </a>
              <a
                className="toc-footer-link"
                href={`https://claude.ai/new?q=${encodeURIComponent(
                  `Read this documentation page and answer questions about it: ${site.url}${rawHref.replace("/raw", "/docs")}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Sparkles aria-hidden />
                Open in Claude
              </a>
            </>
          )}
          {editHref && (
            <a
              href={editHref}
              target="_blank"
              rel="noopener noreferrer"
              className="toc-footer-link"
            >
              <Pencil aria-hidden /> Edit this page
            </a>
          )}
          <button
            type="button"
            className="toc-footer-link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp aria-hidden /> Back to top
          </button>
        </div>
      </div>
    </aside>
  );
}

/** Collapsible "On this page" shown inline below the header on small screens. */
export function MobileToc({ headings }: { headings: TocHeading[] }) {
  if (!headings.length) return null;
  return (
    <details className="toc-mobile">
      <summary>
        On this page
        <ChevronDown aria-hidden />
      </summary>
      <TocList headings={headings} active={null} />
    </details>
  );
}

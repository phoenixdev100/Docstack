"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { useRouter } from "next/navigation";
import { Clock, CornerDownLeft, FileText, Hash, Search } from "lucide-react";
import clsx from "clsx";
import { getSearchProvider, type SearchResultItem } from "@/lib/search/provider";
import { useSearch } from "./search-context";

const RECENT_KEY = "docstack-recent-searches";
const MAX_RECENT = 5;

type Status = "idle" | "loading" | "done" | "error";

function loadRecent(): SearchResultItem[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as SearchResultItem[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(item: SearchResultItem) {
  try {
    const list = loadRecent().filter((r) => r.href !== item.href);
    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify([item, ...list].slice(0, MAX_RECENT))
    );
  } catch {
    /* storage unavailable */
  }
}

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return <>{text}</>;
  let nodes: (string | ReactElement)[] = [text];
  terms.forEach((term, ti) => {
    const next: (string | ReactElement)[] = [];
    for (const node of nodes) {
      if (typeof node !== "string") {
        next.push(node);
        continue;
      }
      const lower = node.toLowerCase();
      let i = 0;
      let k = 0;
      while (true) {
        const hit = lower.indexOf(term, i);
        if (hit === -1) {
          next.push(node.slice(i));
          break;
        }
        if (hit > i) next.push(node.slice(i, hit));
        next.push(<mark key={`${ti}-${k++}`}>{node.slice(hit, hit + term.length)}</mark>);
        i = hit + term.length;
      }
    }
    nodes = next;
  });
  return <>{nodes}</>;
}

export function SearchModal() {
  const { open, closeSearch } = useSearch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [recent, setRecent] = useState<SearchResultItem[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const provider = useMemo(() => getSearchProvider(), []);
  const listId = "search-results-listbox";

  const showingRecent = query.trim() === "" && recent.length > 0;
  const items = showingRecent ? recent : results;

  // Focus input on open; snapshot recents
  useEffect(() => {
    if (open) {
      setRecent(loadRecent());
      setSelected(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const t = setTimeout(async () => {
      try {
        const res = await provider.search(q);
        setResults(res);
        setStatus("done");
        setSelected(0);
      } catch {
        setStatus("error");
      }
    }, 120);
    return () => clearTimeout(t);
  }, [query, open, provider]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = useCallback(
    (item: SearchResultItem) => {
      saveRecent(item);
      closeSearch();
      router.push(item.href);
    },
    [closeSearch, router]
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!items.length) return;
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = (selected + dir + items.length) % items.length;
      setSelected(next);
      listRef.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[selected];
      if (item) go(item);
    }
  }

  if (!open) return null;

  // Group consecutive items by section for display
  const groups: { section: string; items: { item: SearchResultItem; index: number }[] }[] = [];
  items.forEach((item, index) => {
    const section = showingRecent ? "Recent" : item.section || "Pages";
    const last = groups[groups.length - 1];
    if (last && last.section === section) last.items.push({ item, index });
    else groups.push({ section, items: [{ item, index }] });
  });

  return (
    <div className="search-backdrop" onClick={closeSearch}>
      <div
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="search-input-row">
          <Search aria-hidden />
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={
              items.length ? `search-option-${selected}` : undefined
            }
            aria-autocomplete="list"
            spellCheck={false}
          />
          <kbd className="kbd">Esc</kbd>
        </div>

        <div className="search-results" ref={listRef} role="listbox" id={listId}>
          {status === "loading" && (
            <>
              {[0, 1, 2].map((i) => (
                <div className="search-result" key={i} aria-hidden>
                  <span className="search-result-icon skeleton" />
                  <span style={{ flex: 1 }}>
                    <span className="skeleton" style={{ display: "block", height: "0.8rem", width: "45%", marginBottom: "0.4rem" }} />
                    <span className="skeleton" style={{ display: "block", height: "0.65rem", width: "70%" }} />
                  </span>
                </div>
              ))}
            </>
          )}

          {status === "error" && (
            <div className="search-empty">
              <p className="search-empty-title">Search is unavailable</p>
              <p className="search-empty-desc">
                The search index could not be loaded. Check your connection and try again.
              </p>
            </div>
          )}

          {status === "done" && !items.length && (
            <div className="search-empty">
              <p className="search-empty-title">
                No results found for “{query.trim()}”
              </p>
              <p className="search-empty-desc">
                Try a different search term, or browse the sections in the sidebar.
              </p>
            </div>
          )}

          {(status === "done" || status === "idle") &&
            groups.map((group, gi) => (
              <div key={`${group.section}-${gi}`}>
                <div className="search-group-label">
                  {group.section}
                  {showingRecent && (
                    <button
                      type="button"
                      className="search-clear"
                      onClick={() => {
                        try {
                          localStorage.removeItem(RECENT_KEY);
                        } catch {
                          /* storage unavailable */
                        }
                        setRecent([]);
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {group.items.map(({ item, index }) => (
                  <button
                    key={item.href}
                    type="button"
                    role="option"
                    id={`search-option-${index}`}
                    aria-selected={index === selected}
                    data-index={index}
                    className={clsx("search-result", index === selected && "selected")}
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => go(item)}
                  >
                    <span className="search-result-icon">
                      {showingRecent ? <Clock aria-hidden /> : <FileText aria-hidden />}
                    </span>
                    <span className="search-result-body">
                      <span className="search-result-title">
                        <Highlight text={item.title} query={query} />
                      </span>
                      <span className="search-result-desc">{item.description}</span>
                    </span>
                    <span className="search-result-section">{item.section}</span>
                  </button>
                ))}
              </div>
            ))}

          {status === "idle" && !recent.length && (
            <div className="search-empty">
              <p className="search-empty-title">Search the documentation</p>
              <p className="search-empty-desc">
                Find guides, API endpoints, SDK methods, and more.
              </p>
            </div>
          )}
        </div>

        <div className="search-footer">
          <span className="hint">
            <kbd className="kbd"><CornerDownLeft size={10} aria-hidden /></kbd> to select
          </span>
          <span className="hint">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd> to navigate
          </span>
          <span className="hint">
            <kbd className="kbd">Esc</kbd> to close
          </span>
          <span className="hint" style={{ marginLeft: "auto" }}>
            <Hash size={10} aria-hidden /> {items.length} result{items.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}

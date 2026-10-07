"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

const PREF_KEY = "meridian-lang-pref";
const PREF_EVENT = "meridian-lang-change";

function normalize(label: string) {
  return label.trim().toLowerCase();
}

/**
 * Groups <CodeBlock> children into a language/tab switcher.
 *
 * The remark pipeline passes tab labels via the `labels` prop (JSON array
 * derived from each fence's title/lang) - client components can't reliably
 * introspect props of server-rendered children.
 *
 * Language preference is shared: choosing "Python" in one group switches every
 * CodeTabs that has a matching label, and persists across pages.
 */
export function CodeTabs({
  children,
  labels: labelsJson,
}: {
  children: ReactNode;
  labels?: string;
}) {
  const items = Children.toArray(children).filter(isValidElement);
  const labels: string[] = (() => {
    try {
      return JSON.parse(labelsJson ?? "[]");
    } catch {
      return [];
    }
  })();

  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  // Apply the saved language preference on mount.
  useEffect(() => {
    try {
      const pref = localStorage.getItem(PREF_KEY);
      if (!pref) return;
      const idx = labels.findIndex((l) => normalize(l) === pref);
      if (idx >= 0) setActive(idx);
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync when another CodeTabs group changes the preference.
  useEffect(() => {
    function onPref(e: Event) {
      const lang = (e as CustomEvent<string>).detail;
      const idx = labels.findIndex((l) => normalize(l) === lang);
      if (idx >= 0) setActive(idx);
    }
    window.addEventListener(PREF_EVENT, onPref);
    return () => window.removeEventListener(PREF_EVENT, onPref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(i: number) {
    setActive(i);
    const lang = normalize(labels[i] ?? "");
    if (!lang) return;
    try {
      localStorage.setItem(PREF_KEY, lang);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new CustomEvent(PREF_EVENT, { detail: lang }));
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (active + dir + items.length) % items.length;
    select(next);
    tabRefs.current[next]?.focus();
  }

  if (!items.length) return null;

  return (
    <div className="code-tabs">
      <div className="tab-list" role="tablist" onKeyDown={onKeyDown}>
        {items.map((_, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className="tab-trigger"
            onClick={() => select(i)}
          >
            {labels[i] ?? `Tab ${i + 1}`}
          </button>
        ))}
      </div>
      {items.map((child, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          className="tab-panel"
          hidden={i !== active}
        >
          {child as ReactElement}
        </div>
      ))}
    </div>
  );
}

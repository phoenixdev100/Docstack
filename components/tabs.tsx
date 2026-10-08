"use client";

import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

/** Generic tabbed content. Use <Tab label="..."> children. */
export function Tabs({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement);
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (active + dir + items.length) % items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  if (!items.length) return null;

  return (
    <div className="tabs">
      <div className="tab-list" role="tablist" onKeyDown={onKeyDown}>
        {items.map((child, i) => {
          const label = (child.props as { label?: string }).label ?? `Tab ${i + 1}`;
          return (
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
              onClick={() => setActive(i)}
            >
              {label}
            </button>
          );
        })}
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
          {child}
        </div>
      ))}
    </div>
  );
}

export function Tab({ children }: { label: string; children: ReactNode }) {
  return <>{children}</>;
}

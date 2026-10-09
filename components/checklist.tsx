"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

/**
 * Interactive checklist - checked state persists to localStorage.
 * Ideal for production/launch checklists readers can tick off.
 *
 * <Checklist id="production-setup" items={[
 *   "Rotate live API keys",
 *   "Verify webhook signatures",
 * ]} />
 */
export function Checklist({
  id,
  items = [],
}: {
  id: string;
  items?: string[];
}) {
  if (!items || items.length === 0) return null;

  const storageKey = `meridian-checklist:${id}`;
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (Array.isArray(saved)) {
        setChecked(items.map((_, i) => !!saved[i]));
      }
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }

  const done = checked.filter(Boolean).length;

  return (
    <div className="checklist">
      <div className="checklist-head">
        <span className="checklist-progress">
          {done}/{items.length} complete
        </span>
      </div>
      <ul className="checklist-items">
        {items.map((item, i) => (
          <li key={i}>
            <label className="checklist-item">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
              />
              <span className="checklist-box" aria-hidden>
                {checked[i] && <Check />}
              </span>
              <span className="checklist-text">{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { Keyboard } from "lucide-react";

/** Floating "?" button (bottom-right) that opens the shortcuts modal. */
export function ShortcutsButton() {
  return (
    <button
      type="button"
      className="shortcuts-fab"
      aria-label="Keyboard shortcuts"
      title="Keyboard shortcuts (?)"
      onClick={() => window.dispatchEvent(new Event("meridian-open-shortcuts"))}
    >
      <Keyboard aria-hidden />
    </button>
  );
}

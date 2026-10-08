"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { X } from "lucide-react";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["Ctrl", "K"], label: "Search documentation" },
  { keys: ["/"], label: "Search documentation" },
  { keys: ["?"], label: "Show keyboard shortcuts" },
  { keys: ["Esc"], label: "Close dialog / dismiss" },
  { keys: ["g", "d"], label: "Go to documentation home" },
  { keys: ["g", "c"], label: "Go to changelog" },
  { keys: ["t"], label: "Toggle light / dark theme" },
];

function isTyping() {
  const el = document.activeElement as HTMLElement | null;
  return (
    !!el &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.tagName === "SELECT" ||
      el.isContentEditable)
  );
}

/** Global keyboard shortcuts - `?` opens this reference; chords navigate. */
export function ShortcutsModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const chordRef = useRef(false);
  const chordTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.defaultPrevented || isTyping() || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }
      if (open) return;

      if (chordRef.current) {
        chordRef.current = false;
        clearTimeout(chordTimer.current);
        if (e.key === "d") router.push("/docs");
        else if (e.key === "c") router.push("/docs/changelog");
        return;
      }
      if (e.key === "g") {
        chordRef.current = true;
        chordTimer.current = setTimeout(() => (chordRef.current = false), 800);
        return;
      }
      if (e.key === "t") {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }
    },
    [open, router, resolvedTheme, setTheme]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // Navbar button opens the modal via this event.
  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("meridian-open-shortcuts", onOpen);
    return () => window.removeEventListener("meridian-open-shortcuts", onOpen);
  }, []);

  if (!open) return null;

  return (
    <div className="search-backdrop" onClick={() => setOpen(false)}>
      <div
        className="shortcuts-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shortcuts-head">
          <span className="shortcuts-title">Keyboard shortcuts</span>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden />
          </button>
        </div>
        <ul className="shortcuts-list">
          {SHORTCUTS.map((s, i) => (
            <li key={i} className="shortcut-row">
              <span className="shortcut-label">{s.label}</span>
              <span className="shortcut-keys">
                {s.keys.map((k, i) => (
                  <span key={i}>
                    {i > 0 && <span className="shortcut-then">then</span>}
                    <kbd className="kbd">{k}</kbd>
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

import { Search } from "lucide-react";
import { useSearch } from "./search-context";

export function SearchTrigger() {
  const { openSearch } = useSearch();
  const isMac =
    typeof navigator !== "undefined" &&
    /mac/i.test(navigator.platform ?? navigator.userAgent);

  return (
    <button
      type="button"
      className="search-trigger"
      onClick={openSearch}
      aria-label="Search documentation"
    >
      <Search aria-hidden />
      <span className="search-label">Search documentation…</span>
      <span className="kbd-group">
        {isMac ? <kbd className="kbd">⌘</kbd> : <kbd className="kbd">Ctrl</kbd>}
        <kbd className="kbd">K</kbd>
      </span>
    </button>
  );
}

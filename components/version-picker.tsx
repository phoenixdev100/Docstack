"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { DEFAULT_VERSION, VERSIONS, isVersionId } from "@/lib/navigation";

/**
 * Version selector. Default version URLs are unversioned (/docs/...);
 * older versions are prefixed (/docs/v1/...). Switching keeps the same
 * page when it exists in the target version, otherwise falls back to the
 * version root.
 */
export function VersionPicker() {
  const pathname = usePathname() ?? "/docs";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const segments = pathname.split("/").filter(Boolean); // ["docs", ...]
  const current =
    segments[1] && isVersionId(segments[1]) ? segments[1] : DEFAULT_VERSION;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function switchTo(version: string) {
    setOpen(false);
    const rest =
      segments[1] && isVersionId(segments[1]) ? segments.slice(2) : segments.slice(1);
    const target =
      version === DEFAULT_VERSION
        ? `/docs${rest.length ? `/${rest.join("/")}` : ""}`
        : `/docs/${version}${rest.length ? `/${rest.join("/")}` : ""}`;
    router.push(target);
  }

  return (
    <div className="version-picker" ref={ref}>
      <button
        type="button"
        className="version-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Documentation version: ${current}`}
        onClick={() => setOpen((o) => !o)}
      >
        {current}
        <ChevronDown aria-hidden />
      </button>
      {open && (
        <div className="dropdown" role="listbox" aria-label="Versions">
          {VERSIONS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="option"
              aria-selected={v.id === current}
              className={clsx("dropdown-item", v.id === current && "active")}
              onClick={() => switchTo(v.id)}
            >
              <span>
                {v.label}
                {v.isDefault ? " (latest)" : ""}
              </span>
              {v.id === current && <Check aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

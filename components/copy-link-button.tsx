"use client";

import { useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import clsx from "clsx";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      className={clsx("meta-btn", copied && "copied")}
      onClick={copy}
      aria-live="polite"
    >
      {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

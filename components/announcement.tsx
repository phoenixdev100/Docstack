"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { site } from "@/lib/site";

/** Dismissible site-wide banner - persists dismissal per announcement id. */
export function Announcement() {
  const ann = site.announcement;
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ann) return;
    try {
      setVisible(localStorage.getItem(`meridian-ann-${ann.id}`) !== "dismissed");
    } catch {
      setVisible(true);
    }
  }, [ann]);

  if (!ann || !visible || pathname === "/") return null;

  function dismiss() {
    try {
      localStorage.setItem(`meridian-ann-${ann!.id}`, "dismissed");
    } catch {
      /* storage unavailable */
    }
    setVisible(false);
  }

  return (
    <div className="announcement" role="status">
      <div className="announcement-inner">
        <span className="announcement-msg">{ann.message}</span>
        <Link href={ann.href} className="announcement-link">
          {ann.linkText}
          <ArrowRight aria-hidden />
        </Link>
        <button
          type="button"
          className="announcement-close"
          aria-label="Dismiss announcement"
          onClick={dismiss}
        >
          <X aria-hidden />
        </button>
      </div>
    </div>
  );
}

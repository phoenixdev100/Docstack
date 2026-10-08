"use client";

import { useEffect, useRef } from "react";

/**
 * Thin progress bar pinned under the topnav - tracks scroll through the
 * article element. Updates via transform for cheap 60fps rendering.
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    function update() {
      const article = document.querySelector(".docs-article");
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const progress = total > 0 ? Math.min(doc.scrollTop / total, 1) : 0;
      // Fade in once scrolled past the article top.
      const visible = !!article && doc.scrollTop > 60;
      bar!.style.transform = `scaleX(${progress})`;
      bar!.style.opacity = visible ? "1" : "0";
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden>
      <div ref={barRef} className="reading-progress-bar" />
    </div>
  );
}

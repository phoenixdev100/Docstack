"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Status = "operational" | "degraded" | "outage" | "unknown";

const LABEL: Record<Status, string> = {
  operational: "All systems operational",
  degraded: "Degraded performance",
  outage: "Service outage",
  unknown: "Status unknown",
};

/** Live status dot in the navbar - polls /status.json, links to status page. */
export function StatusWidget() {
  const [status, setStatus] = useState<Status>("unknown");

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const res = await fetch("/status.json", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setStatus(data.status ?? "unknown");
      } catch {
        if (!cancelled) setStatus("unknown");
      }
    }
    poll();
    const t = setInterval(poll, 60_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <a
      href={site.status}
      target="_blank"
      rel="noopener noreferrer"
      className={`status-widget status-${status}`}
      title={LABEL[status]}
      aria-label={`Platform status: ${LABEL[status]}`}
    >
      <span className="status-dot" aria-hidden />
      <span className="status-text">{LABEL[status]}</span>
    </a>
  );
}

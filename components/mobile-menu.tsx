"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar";
import { VersionPicker } from "./version-picker";
import { site, topNavLinks } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="icon-btn nav-menu-btn"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden />
      </button>
      {open && (
        <>
          <div className="drawer-backdrop" onClick={() => setOpen(false)} />
          <div className="drawer" role="dialog" aria-modal="true" aria-label="Navigation">
            <div className="drawer-header">
              <Link href="/docs" className="topnav-brand">
                <Logo size={18} />
                {site.name}
                <span className="topnav-docs-label">Docs</span>
              </Link>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden />
              </button>
            </div>
            <nav className="topnav-links" aria-label="Sections">
              {topNavLinks.map((l) => (
                <Link key={l.href} href={l.href} className="topnav-link">
                  {l.title}
                </Link>
              ))}
            </nav>
            <div style={{ marginBottom: "1rem" }}>
              <VersionPicker />
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import {
  getNavigation,
  isVersionId,
  DEFAULT_VERSION,
  type NavLeaf,
} from "@/lib/navigation";

const STORAGE_KEY = "docstack-sidebar-collapsed";

function loadCollapsed(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function persist(collapsed: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...collapsed]));
  } catch {
    /* storage unavailable */
  }
}

function NavItem({
  item,
  pathname,
  collapsed,
  onToggle,
}: {
  item: NavLeaf;
  pathname: string;
  collapsed: Set<string>;
  onToggle: (key: string) => void;
}) {
  const hasChildren = !!item.children?.length;
  const isActive = pathname === item.href;
  const childActive = item.children?.some((c) => c.href === pathname);
  const expanded = !collapsed.has(item.href);

  if (!hasChildren) {
    return (
      <li className="side-item">
        <Link
          href={item.href}
          className={clsx("side-link", isActive && "active")}
          aria-current={isActive ? "page" : undefined}
        >
          {item.method && (
            <span className={`method-tag method-${item.method.toLowerCase()}`}>
              {item.method}
            </span>
          )}
          {item.title}
        </Link>
      </li>
    );
  }

  return (
    <li className="side-item">
      <button
        type="button"
        className={clsx("side-link", (isActive || childActive) && "active")}
        aria-expanded={expanded}
        onClick={() => onToggle(item.href)}
      >
        {item.title}
        <ChevronRight className="chevron" aria-hidden />
      </button>
      {expanded && (
        <ul className="side-children">
          <li className="side-item">
            <Link
              href={item.href}
              className={clsx("side-link", isActive && "active")}
              aria-current={isActive ? "page" : undefined}
            >
              Overview
            </Link>
          </li>
          {item.children!.map((child) => (
            <li className="side-item" key={child.href}>
              <Link
                href={child.href}
                className={clsx("side-link", pathname === child.href && "active")}
                aria-current={pathname === child.href ? "page" : undefined}
              >
                {child.method && (
                  <span
                    className={`method-tag method-${child.method.toLowerCase()}`}
                  >
                    {child.method}
                  </span>
                )}
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";
  const version = useMemo(() => {
    const seg = pathname.split("/")[2] ?? "";
    return isVersionId(seg) ? seg : DEFAULT_VERSION;
  }, [pathname]);
  const nav = useMemo(() => getNavigation(version), [version]);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCollapsed(loadCollapsed());
  }, []);

  // When navigating, expand any group/parent that contains the active item -
  // but still allow the user to collapse it manually afterwards.
  useEffect(() => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const group of nav) {
        const groupActive = group.items.some(
          (i) => i.href === pathname || i.children?.some((c) => c.href === pathname)
        );
        if (groupActive && next.delete(`group:${group.title}`)) changed = true;
        for (const item of group.items) {
          if (item.children?.some((c) => c.href === pathname) && next.delete(item.href))
            changed = true;
        }
      }
      if (changed) persist(next);
      return changed ? next : prev;
    });
  }, [pathname, nav]);

  function toggle(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      persist(next);
      return next;
    });
  }

  return (
    <nav aria-label="Documentation" onClick={onNavigate ? (e) => {
      if ((e.target as HTMLElement).closest("a")) onNavigate();
    } : undefined}>
      {nav.map((group) => {
        const expanded = !collapsed.has(`group:${group.title}`);
        return (
          <div className="side-group" key={group.title}>
            <button
              type="button"
              className="side-group-label"
              aria-expanded={expanded}
              onClick={() => toggle(`group:${group.title}`)}
            >
              {group.title}
              <ChevronRight className="chevron" aria-hidden />
            </button>
            {expanded && (
              <ul>
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                    onToggle={toggle}
                  />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar-inner">
        <SidebarNav />
      </div>
    </aside>
  );
}

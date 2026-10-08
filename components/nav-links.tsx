"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { topNavLinks } from "@/lib/site";

const SECTION_MAP: { match: RegExp; href: string }[] = [
  { match: /^\/docs\/(v\d+\/)?guides/, href: "/docs/guides/first-integration" },
  { match: /^\/docs\/(v\d+\/)?api/, href: "/docs/api" },
  { match: /^\/docs\/(v\d+\/)?sdks/, href: "/docs/sdks/javascript" },
  { match: /^\/docs\/(v\d+\/)?resources/, href: "/docs/resources/examples" },
  { match: /^\/docs\/changelog/, href: "/docs/changelog" },
];

export function NavLinks() {
  const pathname = usePathname() ?? "";
  const activeHref = SECTION_MAP.find((s) => s.match.test(pathname))?.href;

  return (
    <nav className="topnav-links" aria-label="Sections">
      {topNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx("topnav-link", link.href === activeHref && "active")}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}

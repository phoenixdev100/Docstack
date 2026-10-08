import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { SearchTrigger } from "./search-trigger";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { VersionPicker } from "./version-picker";
import { StatusWidget } from "./status-widget";
import { site } from "@/lib/site";

export function Navbar() {
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <MobileMenu />
        <Link href="/docs" className="topnav-brand" aria-label={`${site.name} documentation`}>
          <Logo size={20} />
          {site.name}
          <span className="topnav-docs-label">Docs</span>
        </Link>
        <span className="topnav-divider" aria-hidden />
        <NavLinks />
        <div className="topnav-right">
          <SearchTrigger />
          <StatusWidget />
          <VersionPicker />
          <ThemeToggle />
          <a href={site.dashboard} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
            Dashboard
            <ExternalLink aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}

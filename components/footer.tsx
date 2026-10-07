import Link from "next/link";
import { Logo } from "./logo";
import { site } from "@/lib/site";

const LINKS: { title: string; href: string; external?: boolean }[] = [
  { title: "Documentation", href: "/docs" },
  { title: "API Reference", href: "/docs/api" },
  { title: "SDKs", href: "/docs/sdks/javascript" },
  { title: "Changelog", href: "/docs/changelog" },
  { title: "Status", href: site.status, external: true },
  { title: "GitHub", href: site.github, external: true },
  { title: "Support", href: site.support, external: true },
  { title: "Terms", href: "https://meridian.dev/terms", external: true },
  { title: "Privacy", href: "https://meridian.dev/privacy", external: true },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-bar">
          <span className="footer-brand">
            <Logo size={14} />
            <span className="footer-copy">
              © {new Date().getFullYear()} {site.name} Technologies, Inc.
            </span>
          </span>
          <nav className="footer-links" aria-label="Footer">
            {LINKS.map((l) =>
              l.external ? (
                <a
                  key={l.title}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.title}
                </a>
              ) : (
                <Link key={l.title} href={l.href}>
                  {l.title}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}

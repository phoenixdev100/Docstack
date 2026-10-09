import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Braces, Boxes, Terminal } from "lucide-react";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} Documentation`,
  description: site.description,
  alternates: { canonical: "/" },
};

const ENTRY_POINTS = [
  {
    icon: BookOpen,
    title: "Guides",
    desc: "Integration walkthroughs",
    href: "/docs/guides/first-integration",
  },
  {
    icon: Braces,
    title: "API Reference",
    desc: "Every endpoint, typed",
    href: "/docs/api",
  },
  {
    icon: Boxes,
    title: "SDKs",
    desc: "Five languages + CLI",
    href: "/docs/sdks/javascript",
  },
  {
    icon: Terminal,
    title: "Security",
    desc: "SSO, SCIM, compliance",
    href: "/docs/security/overview",
  },
];

export default function Home() {
  return (
    <main className="landing">
      <div className="landing-hero">
        <div className="landing-mark">
          <span className="landing-logo">
            <Logo size={22} />
          </span>
          <span className="landing-eyebrow">{site.product}</span>
        </div>

        <h1 className="landing-title">Documentation</h1>
        <p className="landing-desc">
          Guides, API reference, and SDKs for building on the Meridian
          platform - versioned, searchable, and built to scale.
        </p>

        <div className="landing-actions">
          <Link href="/docs/getting-started" className="btn btn-primary">
            Get started
            <ArrowRight aria-hidden />
          </Link>
          <Link href="/docs/api" className="btn btn-secondary">
            API reference
          </Link>
        </div>

        <p className="landing-hint">
          Press <kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">K</kbd> to
          search · <kbd className="kbd">?</kbd> for shortcuts
        </p>
      </div>

      <nav className="landing-links" aria-label="Documentation sections">
        {ENTRY_POINTS.map((e) => (
          <Link key={e.href} href={e.href} className="landing-link">
            <e.icon className="landing-link-icon" aria-hidden />
            <span className="landing-link-title">{e.title}</span>
            <span className="landing-link-desc">{e.desc}</span>
          </Link>
        ))}
      </nav>

      <footer className="landing-foot">
        <span>v2 is the current API version</span>
        <span className="landing-foot-dot" aria-hidden>·</span>
        <Link href="/docs/changelog">Changelog</Link>
        <span className="landing-foot-dot" aria-hidden>·</span>
        <a href={site.status} target="_blank" rel="noopener noreferrer">
          Status
        </a>
      </footer>
    </main>
  );
}

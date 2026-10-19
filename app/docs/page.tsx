import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { SearchTrigger } from "@/components/search-trigger";
import { CardGrid, Card } from "@/components/card";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description: site.description,
  alternates: { canonical: "/docs" },
  openGraph: { title: `${site.name} Documentation`, description: site.description },
};

const CATEGORIES = [
  {
    title: "Getting started",
    description: "Create an account, get API keys, and make your first request.",
    href: "/docs/getting-started",
  },
  {
    title: "Core concepts",
    description: "Projects, environments, and permissions - how Meridian is organized.",
    href: "/docs/concepts/architecture",
  },
  {
    title: "Guides",
    description: "Step-by-step walkthroughs for integrations, webhooks, and production.",
    href: "/docs/guides/first-integration",
  },
  {
    title: "API reference",
    description: "Every endpoint, parameter, and error code in the REST API.",
    href: "/docs/api",
  },
  {
    title: "SDKs",
    description: "Official libraries for JavaScript, Python, Go, Java, and Ruby.",
    href: "/docs/sdks/javascript",
  },
  {
    title: "Resources",
    description: "Runnable examples, FAQ, changelog, and platform status.",
    href: "/docs/resources/examples",
  },
];

const POPULAR = [
  { title: "Quickstart", href: "/docs/getting-started/quickstart" },
  { title: "Authentication", href: "/docs/getting-started/authentication" },
  { title: "Create a project", href: "/docs/api/projects/create" },
  { title: "Webhooks", href: "/docs/guides/webhooks" },
  { title: "JavaScript SDK", href: "/docs/sdks/javascript" },
  { title: "Error handling", href: "/docs/guides/error-handling" },
  { title: "Environments", href: "/docs/concepts/environments" },
  { title: "Rate limits & errors", href: "/docs/api/errors" },
];

export default function DocsHome() {
  return (
      <div className="docs-home">
        <div className="docs-home-hero">
          <span className="overline">Documentation</span>
          <h1>Everything you need to build with {site.name}.</h1>
          <p>
            Guides, API reference, and SDK documentation for integrating
            {site.product} - from your first request to production.
          </p>
          <div className="docs-home-search">
            <SearchTrigger />
          </div>
        </div>

        <section aria-labelledby="quickstart-heading">
          <h2 className="home-section-title" id="quickstart-heading">
            Start here
          </h2>
          <CardGrid>
            <Card title="Quickstart" href="/docs/getting-started/quickstart" icon="zap">
              Make your first API call in under five minutes.
            </Card>
            <Card title="API Reference" href="/docs/api" icon="code">
              Complete reference for every REST endpoint.
            </Card>
            <Card title="SDKs" href="/docs/sdks/javascript" icon="box">
              Typed client libraries for five languages.
            </Card>
            <Card title="Authentication" href="/docs/getting-started/authentication" icon="key">
              API keys, environments, and request signing.
            </Card>
          </CardGrid>
        </section>

        <section className="home-section" aria-labelledby="categories-heading">
          <h2 className="home-section-title" id="categories-heading">
            Browse the documentation
          </h2>
          <CardGrid>
            {CATEGORIES.map((c) => (
              <Card key={c.href} title={c.title} href={c.href}>
                {c.description}
              </Card>
            ))}
          </CardGrid>
        </section>

        <section className="home-section" aria-labelledby="popular-heading">
          <h2 className="home-section-title" id="popular-heading">
            Popular pages
          </h2>
          <div className="popular-list">
            {POPULAR.map((p) => (
              <Link key={p.href} href={p.href} className="popular-link">
                <FileText aria-hidden />
                {p.title}
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section" aria-labelledby="resources-heading">
          <h2 className="home-section-title" id="resources-heading">
            Developer resources
          </h2>
          <CardGrid>
            <Card title="Examples" href="/docs/resources/examples" icon="terminal">
              Runnable sample apps and request collections.
            </Card>
            <Card title="Changelog" href="/docs/changelog" icon="clock">
              API and SDK releases, improvements, and fixes.
            </Card>
            <Card title="Platform status" href={site.status} icon="server">
              Uptime and incident history for all services.
            </Card>
          </CardGrid>
        </section>

        <p style={{ marginTop: "3rem", fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
          Can&rsquo;t find what you&rsquo;re looking for?{" "}
          <a href={site.support} target="_blank" rel="noopener noreferrer">
            Contact support
          </a>{" "}
          <ArrowRight size={12} style={{ display: "inline", verticalAlign: "middle" }} aria-hidden />
        </p>
      </div>
  );
}

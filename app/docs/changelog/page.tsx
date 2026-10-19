import type { Metadata } from "next";
import { Badge } from "@/components/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DocHeader } from "@/components/doc-header";
import { CHANGELOG, type ChangelogGroup } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "API and SDK releases - new features, improvements, fixes, and breaking changes.",
  alternates: { canonical: "/docs/changelog" },
};

const GROUP_LABELS: Record<ChangelogGroup["type"], string> = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
  breaking: "Breaking",
};

const GROUP_VARIANTS: Record<ChangelogGroup["type"], "accent" | "success" | "warning" | "danger"> = {
  new: "accent",
  improved: "success",
  fixed: "warning",
  breaking: "danger",
};

export default function ChangelogPage() {
  return (
    <article className="docs-article">
      <div className="docs-article-inner">
        <Breadcrumbs
          items={[
            { title: "Docs", href: "/docs" },
            { title: "Resources" },
            { title: "Changelog" },
          ]}
        />
        <DocHeader
          title="Changelog"
          description="Notable changes to the Meridian API, SDKs, and platform. API versions are date-independent; SDK releases follow semver."
          updatedAt={CHANGELOG[0]?.date}
        />
        <div>
          {CHANGELOG.map((entry) => (
            <section className="changelog-entry" key={entry.version} id={entry.version}>
              <time className="changelog-date" dateTime={entry.date}>
                {new Date(entry.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <div>
                <div className="changelog-version">
                  <h2>{entry.version}</h2>
                  {entry.groups.some((g) => g.type === "breaking") && (
                    <Badge variant="danger">Breaking</Badge>
                  )}
                </div>
                {entry.summary && (
                  <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                    {entry.summary}
                  </p>
                )}
                {entry.groups.map((group) => (
                  <div className="changelog-group" key={group.type}>
                    <span className="changelog-group-label">
                      <Badge variant={GROUP_VARIANTS[group.type]}>
                        {GROUP_LABELS[group.type]}
                      </Badge>
                    </span>
                    <ul>
                      {group.items.map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Minimal inline markdown: `code` and **bold** only. */
function inlineMd(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

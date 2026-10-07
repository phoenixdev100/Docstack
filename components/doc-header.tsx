import { Pencil } from "lucide-react";
import { site } from "@/lib/site";
import { Badge } from "./badge";
import { CopyLinkButton } from "./copy-link-button";

export function DocHeader({
  title,
  description,
  updatedAt,
  /** Repo-relative path for the "Edit page" link, e.g. v2/guides/webhooks.mdx */
  editPath,
  /** Status badge from frontmatter, e.g. "Beta" or "Deprecated". */
  badge,
  deprecated,
  readingMinutes,
}: {
  title: string;
  description?: string;
  updatedAt?: string;
  editPath?: string;
  badge?: string;
  deprecated?: boolean;
  readingMinutes?: number;
}) {
  const formatted = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <header className="doc-header">
      <h1>
        {title}
        {badge && (
          <Badge variant={deprecated ? "warning" : "accent"}>{badge}</Badge>
        )}
        {deprecated && !badge && <Badge variant="danger">Deprecated</Badge>}
      </h1>
      {description && <p className="doc-description">{description}</p>}
      <div className="doc-meta">
        {formatted && <span>Last updated {formatted}</span>}
        {readingMinutes && <span className="doc-reading-time">{readingMinutes} min read</span>}
        <span className="meta-actions">
          <CopyLinkButton />
          {editPath && (
            <a
              className="meta-btn"
              href={`${site.githubDocs}/${editPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Pencil aria-hidden />
              Edit page
            </a>
          )}
        </span>
      </div>
    </header>
  );
}

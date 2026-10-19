import path from "node:path";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  getAllDocs,
  getDoc,
  parseDocSlug,
  docHref,
} from "@/lib/docs";
import {
  flattenNavigation,
  getBreadcrumbs,
  DEFAULT_VERSION,
} from "@/lib/navigation";
import { remarkCodeBlocks } from "@/lib/mdx/remark-code-blocks";
import { mdxComponents } from "@/lib/mdx-components";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DocHeader } from "@/components/doc-header";
import { TableOfContents, MobileToc } from "@/components/toc";
import { PrevNext } from "@/components/prev-next";
import { Callout } from "@/components/callout";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({
    slug:
      doc.version === DEFAULT_VERSION
        ? doc.slug
        : [doc.version, ...doc.slug],
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { version, slug: docSlug } = parseDocSlug(slug);
  const doc = getDoc(version, docSlug);
  if (!doc) return {};
  const { title, description } = doc.frontmatter;
  const versionLabel = version === DEFAULT_VERSION ? "" : ` (${version.toUpperCase()})`;
  return {
    title: `${title}${versionLabel}`,
    description,
    alternates: { canonical: doc.href },
    openGraph: { title, description, url: doc.href, type: "article" },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const { version, slug: docSlug } = parseDocSlug(slug);
  const doc = getDoc(version, docSlug);

  if (!doc) {
    // Bare version root like /docs/v1 -> first nav page of that version
    if (docSlug.length === 0 && version !== DEFAULT_VERSION) {
      const first = flattenNavigation(version)[0];
      if (first) redirect(first.href);
    }
    notFound();
  }

  const flat = flattenNavigation(version);
  const index = flat.findIndex((i) => i.href === doc.href);
  const prev = index > 0 ? flat[index - 1] : undefined;
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : undefined;

  const editPath = path
    .relative(path.join(process.cwd(), "content", "docs"), doc.filePath)
    .replace(/\\/g, "/");

  const pageKey = slug.join("/");
  const breadcrumbItems = getBreadcrumbs(version, doc.href);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: doc.frontmatter.title,
        description: doc.frontmatter.description,
        url: `${site.url}${doc.href}`,
        dateModified: doc.frontmatter.updatedAt,
        publisher: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
        },
        isPartOf: { "@type": "WebSite", name: `${site.name} Docs`, url: site.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.title,
          item: b.href ? `${site.url}${b.href}` : undefined,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="docs-article" key={`${pageKey}-a`}>
        <div className="docs-article-inner">
          <Breadcrumbs items={breadcrumbItems} />
          <DocHeader
            title={doc.frontmatter.title}
            description={doc.frontmatter.description}
            updatedAt={doc.frontmatter.updatedAt}
            editPath={editPath}
            badge={doc.frontmatter.badge}
            deprecated={doc.frontmatter.deprecated}
            readingMinutes={doc.readingMinutes}
          />
          {version !== DEFAULT_VERSION && (
            <Callout type="note" title={`You're viewing ${version} docs`}>
              This is documentation for a legacy API version. For the current
              release, see the{" "}
              <Link href={docHref(DEFAULT_VERSION, doc.slug)}>
                v2 version of this page
              </Link>
              .
            </Callout>
          )}
          {doc.frontmatter.deprecated && (
            <Callout type="warning" title="Deprecated">
              This page documents a deprecated feature or API. It remains
              available for existing integrations but should not be used for new
              work. Check the <Link href="/docs/changelog">changelog</Link> for
              migration guidance.
            </Callout>
          )}
          <MobileToc headings={doc.headings} />
          <div className="doc-content">
            <MDXRemote
              source={doc.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkCodeBlocks],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
          <PrevNext prev={prev} next={next} />
        </div>
      </article>
      <TableOfContents
        key={`${pageKey}-t`}
        headings={doc.headings}
        editHref={`${site.githubDocs}/${editPath}`}
        rawHref={`/raw/${version === DEFAULT_VERSION ? doc.slug.join("/") : [version, ...doc.slug].join("/")}`}
      />
    </>
  );
}

export const site = {
  name: "Meridian",
  product: "Meridian Platform",
  docsTitle: "Meridian Docs",
  description:
    "Documentation, guides, and API reference for building on the Meridian platform.",
  url: "https://docs.meridian.dev",
  apiBase: "https://api.meridian.dev/v2",
  github: "https://github.com/meridian/platform",
  githubDocs: "https://github.com/meridian/platform/tree/main/content/docs",
  dashboard: "https://app.meridian.dev",
  status: "https://status.meridian.dev",
  support: "https://meridian.dev/support",
  /** Site-wide announcement - set to null to hide the banner. */
  announcement: {
    /** Unique ID - bump it to re-show the banner after users dismiss it. */
    id: "v1-sunset-2027",
    message: "API v1 retires on March 31, 2027.",
    linkText: "Migration guide",
    href: "/docs/guides/migrate-v1-v2",
  } as { id: string; message: string; linkText: string; href: string } | null,
} as const;

export const topNavLinks = [
  { title: "Guides", href: "/docs/guides/first-integration" },
  { title: "API Reference", href: "/docs/api" },
  { title: "SDKs", href: "/docs/sdks/javascript" },
  { title: "Resources", href: "/docs/resources/examples" },
  { title: "Changelog", href: "/docs/changelog" },
];

export interface DocsVersion {
  id: string;
  label: string;
  isDefault?: boolean;
}

export const VERSIONS: DocsVersion[] = [
  { id: "v2", label: "v2", isDefault: true },
  { id: "v1", label: "v1" },
];

export const DEFAULT_VERSION = "v2";

export function isVersionId(segment: string): boolean {
  return VERSIONS.some((v) => v.id === segment);
}

export function getVersion(id: string): DocsVersion {
  return VERSIONS.find((v) => v.id === id) ?? VERSIONS[0];
}

export interface NavLeaf {
  title: string;
  href: string;
  badge?: string;
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  children?: NavLeaf[];
}

export interface NavGroup {
  title: string;
  items: NavLeaf[];
}

export type SidebarNav = NavGroup[];

/**
 * Navigation trees per documentation version. Content lives in
 * content/docs/<version>/** and hrefs are generated from slugs so a new
 * version only needs a new directory + a new entry here.
 */
const NAV_V2: SidebarNav = [
  {
    title: "Get started",
    items: [
      { title: "Introduction", href: "/docs/getting-started" },
      { title: "Quickstart", href: "/docs/getting-started/quickstart" },
      { title: "Installation", href: "/docs/getting-started/installation" },
      { title: "Authentication", href: "/docs/getting-started/authentication" },
      { title: "Glossary", href: "/docs/getting-started/glossary" },
      { title: "Sandbox & testing", href: "/docs/getting-started/testing" },
      { title: "Versioning policy", href: "/docs/getting-started/versioning" },
    ],
  },
  {
    title: "Concepts",
    items: [
      { title: "Architecture", href: "/docs/concepts/architecture" },
      { title: "Projects", href: "/docs/concepts/projects" },
      { title: "Environments", href: "/docs/concepts/environments" },
      { title: "Permissions", href: "/docs/concepts/permissions" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Build your first integration", href: "/docs/guides/first-integration" },
      { title: "Authentication", href: "/docs/guides/authentication" },
      { title: "Webhooks", href: "/docs/guides/webhooks" },
      { title: "Error handling", href: "/docs/guides/error-handling" },
      { title: "Production setup", href: "/docs/guides/production-setup" },
      { title: "Migrate v1 → v2", href: "/docs/guides/migrate-v1-v2" },
      { title: "Idempotent requests", href: "/docs/guides/idempotency" },
      { title: "Local development", href: "/docs/guides/local-development" },
      { title: "Load testing", href: "/docs/guides/load-testing" },
      { title: "Observability", href: "/docs/guides/observability" },
      { title: "Terraform & IaC", href: "/docs/guides/terraform" },
    ],
  },
  {
    title: "Security",
    items: [
      { title: "Security overview", href: "/docs/security/overview" },
      { title: "SSO & SAML", href: "/docs/security/sso-saml" },
      { title: "SCIM provisioning", href: "/docs/security/scim" },
      { title: "Audit logs", href: "/docs/security/audit-logs" },
      { title: "IP allowlisting", href: "/docs/security/ip-allowlisting" },
      { title: "Compliance", href: "/docs/security/compliance" },
      { title: "Data retention", href: "/docs/security/data-retention" },
    ],
  },
  {
    title: "API reference",
    items: [
      { title: "Overview", href: "/docs/api" },
      { title: "Authentication", href: "/docs/api/authentication" },
      {
        title: "Projects",
        href: "/docs/api/projects",
        children: [
          { title: "List projects", href: "/docs/api/projects/list", method: "GET" },
          { title: "Create a project", href: "/docs/api/projects/create", method: "POST" },
          { title: "Get a project", href: "/docs/api/projects/get", method: "GET" },
          { title: "Update a project", href: "/docs/api/projects/update", method: "PATCH" },
          { title: "Delete a project", href: "/docs/api/projects/delete", method: "DELETE" },
        ],
      },
      { title: "Users", href: "/docs/api/users" },
      { title: "Webhooks", href: "/docs/api/webhooks" },
      { title: "Events", href: "/docs/api/events" },
      { title: "Errors", href: "/docs/api/errors" },
      { title: "Rate limits", href: "/docs/api/rate-limits" },
      { title: "Response headers", href: "/docs/api/response-headers" },
      { title: "OpenAPI spec", href: "/docs/api/openapi" },
    ],
  },
  {
    title: "SDKs",
    items: [
      { title: "JavaScript", href: "/docs/sdks/javascript" },
      { title: "Python", href: "/docs/sdks/python" },
      { title: "Go", href: "/docs/sdks/go" },
      { title: "Java", href: "/docs/sdks/java" },
      { title: "Ruby", href: "/docs/sdks/ruby" },
      { title: "CLI", href: "/docs/sdks/cli" },
      { title: "Postman collection", href: "/docs/sdks/postman" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Examples", href: "/docs/resources/examples" },
      { title: "FAQ", href: "/docs/resources/faq" },
      { title: "Troubleshooting", href: "/docs/resources/troubleshooting" },
      { title: "Known issues", href: "/docs/resources/known-issues" },
      { title: "Support", href: "/docs/resources/support" },
      { title: "Changelog", href: "/docs/changelog" },
      { title: "Status", href: "/docs/resources/status" },
      { title: "Style guide", href: "/docs/resources/style-guide" },
    ],
  },
];

const NAV_V1: SidebarNav = [
  {
    title: "Get started",
    items: [
      { title: "Introduction", href: "/docs/v1/getting-started" },
      { title: "Authentication", href: "/docs/v1/getting-started/authentication" },
    ],
  },
  {
    title: "API reference",
    items: [
      { title: "Overview", href: "/docs/v1/api" },
      { title: "Projects", href: "/docs/v1/api/projects" },
      { title: "Errors", href: "/docs/v1/api/errors" },
    ],
  },
];

export function getNavigation(version: string): SidebarNav {
  switch (version) {
    case "v1":
      return NAV_V1;
    default:
      return NAV_V2;
  }
}

export interface FlatNavItem {
  title: string;
  href: string;
  group: string;
}

/** Ordered list of every navigable page, used for prev/next pagination. */
export function flattenNavigation(version: string): FlatNavItem[] {
  const flat: FlatNavItem[] = [];
  for (const group of getNavigation(version)) {
    for (const item of group.items) {
      flat.push({ title: item.title, href: item.href, group: group.title });
      for (const child of item.children ?? []) {
        flat.push({ title: child.title, href: child.href, group: group.title });
      }
    }
  }
  return flat;
}

/** Breadcrumb trail for a given href. */
export function getBreadcrumbs(
  version: string,
  href: string
): { title: string; href?: string }[] {
  const crumbs: { title: string; href?: string }[] = [
    { title: "Docs", href: "/docs" },
  ];
  for (const group of getNavigation(version)) {
    for (const item of group.items) {
      if (item.href === href) {
        crumbs.push({ title: group.title });
        crumbs.push({ title: item.title });
        return crumbs;
      }
      for (const child of item.children ?? []) {
        if (child.href === href) {
          crumbs.push({ title: group.title });
          crumbs.push({ title: item.title, href: item.href });
          crumbs.push({ title: child.title });
          return crumbs;
        }
      }
    }
  }
  crumbs.push({ title: "Page" });
  return crumbs;
}

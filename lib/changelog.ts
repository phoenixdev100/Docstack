export interface ChangelogGroup {
  type: "new" | "improved" | "fixed" | "breaking";
  items: string[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  summary?: string;
  groups: ChangelogGroup[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2.4.0",
    date: "2026-09-08",
    summary: "Project regions, webhook replay, and the Java SDK 1.0 release.",
    groups: [
      {
        type: "new",
        items: [
          "Projects can now be pinned to a region (`us-east`, `eu-west`, `ap-south`) at creation time via the `region` parameter on `POST /projects`.",
          "Webhook deliveries can be replayed from the dashboard or with `POST /webhooks/:id/replay`.",
          "The Java SDK is now generally available as `dev.meridian:meridian-java:1.0.0`.",
        ],
      },
      {
        type: "improved",
        items: [
          "List endpoints now return `has_more` and `next_cursor` consistently across all resources.",
          "Python SDK: `projects.list()` is now an iterator that pages automatically.",
        ],
      },
      {
        type: "fixed",
        items: [
          "Fixed a race where deleting a project could leave orphaned webhook subscriptions for up to 60 seconds.",
          "Go SDK: `client.Projects.Get` no longer panics on a 404 response body.",
        ],
      },
    ],
  },
  {
    version: "v2.3.1",
    date: "2026-08-21",
    summary: "Security update and pagination fix.",
    groups: [
      {
        type: "fixed",
        items: [
          "Rotating an API key now revokes sessions derived from it within 30 seconds instead of 5 minutes.",
          "Fixed `GET /events` returning duplicate entries when `created_after` equalled a record timestamp exactly.",
        ],
      },
      {
        type: "improved",
        items: [
          "Error responses now include a `request_id` field matching the `Meridian-Request-Id` response header.",
        ],
      },
    ],
  },
  {
    version: "v2.3.0",
    date: "2026-07-30",
    summary: "Environments API and SDK retry overhaul.",
    groups: [
      {
        type: "new",
        items: [
          "Introduced the Environments API: `GET/POST /projects/:id/environments` for managing `test` and `live` environments programmatically.",
          "All SDKs now retry idempotent requests on HTTP 429 and 5xx with exponential backoff and jitter (3 attempts by default).",
        ],
      },
      {
        type: "breaking",
        items: [
          "Node.js 16 is no longer supported by `@meridian/sdk`. The minimum is now Node.js 18.17.",
        ],
      },
      {
        type: "improved",
        items: [
          "Rate limit headers (`X-RateLimit-Remaining`, `X-RateLimit-Reset`) are now returned on error responses as well.",
        ],
      },
    ],
  },
  {
    version: "v2.2.0",
    date: "2026-06-12",
    summary: "Webhook signature v2 and expanded event coverage.",
    groups: [
      {
        type: "new",
        items: [
          "Webhook payloads are now signed with `Meridian-Signature: t=…,v1=…` (HMAC-SHA256). The v1 `X-Meridian-Signature` header is deprecated and will be removed in v3.",
          "Added `project.updated`, `project.member.added`, and `webhook.endpoint.disabled` event types.",
        ],
      },
      {
        type: "fixed",
        items: [
          "Fixed webhook deliveries silently dropping payloads larger than 256 KB.",
        ],
      },
    ],
  },
  {
    version: "v2.1.0",
    date: "2026-04-18",
    summary: "Cursor-based pagination replaces offset pagination.",
    groups: [
      {
        type: "breaking",
        items: [
          "Offset pagination (`page`, `per_page`) has been removed from all list endpoints. Use cursor pagination (`cursor`, `limit`) instead.",
          "The `total` field was removed from list responses; use `has_more`.",
        ],
      },
      {
        type: "new",
        items: [
          "All list endpoints accept `limit` (1–100, default 25) and return `next_cursor` for the following page.",
        ],
      },
    ],
  },
];

<div align="center">

<img src="public/logo.png" alt="Docstack logo" width="140" />

# Docstack

**An enterprise-grade documentation site template**<br/>
Ship beautiful, lightning-fast product docs in minutes — versioned MDX content,<br/>
full-text search, API reference layouts, dual-theme code highlighting,<br/>
and SEO baked in. No external services, no backend — just Markdown.

Next.js 15 App Router · React 19 · MDX · TypeScript · Shiki · next-themes

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)

</div>

> Meridian Platform is the included sample content. Swap in your own MDX and rebrand in minutes — see [Customization](#customization).

<div align="center">

## Features

</div>

- **Versioned documentation** — multiple doc versions side by side (`/docs/...` for current, `/docs/v1/...` for legacy)
- **MDX content model** — pages are plain `.mdx` files with YAML frontmatter; drafts, deprecation banners, badges, and reading-time built in
- **Rich component library** — callouts, cards, tabs, code blocks with Shiki dual-theme highlighting, parameter tables, API endpoints, file trees, accordions, and more
- **Full-text search** — client-side search over a generated index (`Ctrl+K` / `Cmd+K`), zero external services
- **Static by default** — every doc page is prerendered at build time; pages serve in single-digit milliseconds
- **SEO complete** — sitemap, robots.txt, RSS feed (`/feed.xml`), OpenGraph images, JSON-LD, canonical URLs
- **Raw markdown endpoints** — `/raw/<path>` serves the source MDX for any page (LLM/agent friendly)
- **Docs UX** — sidebar with persisted collapse state, breadcrumbs, auto-generated TOC with scrollspy, prev/next pagination, keyboard shortcuts, mobile nav
- **Dark mode** — `next-themes` with dual-theme code highlighting

<div align="center">

## Quickstart

</div>

```bash
npm install
npm run dev        # Turbopack dev server on :3000
```

Production:

```bash
npm run build      # prerenders all pages
npm start          # serve the static build
```

Other scripts:

```bash
npm run typecheck  # tsc --noEmit
```

<div align="center">

## Authoring docs

</div>

1. Add `content/docs/v2/<section>/<page>.mdx`:

   ```mdx
   ---
   title: My page
   description: One-line summary for SEO and search.
   updatedAt: 2026-09-28
   badge: beta            # optional
   deprecated: true       # optional — renders a warning banner
   draft: true            # optional — excluded from builds
   ---

   ## Content here
   ```

2. Register the page in `lib/navigation.ts` (`NAV_V2`) so it appears in the sidebar, breadcrumbs, and prev/next.

3. Code fences get titles, line highlighting, line numbers, and tabs:

   ````
   ```ts title="client.ts" {2,4-5} lineNumbers
   const x = 1;
   ```
   ````

<div align="center">

### Adding a version

</div>

Create `content/docs/v3/`, add `{ id: "v3", label: "v3" }` to `VERSIONS` in `lib/navigation.ts`, and add a `NAV_V3` tree. Routes appear automatically via `generateStaticParams`.

<div align="center">

## Customization

</div>

| What | Where |
|---|---|
| Site name, URLs, announcement banner | `lib/site.ts` |
| Sidebar trees & version registry | `lib/navigation.ts` |
| Theme tokens (light/dark) | `app/globals.css` |
| MDX component map | `lib/mdx-components.tsx` |
| Code block behavior | `lib/mdx/remark-code-blocks.ts`, `components/code-block.tsx` |

<div align="center">

## Deployment

</div>

Any Node.js host works — the app uses dynamic route handlers (`feed.xml`, `status.json`), so it is **not** a static-export site.

- **Node**: `npm run build && npm start`
- **Docker**: `docker build -t docstack . && docker run -p 3000:3000 docstack` (standalone output is preconfigured)
- **Vercel/Netlify**: zero-config; push and deploy

---

<div align="center">

Made with ❤️ by [Deepak](https://github.com/phoenixdev100)

</div>
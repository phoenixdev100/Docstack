# Contributing

Thanks for helping improve Docstack.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

## Before you open a PR

```bash
npm run typecheck  # must pass
npm run build      # must succeed - CI runs this too
```

## Conventions

- **Content** lives in `content/docs/<version>/` as `.mdx` - frontmatter schema is documented in the README.
- **Navigation** is explicit: new pages must be registered in `lib/navigation.ts`.
- **Components** in `components/` are server components by default; add `"use client"` only when interactivity requires it.
- **Style**: TypeScript, no new runtime dependencies without discussion in an issue first.
- Keep changes scoped; refactor PRs separate from feature PRs.

## Reporting issues

Use the issue templates - include Next.js version (`npm ls next`), Node version, and reproduction steps.

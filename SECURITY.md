# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| latest (`main`) | ✅ |
| older releases | ❌ |

This is a template - security fixes land on `main`; consumers are expected to update their fork.

## Reporting a vulnerability

Do **not** open a public issue. Use GitHub's [private vulnerability reporting](../../security/advisories/new) instead. Include a description, reproduction steps, and affected versions. You'll get an acknowledgment within a few days.

## Accepted risks

None currently. Frontmatter is parsed by a minimal internal parser (`lib/frontmatter.ts`) using the `yaml` package — chosen over `gray-matter` specifically to avoid its vulnerable `js-yaml@3` → `sprintf-js` dependency chain.

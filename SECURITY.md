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

This project uses `gray-matter` to parse MDX frontmatter from trusted content files. A transitive dependency (`sprintf-js`) has a moderate-severity DoS vulnerability (GHSA-hp3w-g68c-fv3c) that only affects untrusted YAML input. Since content is controlled by docs authors (not arbitrary users), this risk is accepted. Future versions of `gray-matter` may resolve this via dependency updates.

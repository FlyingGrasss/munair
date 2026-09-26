---
name: nextjs-feature
description: Plan, implement, or review a Next.js feature using the APIs and conventions of the version installed in the target project. Use for pages, layouts, route handlers, server actions, rendering boundaries, metadata, and framework data fetching.
---

# Next.js Feature Workflow

Use this workflow whenever a task depends on Next.js behavior.

## 1. Establish the Actual Version

- Inspect `package.json`, the pnpm lockfile, and existing app structure.
- Locate the relevant documents under `node_modules/next/dist/docs/`.
- Search those local documents for every framework API or convention the change depends on.
- Read deprecation or migration notes before editing code.
- If dependencies are not installed, state that local docs cannot yet be inspected. Do not invent a path or silently fall back to old conventions.

## 2. Map the Existing Feature

- Find the route, layout, loading boundary, error boundary, data access module, and nearby tests.
- Inspect `proxy.ts` and any legacy `middleware.ts`, including matcher exclusions and implicit bypasses for assets, metadata files, route handlers, rewrites, and alternate hosts. Verify that authentication, tenant resolution, localization, and headers still apply to every intended route.
- Identify established naming, response, validation, and component patterns.
- Determine whether the feature is static, request-specific, user-specific, or mutation-driven.
- Classify every cached payload as public, tenant-scoped, user-scoped, or viewer-specific. Do not place authorization decisions, secrets, or sensitive personal data in persistent or shared caches.
- Enumerate every mutation that can make each cached result stale, including create, update, delete, publish, unpublish, rename, ownership or membership changes, and external callbacks.

## 3. Design Boundaries

- Default to Server Components.
- Place `"use client"` at the smallest boundary that requires state, effects, browser APIs, or client-only packages.
- Keep database, Redis, credentials, privileged SDKs, and authorization in server-only modules.
- Validate untrusted input at the first trusted boundary.
- Keep domain logic independent from request/response objects where practical.
- Start independent asynchronous work concurrently and avoid nested request waterfalls.

Before implementing, be able to explain:

1. Where data is fetched.
2. Why each Client Component must be client-side.
3. Which cache owns each result and how it becomes stale.
4. Where authentication, authorization, and validation occur.
5. What users see during loading, empty, error, and success states.
6. Which route mutations invalidate data, metadata, redirects, sitemap entries, and any tagged or path cache.

## 4. Map Metadata and Discoverability

Create a route inventory before changing metadata. Classify each route as:

- public and indexable
- public but intentionally `noindex`
- private or tenant-restricted
- dynamic content whose metadata depends on stored state
- terminal or utility routes such as sign-in callbacks, error states, previews, and completion pages

For each route, decide its title/description source, canonical URL, robots policy, sitemap inclusion, structured data, social image, and invalidation triggers.

- Keep the canonical URL, browser-visible actual route, redirects, and sitemap URL in agreement. Do not canonicalize a route to a URL users cannot actually reach as that content.
- Account for custom domains and host-based tenancy when constructing absolute URLs. Never let an untrusted request host define a canonical origin without validation.
- Exclude private, preview, terminal, and other non-search destinations from indexing as appropriate; use authentication as the security boundary, not `noindex` or `robots.txt`.
- Include only canonical, indexable URLs in sitemaps and use a true content modification timestamp for `lastModified`, not the request/build time.
- Serialize JSON-LD with a script-safe serializer that prevents `</script` breakouts and escapes characters that can change HTML parsing. Do not concatenate untrusted JSON into script markup.
- Treat publish, unpublish, rename/slug changes, canonical changes, custom-domain changes, and revision restoration as metadata mutations. Invalidate affected pages, redirects, sitemap output, feeds, and structured-data caches together.

## 5. Implement Against Local Documentation

- Use the exact signatures and file conventions from the installed documentation.
- Before reading or buffering a request body, verify the installed Next.js and deployment-runtime documentation for body-size, streaming, timeout, and memory limits. Enforce an application limit and reject oversized payloads early; do not assume Node and Edge runtimes behave alike.
- Prefer existing project utilities over introducing wrappers.
- Keep framework-specific code thin around domain operations.
- Add or update `loading`, error, and not-found behavior only where the route needs it.
- Avoid suppressing dynamic/static rendering issues; choose the behavior intentionally.

## 6. Verify

- Run the most targeted relevant test.
- For TypeScript changes, prefer `pnpm exec tsc --noEmit` when no narrower check exists.
- Do not run a production build unless requested or genuinely needed to verify framework compilation.
- Summarize the local docs consulted and any version-sensitive decision in the final response.

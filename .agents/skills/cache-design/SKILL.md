---
name: cache-design
description: Design, implement, or review caching across Next.js, TanStack Query, browser persistence, and Upstash Redis. Use when adding data fetching, persistence, revalidation, invalidation, optimistic updates, or cache-backed loading UX.
---

# Cache Design Workflow

Caching is a correctness decision, not just a speed optimization. Do not implement a cache until identity, ownership, expiry, and invalidation are explicit.

## 1. Classify the Data and Prove Key Invariance

Record the owner, sensitivity, source of truth, size, read/write pattern, tolerated staleness, invalidation events, and outage behavior.

Give each cache key exactly one owning module, versioned payload schema, and TTL. Before sharing a value, audit every result-changing input: route and query parameters, filters, sorting, pagination, locale, timezone, tenant, feature flags, data version, and actor-dependent visibility. Each input must be encoded in the key or proven irrelevant.

Prefer an actor-independent canonical payload plus a per-request viewer overlay for fields such as `canEdit`, relationship state, or other viewer-specific presentation. Compute authorization from current request and source-of-truth data; do not reuse cached authorization decisions. Never place decrypted sensitive PII in shared Redis, even under an actor-scoped key.

## 2. Choose One Primary Cache per Layer

### TanStack Query

Use for interactive server state that needs deduplication, refetching, mutation coordination, or optimistic updates.

- Define the provider scope deliberately; do not accidentally share one client across users, tenants, requests, or server renders.
- Include every result-changing input in typed query-key builders.
- Set `staleTime`, `gcTime`, retry policy, focus/reconnect refetching, and prior-data behavior intentionally for each query class.
- Integrate query and mutation errors with the application's error UI instead of silently swallowing them.
- Cancel or reconcile in-flight requests, roll back failed optimistic mutations, and invalidate affected keys on settlement.
- On logout or account/tenant switch, cancel active work and remove or replace actor-scoped cache state before rendering the new identity.

### Browser Persistence

Persist only when reload/offline value justifies privacy and staleness risk.

- Store a schema-validated envelope such as `{ version, expiresAt, ownerId?, data }`; reject malformed, expired, unsupported, or wrong-owner entries.
- Remove only application-owned keys. Never call `localStorage.clear()` or `sessionStorage.clear()`.
- Gate form-draft persistence by field sensitivity. Keep secrets, credentials, health/financial details, and similarly sensitive drafts out of browser storage; offer an authenticated server-side draft when persistence is required.
- Treat auth hints as display-only. Keep them minimal, owner-checked, and short-lived; never persist email, role, permission, token, or session data as a hint.
- Avoid persisting large responses merely because storage exists.

### Upstash Redis

Use for shared serverless state, expensive reusable results, rate limiting, or coordination.

- Centralize typed key builders with a shape such as `<app>:<env>:<resource>:<version>:<scope>:<id>` and prevent cross-tenant collisions.
- Keep key construction and payload decoding in the owning module; validate the versioned schema on reads.
- Set explicit TTLs, consider stampede control, and define fail-open, fail-closed, or source fallback behavior.
- Express mutation-to-key/tag invalidation as pure, testable plans, then execute those plans only after a successful mutation.

### Next.js Framework Cache

Read `node_modules/next/dist/docs/` for the installed version before selecting directives or APIs. Document how rendering, request data, tags/keys, TTLs, and mutation invalidation interact in that version.

## 3. Design the Loading Experience

1. Render a stable shell immediately.
2. Render safe cached data when available and revalidate in the background.
3. Show a subtle refreshing state only when it clarifies freshness.
4. Use a dimension-matched skeleton only when there is no usable data.
5. Preserve prior results during pagination or filter transitions when less disruptive.

A skeleton represents missing content; it should not replace usable cached content.

## 4. Verify Correctness

Test or reason through:

- cold miss, warm hit, stale hit, expiry, and revalidation
- every audited input changing independently without key collisions
- canonical payload reuse with different viewer overlays and no cross-actor leaks
- mutation success/failure and the exact pure invalidation plan produced
- logout and account/tenant switch with in-flight requests
- Redis outage, malformed payload, and duplicate concurrent misses
- persisted envelope corruption, expiry, schema upgrade, and wrong `ownerId`
- key-level cleanup preserving unrelated browser storage
- sensitive draft rejection and the server-side alternative
- retry, focus/reconnect, prior-data, and error-UI behavior

Report ownership, key shapes, schemas, TTLs, invalidation triggers, privacy classification, provider scope, and failure behavior.

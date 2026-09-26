# Project Rules

## Instruction Priority

Follow this file together with the repository's more specific instructions. When rules conflict, prefer the instruction closest to the code being changed. Do not silently ignore a conflict; state the tradeoff.

## Verify the Installed Stack First

This is not necessarily the Next.js, React, Tailwind CSS, or Prisma version you remember.

Before changing framework-dependent code:

1. Inspect `package.json` and the lockfile to identify installed versions.
2. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code.
3. Search those local docs for the exact API or convention being changed.
4. Heed deprecation and migration notices.
5. Inspect existing project patterns before introducing a new one.

Do not rely on remembered Next.js APIs when local documentation is available.

## Plan Before Implementation

- Load the `delivery-planning` skill for new projects, features, cross-cutting work, or unclear boundaries.
- Keep planning proportional: micro fixes need only stated intent; local changes need a short file/behavior/validation list; cross-cutting and high-risk work need explicit boundaries, failure states, tests, rollout, and rollback.
- Treat authentication, schema changes, sensitive caching, public APIs, external effects, deployment, cost, and destructive operations as high-risk planning triggers.
- Do not create ceremonial plans that merely restate the request.

## Package Manager

Use `pnpm` exclusively. Never use `npm`, `yarn`, or their lockfiles.

- Install dependencies: `pnpm install`
- Run scripts: `pnpm <script>`
- Add a runtime package: `pnpm add <package>`
- Add a development package: `pnpm add -D <package>`
- Run a package binary: `pnpm exec <binary>`
- Prisma generate: `pnpm prisma generate`
- Prisma migration: `pnpm prisma migrate dev --name <description>`
- Prisma reset: `pnpm prisma migrate reset`

## Application Architecture

- Prefer Server Components for server-owned data and non-interactive rendering.
- Add `"use client"` only at the smallest interactive boundary that needs browser APIs, state, effects, or client-only libraries.
- Keep secrets, database access, Redis access, authorization, and trusted validation in server-only modules.
- Validate all external input at the boundary, including route handlers, server actions, forms, webhooks, and environment configuration.
- Reject unsupported content types and known oversized requests before parsing where possible; post-parse size checks do not prevent request buffering.
- Keep domain logic separate from transport concerns so it can be tested without Next.js request objects.
- Use route handlers or server actions according to the installed Next.js guidance and the interaction's needs; do not select one by habit.
- Avoid accidental request waterfalls. Start independent work concurrently and stream boundaries when supported by the installed framework.

## Database and ORM: Prisma v7 with Supabase PostgreSQL

- PostgreSQL is hosted on Supabase in the Frankfurt region unless the project explicitly states otherwise.
- Connection configuration for Prisma CLI operations belongs in `prisma.config.ts`, not in `schema.prisma`.
- `prisma.config.ts` must use `DIRECT_URL`, which points to the direct database connection on port `5432`, for migrations and other CLI work.
- Application runtime configuration belongs in a separate server-only module such as `lib/db.ts` or `lib/prisma.ts`.
- The runtime must create a standard `pg` `Pool` using `DATABASE_URL`, which points to the transaction pooler on port `6543`, and inject it into Prisma through `@prisma/adapter-pg`.
- Never move runtime pool configuration into `prisma.config.ts`.
- Reuse the runtime client/pool within an application instance to avoid exhausting connections during development reloads and serverless execution.
- Never expose database URLs or privileged Supabase credentials to client bundles.
- Use migrations for schema changes. Do not edit an already-applied migration unless the project is explicitly repairing migration history.
- Do not hardcode generated identifiers in data migrations.
- Back concurrency and harmful-duplicate protection with database constraints or atomic conditional writes; preflight existence checks alone are insufficient.
- Coordinate non-transactional effects such as blobs, email, queues, and cache invalidation through an outbox or explicit compensation and retry policy.

## Data Fetching and Caching

Caching is expected, but every cache must have a documented owner, data classification, TTL, and invalidation path.

### Client

- Use TanStack Query when server state benefits from deduplication, background refetching, mutations, or optimistic updates.
- Treat query keys as part of the data model: include every parameter, tenant, locale, and user scope that changes the result.
- Use browser persistence only for non-sensitive data that is safe to retain on the device. Persisted payloads need a schema version, expiry, failure-safe parser, and owner/account scope where applicable.
- Never persist access tokens, secrets, authorization results, sensitive personal data, cross-user cache entries, or form drafts containing identity, health, contact, financial, or credential data.
- Never call `localStorage.clear()` or `sessionStorage.clear()`; remove only application-owned, namespaced keys.
- Treat browser-stored auth/profile hints as display-only. Keep them minimal, owner-checked, short-lived, and never use them for routing or authorization.
- Do not create a second client cache for data already owned effectively by the server-rendered route unless the interaction needs it.

### Server

- Use Upstash Redis for shared caching, rate limiting, coordination, or expensive derived results that must survive across serverless instances.
- Namespace keys by application, environment, resource, version, and tenant/user scope where applicable.
- Give each shared key one owning module, one versioned payload schema, and one TTL policy.
- Include every payload-changing input in the key. For viewer-decorated responses, prefer caching an actor-independent projection and derive viewer state after retrieval.
- Never place decrypted sensitive personal data in a shared cache merely because authorization occurs before the cache read.
- Set a TTL unless permanence is a deliberate requirement. Centralize mutation-to-invalidation mapping and test it, especially for indefinite caches.
- Prevent cache stampedes for expensive work through locking, stale-while-revalidate behavior, or request coalescing where justified.
- Never cache an authorization decision beyond the conditions that make it valid.
- Read the installed Next.js caching documentation before using framework cache directives or APIs; their semantics are version-dependent.

### Loading Experience

- Render an immediate, stable page shell.
- If safe cached data exists, render it immediately and revalidate in the background with a subtle freshness indicator when useful.
- If no usable cached data exists, show a layout-matched skeleton that preserves the final dimensions and avoids layout shift.
- Do not obscure usable cached content with a skeleton, and do not use spinner-only blank screens for page-level loading.
- Keep the normal pointer cursor while work is pending; never use `cursor-wait`.

## Rate Limiting and Abuse Controls

- Rate-limit public and mutation endpoints by default. Explicitly decide whether read-only authenticated endpoints need limits.
- Prefer a stable authenticated actor identifier; otherwise use a privacy-conscious network fingerprint only when the deployment's trusted-proxy behavior is understood.
- Include application, environment, endpoint class, and actor scope in limiter keys; never collapse unidentified callers into one shared fallback identity.
- Make counter creation/increment and expiry atomic according to the chosen limiter implementation.
- Choose limits based on operation cost and abuse impact rather than one global number.
- Return a useful `429` response and `Retry-After` metadata where appropriate.
- Decide and document fail-open versus fail-closed behavior for Redis outages per endpoint.
- Keep Upstash credentials server-only.

## Administration Authentication

- Select exactly one administration mode: full per-user Auth.js/Prisma accounts or a constrained password-only single operator.
- Use full authentication when multiple people, attribution, roles, recovery, MFA, or individual revocation are required.
- Password-only administration must use a memory-hard hash, distributed login limiting, short-lived signed HttpOnly session, exact-origin and CSRF checks, and explicit limitations; never compare a plaintext environment password.
- Load the `auth-admin` skill and use recipes as version-reviewed references, not blind copy sources.

## UI and Design System

- Use the repository-owned `minimal-white` design system and registry components by default; agents must not invent a replacement visual language per feature.
- Use native HTML for simple controls, Base UI for complex accessible behavior, and Tailwind for project-owned styling.
- Do not apply default shadcn or DaisyUI visual styling alongside this system. DaisyUI may be selected only as a separate rapid-prototyping mode for a project that deliberately opts out of the default design foundation.
- Follow the concrete token, geometry, composition, and prohibited-pattern rules in `.agents/web-framework/design-system.md`.
- Centralize design tokens rather than scattering arbitrary colors and dimensions.
- Reuse existing components and variants before adding near-duplicates.
- Ensure keyboard access, visible focus, semantic labels, adequate contrast, and reduced-motion behavior.
- Every form control needs a programmatically associated label; connect help/errors with `aria-describedby`, expose `aria-invalid`, and focus an error summary or first invalid field after failed submission.
- Never nest interactive controls, such as a button inside a link.
- Use labelled navigation landmarks and `aria-current="page"`. Closed drawers and menus must not leave invisible controls in the tab order.
- Decorative motion must be hidden from assistive technology and respect `prefers-reduced-motion`. Do not globally hide scrollbars.
- Use `react-hot-toast` for brief non-blocking feedback when it is already part of the stack. Do not use a toast for decisions that require explicit acknowledgement.

## Modals, Editing, and Destructive Actions

- Never use browser-native dialogs such as `alert`, `confirm`, or `prompt`.
- Destructive actions must use an accessible in-app confirmation modal with a clear cancel action, explicit target, and descriptive destructive label.
- Edit small and medium existing entries in an in-place modal. Complex multi-pane editors, page builders, and long workflows may use a dedicated route when that is more accessible.
- Dedicated editors must protect unsaved work and distinguish local, saved-draft, and published state.
- Trap focus while a modal is open, restore focus when it closes, support Escape where safe, make the background inert, and prevent accidental duplicate submission.

## Analytics and Observability

- Define the product question and typed event contract before adding analytics.
- Keep aggregate analytics, product events, operational observability, and durable audit history separate.
- Never send secrets, authorization state, raw URLs/query strings, free-form form data, or unnecessary personal data to telemetry providers.
- Provider integrations are inert when unconfigured. Autocapture, person profiles, tracing, profiling, and session replay are opt-in with explicit privacy, consent, sampling, retention, and cost decisions.
- Use one-line structured server logs, opaque request IDs, source-side redaction, and stable public error codes by default.
- Choose one global trace owner; do not initialize competing Sentry and OpenTelemetry providers accidentally.
- Load `analytics-design` or `observability-design` for implementation details.

## Metadata and Discoverability

- Inventory public, private, dynamic, and terminal routes before changing metadata, robots, or sitemap behavior.
- Private, administrative, account, editor, and transactional-success routes must be explicitly `noindex` where appropriate; this does not replace authorization.
- Canonical URLs, navigation paths, sitemap entries, and actual route directories must agree, including custom-domain variants.
- Serialize JSON-LD through a centralized script-safe helper.
- Publishing, unpublishing, and slug changes must invalidate both rendered content and metadata caches.
- Use real resource update times for sitemap `lastModified`; do not manufacture freshness with the current time.

## Text Encoding and Turkish UI Copy

- Preserve files as UTF-8.
- Turkish UI text must use real Turkish characters: `ç`, `ğ`, `ı`, `İ`, `ö`, `ş`, and `ü`.
- Never commit mojibake, replacement characters, or ASCII approximations of Turkish copy.
- Keep each surface's UI language consistent; do not introduce generic English labels such as `Search`, `Close`, or `Error` into a Turkish interface.

## Security and Privacy

- Authenticate and authorize independently; authentication alone never proves access to a resource.
- Proxy, middleware, layout, and page guards do not authorize APIs or server actions. Every mutation must enforce current active-user status and exact resource authorization at its own boundary.
- Scope every user-owned query by the authorized actor or tenant at the database boundary.
- Return stable public errors and retain diagnostic detail only in server logs. Never expose raw caught exception, database, or provider messages.
- Do not log secrets, full credentials, session tokens, or unnecessary personal data.
- Back idempotency with a database uniqueness constraint or atomic state transition when duplicate execution would be harmful; treat initiation and callback/delivery as separate replay boundaries.
- Do not emit email, billing, storage, or real-time effects after a no-op write unless those effects have their own idempotency control.
- Keep environment-specific URLs and credentials in validated environment variables.

## Verification Discipline

Keep verification proportional to the change.

- Prefer a targeted test or `pnpm exec tsc --noEmit` for routine TypeScript work.
- Run lint only when configured and relevant.
- Do not run `pnpm build` for routine checks unless explicitly requested or a production build is genuinely needed.
- Do not use browser automation for routine visual verification unless explicitly requested; the user will manually inspect UI work.
- Fix issues caused by the current change. Report unrelated existing failures without broadening scope.

## Git

Do not run Git commands unless the user explicitly asks. The user manages commits, pushes, and deploy-triggering changes through GitHub Desktop.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

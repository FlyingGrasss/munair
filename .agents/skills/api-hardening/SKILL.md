---
name: api-hardening
description: Secure and harden Next.js route handlers, server actions, webhooks, and mutations with validation, authorization, Upstash rate limiting, idempotency, safe errors, and abuse-aware logging.
---

# API Hardening Workflow

Use this skill for any externally reachable endpoint or server mutation.

## 1. Trace the Trust Boundary

Identify the caller and authentication mechanism, accepted content type and schema, resource owner or tenant, side effects and cost, duplicate-execution impact, public error contract, and deployment proxy behavior. Treat headers, cookies, route parameters, query strings, form fields, and JSON bodies as untrusted.

Proxy, middleware, layout, and page guards improve routing UX; they do not authorize route handlers or server actions. Inspect matcher exclusions and alternate entry points, then authenticate and enforce active/not-banned account state plus exact resource/action ownership at every mutation boundary. Resolve the session once per request where practical and pass a trusted actor context instead of repeating expensive or inconsistent lookups.

## 2. Apply Controls in a Deliberate Order

A typical order is:

1. Reject unsupported methods/content types and oversized requests.
2. Authenticate when required and establish one actor context.
3. Apply a cheap abuse limit.
4. Parse and schema-validate input.
5. Authorize active account, tenant, resource, and action.
6. Atomically claim idempotency or replay protection when needed.
7. Execute domain work and durable side-effect coordination.
8. Invalidate affected caches.
9. Return a minimal, stable response.

Change the order only when the threat model or operation cost justifies it.

## 3. Rate Limit Robustly

- Namespace keys by app, environment, endpoint class, actor type, and stable actor identifier.
- Use an atomic limiter operation that couples increment and expiry; avoid counters that can become permanent after a partial failure.
- Prefer an authenticated actor ID. For anonymous traffic, document the trusted proxy chain and exact header used before deriving network identity.
- Never collapse missing or untrusted identity into one shared anonymous fallback key; reject, derive a trustworthy bounded identity, or use a deliberately global limit.
- Set limits from cost and abuse potential, including burst and sustained limits where useful.
- Return `429` with an accurate `Retry-After` value and a stable public error.
- Define and test fail-open/fail-closed behavior for limiter timeouts, malformed responses, and outages.
- Keep limiter URLs and tokens server-only.

Rate limiting supplements authentication and authorization; it replaces neither.

## 4. Make Side Effects Idempotent

Model retries as `received -> validated -> atomically claimed -> applied -> completed`.

- Require a unique idempotency/event ID in the correct actor and operation scope, enforced by a database constraint or compare-and-set claim.
- Separate initiation idempotency from asynchronous delivery/webhook idempotency; they have different identifiers and retry semantics.
- Define duplicate behavior for in-progress, completed-equivalent, payload-mismatch, failed-retryable, and failed-terminal states.
- Store a payload fingerprint and stable completed response when safe so one key cannot represent different work.
- Coordinate database writes atomically. For external email, blob, cache, or queue effects, use a transactional outbox or explicit compensation and recovery path.
- Bound pagination, filters, uploads, and computational work; scope writes by the authorized actor/tenant in the query itself.

## 5. Verify Webhooks Before Processing

- Enforce request/body limits before buffering where the runtime permits.
- Verify the provider signature and timestamp against the untouched raw body using current provider documentation.
- Only after signature verification, parse and schema-validate the payload.
- Atomically record a provider-scoped unique event ID before applying effects; define duplicate acknowledgement behavior.

## 6. Keep Errors and Logs Safe

- Return only a stable public shape such as `{ code, message }`; never expose stack traces, database details, or a raw caught `error.message`.
- Log sanitized server-side context, state transitions, and a request/correlation ID without credentials, tokens, full cookies, webhook secrets, or unnecessary personal data.
- Distinguish validation, authentication, authorization, conflict, rate-limit, dependency, and internal failures while avoiding resource-existence leaks.

## 7. Verify with a Route-Hardening Matrix

For every route or server action, cover applicable combinations of:

- success; unsupported method/content type; malformed and oversized body
- missing, expired, banned, or inactive identity; matcher bypass; wrong tenant/resource owner
- rate-limit allowed/exhausted plus limiter timeout, malformed response, and outage policy
- new idempotency key; concurrent duplicate; completed replay; same key with changed payload; retry after partial failure
- webhook bad signature, stale timestamp, invalid post-signature schema, duplicate event, and oversized raw body
- database conflict, external-side-effect failure, outbox/compensation recovery, and cache invalidation failure
- stable status and `{ code, message }` response with no sensitive logs or raw internal messages

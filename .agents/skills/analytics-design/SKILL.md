---
name: analytics-design
description: Design or implement privacy-aware web and product analytics with typed event contracts, consent, identity lifecycle, URL sanitation, provider boundaries, and retry-safe server events. Use for Vercel Analytics, Speed Insights, PostHog, funnels, conversion events, and session replay decisions.
---

# Analytics Design Workflow

Analytics explains user and product behavior. It is not error monitoring, structured logging, or an audit trail.

## 1. Define the Question First

Do not add tracking without a decision it will support. For each event, record its owner, purpose, source, consent category, expected cardinality, retention, and whether it represents intent or a server-confirmed fact.

Use stable lowercase dot-separated names such as `account.signup_completed` or `editor.document_published`. Include an independent event schema version.

## 2. Keep an Allowlisted Contract

- Centralize event names and property schemas.
- Keep properties flat, bounded, and low-cardinality.
- Prefer enums, booleans, counts, durations, integer minor-unit money, and ISO currency.
- Never send names, emails, phones, IPs, tokens, query strings, raw URLs, free-form text, form values, uploaded filenames, or raw errors without a documented exceptional review.
- Emit authoritative completion events server-side after the domain transaction commits.
- Add an event ID when retryable delivery could duplicate an event.

UI components call application event functions, never provider SDKs directly.

## 3. Choose Providers Deliberately

- Vercel Analytics and Speed Insights are the recommended low-friction Vercel profile after URL/privacy review.
- Product analytics such as PostHog is opt-in for funnels, retention, feature usage, and experiments.
- Autocapture, person profiles, session replay, console/network capture, and broad exception capture are off by default.
- Missing provider configuration must disable transmission safely.
- Analytics delivery normally fails open and must not turn a successful domain mutation into a user-visible failure.

## 4. Model Consent and Identity

Use separate categories such as necessary, aggregate analytics, product analytics, and session replay. Do not queue pre-consent events unless policy explicitly permits it. Apply withdrawal promptly. Reset provider identity and actor-scoped analytics state on logout/account switch.

Treat hashing personal identifiers as pseudonymization, not anonymization. Consent tooling supports policy; it does not make legal determinations.

## 5. Verify

Test unknown event/property rejection, property bounds, PII fixtures, pre-consent suppression, opt-in/out, logout reset, server event idempotency, missing-provider behavior, URL sanitation, development traffic separation, and provider failures that do not break the product flow.

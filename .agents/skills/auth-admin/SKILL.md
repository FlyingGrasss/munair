---
name: auth-admin
description: Select, implement, or review administration authentication using either full per-user Auth.js and Prisma accounts or a constrained password-only administrator. Use for admin login, sessions, authorization, account status, logout, CSRF, and protected admin routes.
---

# Admin Authentication Workflow

## 1. Select One Mode

### Full user authentication

Use when the product needs multiple administrators, individual attribution, roles, revocation, recovery, OAuth/OIDC, or future MFA.

Use the `admin-authjs-prisma` recipe as a reference, then verify the exact installed Next.js, Auth.js, Prisma, adapter, and provider documentation. Do not copy version-sensitive setup blindly.

### Password-only administrator

Use only for a deliberately constrained single-operator surface where shared identity and global rotation are acceptable. Use the `admin-password` recipe. Do not model it as a fake user account or claim that it provides per-person attribution, recovery, MFA, or per-session revocation.

Never install both recipes on the same route tree.

## 2. Enforce Shared Invariants

- Authentication, active-account checks, and resource authorization are separate.
- Every Server Action, Route Handler, and data-access mutation protects itself. Layout and proxy redirects are UX only.
- State changes use POST or another appropriate non-GET method.
- Session and authorization data is never placed in persistent/shared caches.
- Cookies and tokens are HttpOnly where browser JavaScript does not need them, securely scoped, expiring, and absent from logs.
- Redirect destinations use a fixed allowlist or safe relative-path parser.
- Public failures do not reveal account existence, provider details, hashes, sessions, or database errors.
- Login and recovery endpoints are rate-limited before expensive work.

## 3. Full-Auth Checks

- Prefer database sessions when prompt revocation is required.
- Load current banned/suspended/deleted status at protected boundaries.
- Revoke sessions when an account is disabled.
- Never let OAuth profile data, client-triggered session updates, or browser storage grant roles.
- Keep session projections minimal.
- Scope mutations by actor/tenant/resource in the database query.
- Record sensitive administrative actions in an application-owned audit log.

## 4. Password-Only Checks

- Store only a versioned memory-hard password hash, never plaintext.
- Generate hashes through an offline operator tool that does not accept secrets in command arguments.
- Verify with asynchronous `scrypt` or a reviewed Argon2id implementation and equal-length `timingSafeEqual` comparison.
- Rate-limit before the KDF using a shared atomic limiter with fail-closed outage behavior.
- Use a short-lived, signed, versioned, HttpOnly, Secure, SameSite=Strict host cookie.
- Require exact configured origin and session-bound CSRF protection for every mutation, including logout.
- Use secret/session-version rotation for global revocation; use server-side sessions if individual revocation becomes necessary.

## 5. Verify

Test valid access plus missing/expired/tampered sessions, banned users, wrong role/tenant/resource, direct endpoint calls that bypass layouts/proxy, rate-limit exhaustion/outage, CSRF/origin failures, safe logout, secret rotation, public error redaction, and absence of secrets in logs/client bundles.

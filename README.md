# MUNAIR’27

The official conference platform for MUNAIR, established at Havajet Aviation High School in Izmir. It includes a scrolling public site, editable committees and team members, five configurable application forms, verified database submissions, CSV export, and a single-operator admin.

## Local development

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env.local` and configure the services you need.
3. Generate the Prisma client with `pnpm prisma generate`.
4. Run `pnpm dev`.

The public site works from built-in defaults without a database. Admin and applications require Supabase PostgreSQL. Applications also require Resend and Upstash Redis and remain disabled by default.

## Data and services

- `DIRECT_URL` is the Supabase direct connection on port 5432 for Prisma CLI work.
- `DATABASE_URL` is the transaction pooler connection on port 6543 for the application runtime.
- Admin login uses a scrypt password hash and revocable 365-day device sessions stored in PostgreSQL.
- Application verification codes are sent through Resend, limited through Upstash, and stored only as hashes.
- Images uploaded from the admin are stored with Vercel Blob.
- Verified applications are stored in PostgreSQL and exported from the dashboard as CSV.

Before enabling applications, publish the reviewed privacy notice and set the confirmed committee choices, dates, and retention policy.

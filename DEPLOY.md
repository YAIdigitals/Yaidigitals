# YAIdigitals — Deploy Guide

## Stack
- Next.js 16 (App Router) + React 19 + Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Vercel (auto-deploys on every push to `master`)

Node.js 20.9 or newer is required.

## Local development
```bash
npm install
npm run dev        # http://localhost:3000
```
Environment variables live in `.env.local` (never committed):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (legacy; canonical URLs are fixed to the production domain in code)

## Production (Vercel)
Project: **yaidigitals** — https://yaidigitals.vercel.app
Framework preset must be **Next.js**, and Deployment Protection should stay off
for the public storefront.

Set the same environment variable names in
Vercel → Settings → Environment Variables (all environments).

Before deployment, run:

```bash
npm ci
npm run lint
npx tsc --noEmit
npm run build
```

After deployment, validate the public site:

```bash
npm run test:seo
```

The validation script crawls the XML sitemap and checks status codes, titles,
descriptions, canonicals, robots directives, H1s, JSON-LD and internal links.

### Canonical domain redirect

The canonical host is `https://www.yaidigitals.co.in/`. The application proxy
permanently redirects HTTPS apex requests to `www`. Because Cloudflare sits in
front of Vercel, configure a Cloudflare Single Redirect for every request whose
host equals `yaidigitals.co.in` directly to the same path and query on
`https://www.yaidigitals.co.in`. Put it ahead of a generic HTTP-to-HTTPS rule so
`http://yaidigitals.co.in/` does not take two hops.

## IndexNow

The public ownership key is served from `/indexnow-key.txt`. It is an IndexNow
verification key, not an application secret. The submission script accepts only
explicit URLs on the canonical host, so it cannot accidentally submit previews
or third-party URLs.

Verify without submitting:

```bash
curl https://www.yaidigitals.co.in/indexnow-key.txt
npm run indexnow -- --dry-run /services/website-development
```

Notify participating search engines only after a meaningful create, update,
redirect or deletion:

```bash
npm run indexnow -- /services/website-development /work/localgo
```

An HTTP `200` or `202` means the notification was received; it does not
guarantee crawling, indexing, ranking or an AI citation. Do not submit the
unchanged sitemap on every request or deployment.

## Database
Schema lives in `supabase/schema.sql` plus `supabase/migrations/`.
Apply new migrations in the Supabase dashboard (SQL editor) — they are not run
automatically. RLS is enabled everywhere; admin rights require
`user_metadata.role == 'admin'` AND an approved row in `public.admin_approvals`
(checked through the `public.is_admin()` helper).

After applying `202608300001_brand_cms.sql`, seed the site content:

```bash
npx tsx scripts/seed-content.ts   # services, projects, industries, technologies, homepage settings
```

Seed content is idempotent and only fills what the admin panel can later edit.

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose to the client)
- `NEXT_PUBLIC_APP_URL` — optional legacy setting. Canonical URLs, sitemap entries
  and JSON-LD are deliberately fixed to `https://www.yaidigitals.co.in` in code so
  a preview or stale CMS setting cannot create duplicate canonical URLs.

## Admin panel
Admins can only reach `/admin` after being approved by a super admin.

1. **Super admin (first account)** — the first `role=admin` account to sign in
   is auto-approved and becomes the super admin. Create your account in Supabase
   Auth (or via `/admin/signup`), then sign in once at `/admin/login`.
2. **Everyone else** signs up at `/admin/signup` → status *pending*.
3. The super admin opens **Admin → Access**, approves or revokes accounts.

Approval lives in the `admin_approvals` table (service-role only, no client
access). RLS policies use `public.is_admin()`, which requires BOTH
`user_metadata.role = 'admin'` AND an approved row — so unapproved or revoked
admins are locked out of the panel AND the database.

## Seed products
```bash
npm run seed
```

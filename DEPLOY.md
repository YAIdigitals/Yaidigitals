# YAIdigitals — Deploy Guide

## Stack
- Next.js 14 (App Router) + Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Vercel (auto-deploys on every push to `master`)

## Local development
```bash
npm install
npm run dev        # http://localhost:3000
```
Environment variables live in `.env.local` (never committed):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## Production (Vercel)
Project: **yaidigitals** — https://yaidigitals.vercel.app
Framework preset must be **Next.js**, and Deployment Protection should stay off
for the public storefront.

Set the same environment variable names in
Vercel → Settings → Environment Variables (all environments).

## Database
Schema lives in `supabase/schema.sql` plus `supabase/migrations/`.
Apply new migrations in the Supabase dashboard (SQL editor) — they are not run
automatically. RLS is enabled everywhere; admin rights require
`user_metadata.role == 'admin'` AND an approved row in `public.admin_approvals`
(checked through the `public.is_admin()` helper).

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

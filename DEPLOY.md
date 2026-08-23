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
RLS is enabled everywhere; admin rights are determined by
`user_metadata.role == 'admin'` (checked through the `public.is_admin()` helper).

## Admin panel
1. Sign up at `/admin/signup`
2. An owner sets your metadata role to `admin` in Supabase Auth
3. Log in at `/admin/login`

## Seed products
```bash
npm run seed
```

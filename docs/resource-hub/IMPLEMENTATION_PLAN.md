# YAIdigitals Resource Hub — Implementation Plan

## 1. Architecture Overview

**Stack**: Next.js 16 (App Router) + React 19 + Supabase + Tailwind CSS 3 + Framer Motion

The Resource Hub extends the existing YAIdigitals codebase — no separate application.

### Route Structure
| Route | Type | Purpose |
|---|---|---|
| `/resources` | Public (SSR) | Resource listing with category filters |
| `/resources/[slug]` | Public (SSR) | Dynamic resource landing page |
| `/resources/category/[category]` | Public (SSR) | Category-filtered listing |
| Admin: `resources` tab | Protected | Resource CRUD, campaigns, analytics, advertising |

Admin routes use the existing tab-based dashboard pattern (`AdminDashboard.tsx`) rather than new page routes, maintaining consistency with the existing architecture.

### Key Modules
1. **Database**: New migration with `resources`, `resource_categories`, `resource_campaigns`, `resource_events`, `advertising_settings` tables
2. **API**: `/api/admin/resources/route.ts`, `/api/resources/events/route.ts`
3. **Admin UI**: `AdminResources.tsx`, `AdminResourceEditor.tsx`, `AdminCampaigns.tsx`, `AdminAdvertising.tsx`, `AdminResourceAnalytics.tsx`
4. **Public UI**: Resource listing page, dynamic resource detail page with Adsterra integration
5. **Adsterra**: Centralized ad component system with iframe isolation
6. **SEO**: Auto-generated metadata, JSON-LD, sitemap entries

## 2. Database Changes

### New Tables
- `resource_categories` — Category definitions
- `resources` — Main resource table with all fields
- `resource_campaigns` — Instagram campaign associations
- `resource_events` — Privacy-conscious analytics events (views, clicks)
- `advertising_settings` — Global and per-resource ad configuration

### Security
- RLS policies using existing `public.is_admin()` function
- Public read access limited to published resources only
- Admin operations verified server-side via existing auth pattern

## 3. File Changes

### New Files
- `supabase/migrations/202610140001_create_resource_hub.sql`
- `src/app/resources/page.tsx`
- `src/app/resources/[slug]/page.tsx`
- `src/app/resources/category/[category]/page.tsx`
- `src/app/api/admin/resources/route.ts`
- `src/app/api/resources/events/route.ts`
- `src/components/admin/AdminResources.tsx`
- `src/components/admin/AdminResourceEditor.tsx`
- `src/components/admin/AdminCampaigns.tsx`
- `src/components/admin/AdminAdvertising.tsx`
- `src/components/admin/AdminResourceAnalytics.tsx`
- `src/components/resources/AdsterraAd.tsx`
- `src/components/resources/ResourceCard.tsx`
- `src/components/resources/DownloadSection.tsx`
- `src/lib/resources.ts`

### Modified Files
- `src/components/AdminDashboard.tsx` — Add Resources tabs
- `src/app/sitemap.ts` — Include published resources
- `src/components/Header.tsx` — Add Resources nav link
- `src/components/Footer.tsx` — Add Resources footer link
- `src/lib/seo.ts` — Add resource JSON-LD helper
- `src/lib/analytics.ts` — Add resource event types

## 4. Risks
- Adsterra scripts use global `atOptions` variable — must isolate via iframes
- Third-party ad scripts from `bicea.org` — verify against publisher dashboard before production
- Instagram DM automation requires external Manychat setup — system generates templates only
- No Google Drive file in workspace — first resource created as draft

## 5. Execution Order
1. Database migration
2. Resource lib and types
3. Admin API routes
4. Admin dashboard integration
5. Resource editor
6. Campaign manager
7. Advertising settings
8. Public resource listing
9. Dynamic resource pages
10. Adsterra ad components
11. Analytics tracking
12. SEO automation
13. Sitemap + navigation updates
14. First draft resource seed
15. Testing and verification

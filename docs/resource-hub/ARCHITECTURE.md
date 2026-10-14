# YAIdigitals Resource Hub — Architecture

## System Overview

The Resource Hub is a fully integrated extension of the existing YAIdigitals Next.js application. It adds resource publishing, Instagram campaign management, Adsterra ad monetization, and analytics tracking — all built on top of the existing Supabase + Vercel infrastructure.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, SSR) |
| UI | React 19, Tailwind CSS 3 |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth + admin_approvals gate |
| File delivery | Google Drive links, External HTTPS URLs, Supabase Storage |
| Ads | Adsterra (iframe-isolated components) |
| Analytics | Custom event table + denormalized counters |
| SEO | Next.js generateMetadata + JSON-LD |
| Deployment | Vercel (existing) |

## Database Schema

```
resource_categories  ←── resources ←── resource_campaigns
                                   ←── resource_events
advertising_settings (singleton)
```

## Route Structure

```
/resources                           # Public listing
/resources/[slug]                    # Public resource detail
/resources/category/[category]       # Category-filtered listing

/admin (tab: resources)              # Resource CRUD
/admin (tab: campaigns)              # Instagram campaigns
/admin (tab: advertising)            # Adsterra settings
/admin (tab: resource-analytics)     # Analytics dashboard

/api/admin/resources                 # Resource CRUD API
/api/admin/resources/categories      # Category CRUD API
/api/admin/resources/campaigns       # Campaign CRUD API
/api/admin/resources/advertising     # Ad settings API
/api/admin/resources/analytics       # Analytics query API
/api/resources/events                # Public event tracking
```

## Component Architecture

```
AdminDashboard.tsx
  ├── AdminResources.tsx          (list + actions)
  │     └── AdminResourceEditor.tsx (create/edit form)
  ├── AdminCampaigns.tsx          (Instagram campaigns)
  ├── AdminAdvertising.tsx        (Adsterra settings)
  └── AdminResourceAnalytics.tsx  (stats dashboard)

/resources/page.tsx               (SSR listing)
/resources/[slug]/page.tsx        (SSR detail)
/resources/category/[...]/page.tsx (SSR category)
  └── ResourceCard.tsx            (listing card)
  └── AdsterraAd.tsx              (ad components)
      ├── AdsterraBanner          (iframe-isolated)
      ├── AdsterraNative          (DOM-injected)
      └── AdBlock                 (placement wrapper)
  └── ResourceTrackers.tsx        (client-side events)
      ├── ResourceViewTracker     (fires view on mount)
      └── DownloadButton          (tracks before navigate)
```

## Ad Isolation Strategy

Each Adsterra banner uses a dedicated `<iframe>` with an isolated document context. The `atOptions` global variable is set on each iframe's `contentWindow`, not the parent `window`, preventing script conflicts when multiple ad units appear on the same page.

## Data Flow

1. Admin creates resource in dashboard → saved to `resources` table
2. Admin publishes → `status = 'published'`, `published_at` set
3. Next.js SSR reads published resources via anon key (RLS-filtered)
4. Visitor loads page → `ResourceViewTracker` fires POST to `/api/resources/events`
5. Database trigger increments `resources.view_count`
6. Visitor clicks download → `DownloadButton` fires event then navigates
7. Analytics API aggregates `resource_events` for admin dashboard

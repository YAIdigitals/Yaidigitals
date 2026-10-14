# YAIdigitals Resource Hub — Analytics Guide

## What Is Tracked

### Events (resource_events table)
Every resource page fires a `view` event on load. Every download button click fires a `download_click` event before navigation.

**Data collected per event:**
- `resource_id` — which resource
- `event_type` — view or download_click
- `referrer` — document.referrer (page the user came from)
- `utm_source`, `utm_medium`, `utm_campaign` — from URL parameters
- `device_type` — mobile/tablet/desktop (from User-Agent header, server-side)
- `created_at` — timestamp

**No PII is collected.** No cookies, no user IDs, no IP addresses.

### Denormalized Counters
The `resources` table has `view_count` and `download_count` columns that are auto-incremented by a database trigger on every event insert. These provide fast dashboard display without querying the events table.

## Admin Analytics Dashboard

### Stats Overview
- **Total Views** — lifetime view_count sum across all published resources
- **Total Downloads** — lifetime download_count sum
- **Period Views** — views in the selected time window (7/30/90 days)
- **Click-Through Rate** — downloads ÷ views for the selected period

### Daily Chart
Bar chart showing views per day for the selected period.

### Top Resources
Leaderboard of resources by view_count showing views and downloads.

### Traffic Sources
Breakdown of `utm_source` values showing which channels drive traffic (instagram, direct, google, etc.).

## Advertising Earnings

The analytics dashboard does NOT show ad revenue. Ad revenue data is only available in the Adsterra publisher dashboard:

**https://publishers.adsterra.com/**

The dashboard shows CPM rates, impressions, clicks, and earnings per day. YAIdigitals does not have API access to pull this data automatically into the admin panel.

## Privacy Compliance

- No cookies are set by the tracking system
- No cross-site tracking
- Events are anonymous (no user identification)
- Device type is derived from the User-Agent header and not stored with any identifier
- Data is stored in your own Supabase instance (no third-party analytics)

## Google Analytics & Meta Pixel

The site has existing Google Analytics and Meta Pixel integrations (managed via the admin SEO panel). Resource views and download clicks can also be tracked in those platforms by adding GA4 events in the `ResourceViewTracker` and `DownloadButton` components if desired.

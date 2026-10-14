# YAIdigitals Resource Hub — Database Guide

## Migration

File: `supabase/migrations/202610140001_create_resource_hub.sql`

**Apply in the Supabase SQL editor.** Never modify applied migrations — append new ones instead.

## Tables

### `resource_categories`

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | Auto-generated |
| name | TEXT UNIQUE | Display name |
| slug | TEXT UNIQUE | URL segment |
| description | TEXT | Optional |
| sort_order | INT | Display ordering |

### `resources`

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| title | TEXT | Required |
| slug | TEXT UNIQUE | URL path |
| summary | TEXT | Short description |
| article | TEXT | Full content |
| category_id | BIGINT FK | → resource_categories |
| tags | JSONB | String array |
| cover_image | TEXT | URL |
| file_type | TEXT | pdf/zip/doc/other |
| file_name | TEXT | Filename for download header |
| file_size | BIGINT | Bytes |
| google_drive_url | TEXT | Validated HTTPS only |
| storage_path | TEXT | Supabase Storage path |
| external_download_url | TEXT | Validated HTTPS only |
| seo_title | TEXT | |
| meta_description | TEXT | |
| og_image | TEXT | |
| featured | BOOLEAN | Default false |
| ads_enabled | BOOLEAN | Default true |
| status | TEXT | draft/published/scheduled/archived |
| published_at | TIMESTAMPTZ | Set on first publish |
| scheduled_at | TIMESTAMPTZ | For scheduled status |
| view_count | BIGINT | Denormalized counter |
| download_count | BIGINT | Denormalized counter |

### `resource_campaigns`

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| name | TEXT | Campaign name |
| resource_id | BIGINT FK | → resources (CASCADE DELETE) |
| reel_id | TEXT | Instagram reel/post ID |
| comment_keyword | TEXT | Trigger keyword (e.g., DOC) |
| landing_url | TEXT | Generated landing page URL |
| utm_source | TEXT | Default: instagram |
| utm_medium | TEXT | Default: dm |
| utm_campaign | TEXT | Campaign slug |
| automation_provider | TEXT | manychat/chatfuel/meta_api/manual |
| automation_status | TEXT | manual/configured/active/paused |
| external_ref | TEXT | Provider-specific ID |
| notes | TEXT | Setup notes |

### `resource_events`

| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| resource_id | BIGINT FK | → resources (CASCADE DELETE) |
| event_type | TEXT | view / download_click |
| referrer | TEXT | Page referrer |
| utm_source | TEXT | |
| utm_medium | TEXT | |
| utm_campaign | TEXT | |
| country_code | TEXT | Future: from headers |
| device_type | TEXT | mobile/tablet/desktop |

**Privacy**: No user PII is stored. Events are anonymous page-context only.

**Trigger**: `trg_increment_resource_counter` auto-increments `view_count` and `download_count` on `resources` after each insert.

### `advertising_settings` (singleton)

| Column | Type | Notes |
|---|---|---|
| provider | TEXT | adsterra |
| global_enabled | BOOLEAN | Master kill-switch |
| native_enabled | BOOLEAN | Native banner |
| banner_300x250_enabled | BOOLEAN | |
| banner_320x50_enabled | BOOLEAN | Mobile banner |
| banner_728x90_enabled | BOOLEAN | Desktop leaderboard |
| website_id | TEXT | Adsterra website ID |
| config | JSONB | Extra provider config |

## RLS Policies

| Table | Public (anon) | Admin |
|---|---|---|
| resource_categories | SELECT all | ALL |
| resources | SELECT where status='published' | ALL |
| resource_campaigns | — | ALL |
| resource_events | INSERT only | SELECT |
| advertising_settings | SELECT all | ALL |

## Indexes

- `idx_resources_slug` — fast slug lookups
- `idx_resources_status` — filter by status
- `idx_resources_category` — category joins
- `idx_resource_campaigns_resource` — campaign joins
- `idx_resource_events_resource` — event queries
- `idx_resource_events_type` — event type filters
- `idx_resource_events_created` — time range queries

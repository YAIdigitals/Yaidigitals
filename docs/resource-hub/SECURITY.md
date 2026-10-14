# YAIdigitals Resource Hub — Security Guide

## Authentication & Authorization

All admin API routes use `requireApprovedAdmin(request)` which:
1. Extracts the Bearer token from the Authorization header
2. Validates it against Supabase Auth (server-side only)
3. Checks the `admin_approvals` table for an approved row
4. Returns `{ ok: false }` if any check fails → API returns 403

**The service-role key is NEVER exposed to the browser.** It exists only in server-side API routes.

## Row Level Security

Every new table has RLS enabled:

| Table | Public Read | Public Write | Admin |
|---|---|---|---|
| resource_categories | All rows | ❌ | All operations |
| resources | Published only | ❌ | All operations |
| resource_campaigns | ❌ | ❌ | All operations |
| resource_events | ❌ | INSERT only | SELECT |
| advertising_settings | All rows | ❌ | All operations |

Unpublished resources (draft/scheduled/archived) are invisible to anonymous users at the database level — even if someone calls the API directly.

## Input Validation

### Google Drive URLs
- Must use `https://` protocol
- Must be from `drive.google.com` or `docs.google.com`
- Validated server-side in the API route before saving

### External Download URLs
- Must use `https://` protocol only
- Validated server-side
- HTTP links are rejected

### Event Tracking
- `event_type` is validated against an allowlist (`view`, `download_click`)
- `resource_id` must be numeric
- Other fields are stored as-is but not executed

## Content Security

- No user-generated HTML is rendered without sanitization
- Article content is split on `\n\n` and rendered as plain `<p>` tags only
- No `dangerouslySetInnerHTML` usage in resource components

## Adsterra Script Security

- Third-party scripts from `bicea.org` run in isolated iframes
- Parent page JavaScript context is not accessible from iframe scripts
- Scripts are loaded only when ads are enabled
- No adult content, popunders, or forced redirects are configured

## File Download Security

- Google Drive links open in a new tab with `rel="noopener noreferrer"`
- Redirect destination is user-visible in the anchor href
- No server-side proxy for downloads — users go directly to the source
- Download tracking records the click, not the completion

## Environment Variables

| Variable | Exposure | Usage |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase client init |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Anon DB access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin operations |

The service-role key bypasses RLS — never expose it to client-side code.

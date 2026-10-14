# YAIdigitals Resource Hub — Deployment Checklist

## Pre-Deployment Steps

### 1. Apply Database Migration
- [ ] Log into Supabase Dashboard → SQL Editor
- [ ] Open `supabase/migrations/202610140001_create_resource_hub.sql`
- [ ] Copy and execute the entire migration
- [ ] Verify: Check that `resources`, `resource_categories`, `resource_campaigns`, `resource_events`, and `advertising_settings` tables exist
- [ ] Verify: Check that RLS is enabled on all tables
- [ ] Verify: Check that `trg_increment_resource_counter` trigger exists

### 2. Seed Initial Data
```bash
npm run seed:resource-hub
```
- [ ] "6 Documents Before Vibe Coding" resource created (status: draft)
- [ ] Instagram campaign with keyword DOC created
- [ ] Advertising settings row initialized (global_enabled: false)

### 3. Code Quality Checks
```bash
npm run lint       # ESLint check
npx tsc --noEmit  # TypeScript check
npm run build     # Production build verification
```
- [ ] No lint errors in new files
- [ ] No TypeScript errors
- [ ] Production build succeeds

### 4. Environment Variables
Verify these are set in Vercel:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### 5. Pre-Production Verification
- [ ] Test `/resources` page loads correctly
- [ ] Test `/resources/category/ai-development` loads correctly
- [ ] Test admin login works
- [ ] Test creating a resource in admin
- [ ] Test resource editor auto-slug generation
- [ ] Test publishing and unpublishing a resource
- [ ] Test that draft resources return 404 on public routes
- [ ] Test Google Drive URL validation (invalid URL is rejected)
- [ ] Test copying DM message from resource editor
- [ ] Test campaign creation with tracking URL generation
- [ ] Test advertising settings save correctly
- [ ] Test analytics page loads (may show no data initially)

### 6. First Resource Setup
- [ ] Upload or locate the "6 Documents Before Vibe Coding" PDF
- [ ] In admin: Edit the resource → add Google Drive URL
- [ ] Add cover image URL
- [ ] Publish the resource
- [ ] Verify public page at `/resources/6-documents-before-vibe-coding`
- [ ] Test download button tracking

### 7. Navigation Verification
- [ ] "Free Resources" appears in the Products dropdown in the header
- [ ] "Free Resources" appears in the Products section of the footer
- [ ] `/resources` appears in the sitemap

### 8. Advertising Setup
- [ ] Log into Adsterra publisher dashboard
- [ ] Verify website ID 6121931 is approved
- [ ] Verify the 4 ad unit IDs match those in the code
- [ ] Enable ads in admin only after verification

### 9. Instagram Campaign Setup
- [ ] Create Manychat account or log in
- [ ] Connect Instagram account to Manychat
- [ ] Create automation flow for keyword DOC
- [ ] Test automation with a private comment
- [ ] Update campaign status to "configured" then "active"

## Production Deployment

```bash
# Vercel handles deployment automatically from main branch push
git add .
git commit -m "feat: Resource Hub - complete implementation"
git push origin main
```

Or submit a PR from `feature/yaidigitals-resource-hub` to `main` and merge after review.

## Post-Deployment Verification

- [ ] Visit `https://www.yaidigitals.co.in/resources`
- [ ] Visit `https://www.yaidigitals.co.in/resources/6-documents-before-vibe-coding` (if published)
- [ ] Verify SEO metadata using browser DevTools → View Source
- [ ] Submit new URLs to IndexNow: `npm run indexnow -- /resources`
- [ ] Check Supabase: verify events are being recorded after a page visit
- [ ] Check admin analytics tab shows data

## Rollback Plan

If the deployment causes issues:
1. Revert the Vercel deployment to the previous production deployment
2. The database migration does NOT need to be rolled back (the new tables don't affect existing functionality)
3. Alternatively, roll back the code commit and redeploy

## External Dependencies Not Yet Configured

- [ ] **Google Drive PDF**: Upload the "6 Documents Before Vibe Coding" PDF to Google Drive and add the link in admin
- [ ] **Manychat**: Configure the Instagram DM automation for the DOC keyword
- [ ] **Adsterra approval**: Verify your account and website are approved before enabling ads
- [ ] **Cover image**: Create or source a branded cover image for the first resource

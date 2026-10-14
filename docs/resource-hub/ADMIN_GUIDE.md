# YAIdigitals Resource Hub — Admin Guide

## Accessing the Admin

1. Go to `https://www.yaidigitals.co.in/admin/login`
2. Sign in with your admin credentials
3. You must be an approved admin (see `admin_approvals` table)
4. Navigate to the **Resource Hub** section in the tab bar

## Resource Hub Tabs

| Tab | Purpose |
|---|---|
| Resources | Create, edit, publish, delete resources |
| Campaigns | Manage Instagram campaigns |
| Advertising | Configure Adsterra ad settings |
| Analytics | View traffic and download stats |

## Creating a Resource

1. Go to **Resources → New Resource**
2. Fill in the required fields:
   - **Title** — human-readable name (slug auto-generates)
   - **Summary** — shown in listings (2–3 sentences)
   - **Article** — full educational content (supports paragraph breaks)
   - **Category** — select from existing categories
   - **Tags** — comma-separated, used in sidebar
3. Under **File Delivery**, add ONE of:
   - Google Drive URL (must be `https://drive.google.com/...`)
   - External Download URL (must be HTTPS)
   - Supabase Storage Path (advanced)
4. Add **Cover Image URL** for visual appeal
5. Fill in **SEO Title** and **Meta Description** (70–160 chars)
6. Set **Status** to "Published" when ready
7. Click **Create Resource**

## Publishing a Resource

- From the editor: set Status → Published → Save
- From the list view: click the globe icon on any resource row
- A `published_at` timestamp is set automatically on first publish
- Published resources are immediately visible at `/resources/[slug]`

## Google Drive Files

⚠️ **Important**: When using Google Drive links:
1. Open the file in Google Drive
2. Click Share → "Anyone with the link" → Viewer
3. Copy the sharing link
4. Paste it in the Google Drive URL field
5. Test the link in an incognito window before publishing

The system validates that the URL is from `drive.google.com` or `docs.google.com`.

## Instagram Campaign Setup

### Step 1: Create the Campaign in Admin
1. Go to **Resource Hub → Campaigns → New Campaign**
2. Select the resource
3. Enter the Instagram Reel ID (from the reel URL)
4. Set the **Comment Keyword** (e.g., `DOC`)
5. Set **UTM Campaign** slug (e.g., `6_documents`)
6. Leave Automation Status as `manual` initially
7. Save — the system generates the tracking URL and DM template

### Step 2: Set Up Manychat
1. Log in to your Manychat account
2. Create a new Instagram automation flow
3. Trigger: "When a user comments [keyword]" → enter your keyword
4. Action: "Send DM" → paste the generated DM message with tracking URL
5. Test by commenting on your reel yourself
6. Once working, update Automation Status to `active` in admin

### Generated DM Message Example
```
Hey! 👋 Here's your free resource: "6 Documents Before Vibe Coding"

📄 Download it here:
https://www.yaidigitals.co.in/resources/6-documents-before-vibe-coding?utm_source=instagram&utm_medium=dm&utm_campaign=6_documents

Enjoy! 🎉
```

### Copy Buttons
- **Copy Tracking URL** — copies the full UTM-tagged URL
- **Copy DM Message** — copies the ready-to-paste DM text

## Advertising Controls

### Global Enable/Disable
Go to **Advertising** tab → "Enable advertisements globally" toggle.

When OFF, NO ads appear on ANY resource page regardless of individual resource settings.

### Per-Resource Ads
In the Resource Editor, uncheck "Advertisements enabled" to disable ads for that specific resource.

### Format Controls
Enable/disable each ad format:
- Native Banner (in-content)
- 300×250 Banner (mobile + desktop)
- 320×50 Mobile Banner
- 728×90 Desktop Banner

## Analytics

The **Analytics** tab shows:
- Total lifetime views and downloads
- Period stats (7, 30, or 90 days)
- Click-through rate (downloads ÷ views)
- Daily traffic chart
- Top resources leaderboard
- Traffic source breakdown

For advertising earnings, visit the Adsterra dashboard directly.

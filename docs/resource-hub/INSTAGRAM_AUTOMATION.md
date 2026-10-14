# YAIdigitals Resource Hub — Instagram Automation Guide

## Current Implementation: Manual Manychat

The Resource Hub generates all the required assets for Instagram DM automation. However, the actual automation requires an external Manychat (or similar) account — the system does NOT send Instagram DMs directly.

## What the Admin Dashboard Generates

For each campaign, the system produces:

1. **Landing Page URL** — the canonical resource URL
2. **Tracking URL** — with UTM parameters for attribution
3. **Comment Keyword** — the word users comment to trigger DM
4. **DM Message Template** — ready to paste into Manychat

### Example Campaign: 6 Documents Before Vibe Coding

```
Reel: [Your Instagram Reel URL]
Comment Keyword: DOC
Tracking URL: https://www.yaidigitals.co.in/resources/6-documents-before-vibe-coding?utm_source=instagram&utm_medium=dm&utm_campaign=6_documents
DM Template:
---
Hey! 👋 Here's your free resource: "6 Documents Before Vibe Coding"

📄 Download it here:
https://www.yaidigitals.co.in/resources/6-documents-before-vibe-coding?utm_source=instagram&utm_medium=dm&utm_campaign=6_documents

Enjoy! 🎉
---
```

## Manychat Setup Steps

1. Go to https://manychat.com and connect your Instagram account
2. Create a new **Flow** → Instagram Automation
3. Set trigger: **Comment on Post** → Post: [your reel] → Keyword: `DOC`
4. Add action: **Send DM** → paste the generated message template
5. Publish the flow
6. Test: Comment "DOC" on the reel from another account
7. Verify you receive the DM with the correct URL

## Tracking

When a user clicks the tracking URL from the DM:
- `utm_source=instagram` captures the Instagram origin
- `utm_medium=dm` identifies the DM channel
- `utm_campaign=6_documents` identifies the specific campaign
- These UTM values appear in the Analytics dashboard under "Traffic Sources"

## Automation Status Values

| Status | Meaning |
|---|---|
| `manual` | Not automated — DMs sent manually |
| `configured` | Manychat flow created, not yet live |
| `active` | Automation is running |
| `paused` | Flow paused in Manychat |

## Future: Meta API

A future version may support the official Meta Messaging API for direct DM automation. This requires:
- Meta Business Suite access
- Instagram Professional Account
- Meta App with Messaging permissions
- App review and approval by Meta

This is NOT implemented in the current version. The `meta_api` option in the provider dropdown reserves the space for future implementation.

## Important Limitations

⚠️ Direct Instagram DM automation via unofficial APIs (scraping, unauthorized bots) violates Instagram's Terms of Service. Only use Meta-approved automation providers like Manychat, Chatfuel, or the official Meta API.

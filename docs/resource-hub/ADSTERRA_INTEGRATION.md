# YAIdigitals Resource Hub — Adsterra Integration

## Ad Units

| Format | Ad Unit ID | Key |
|---|---|---|
| Native Banner | 31723170 | b7d59b98fc7292bd424fc2f3ccf8d86c |
| 300×250 Banner | 31723171 | 8992bdb6d7f8b683144993ac74442230 |
| 320×50 Mobile | 31723172 | 5cdb4a91f58a8f8c2ac39345afdf2448 |
| 728×90 Desktop | 31723173 | 04f340bcc8ebf44cfb2d04f254e7a31c |

Website ID: `6121931`

## Isolation Strategy

⚠️ **Critical**: The `atOptions` global variable would cause script conflicts if multiple banner units were rendered in the same document scope. Our implementation uses **iframe isolation**:

Each `AdsterraBanner` component:
1. Creates an `<iframe>` element
2. Writes a complete HTML document into the iframe's `contentDocument`
3. The `atOptions` variable is defined on the iframe's `contentWindow`
4. The ad script runs in that isolated context, not the parent page
5. Scripts from different ad units never interfere with each other

```tsx
// Each banner gets its own isolated iframe document
const html = `<html><body>
  <script>
    var atOptions = { 'key': '${adKey}', 'format': 'iframe', ... };
  </script>
  <script src="https://bicea.org/22/${adKey}"></script>
</body></html>`;
doc.write(html);
```

The Native Banner uses a different API (no `atOptions`) and is injected via DOM script element.

## Placement Strategy

| Placement | Mobile | Desktop |
|---|---|---|
| `content` (after hero) | 300×250 | 728×90 |
| `content` (mid-article) | 300×250 | 728×90 |
| `sidebar` | 300×250 | 300×250 |
| `footer` (native) | Native | Native |
| `mobile-sticky` | 320×50 (fixed bottom) | Hidden |

## Rendering Guard

The `AdBlock` component returns `null` when:
- `globalEnabled` is false (admin kill-switch)
- `resourceAdsEnabled` is false (per-resource setting)
- The specific format is disabled in settings

No scripts are loaded when ads are disabled — there is no placeholder or empty container.

## Production Verification Steps

Before enabling `global_enabled` in production:

1. **Verify account**: Log in to https://publishers.adsterra.com/ and confirm your website is approved and the ad unit IDs match those listed above.
2. **Test in staging**: Enable ads on a test resource in staging and verify the banners load correctly.
3. **Check console**: Open DevTools — there should be no JavaScript errors from the ad scripts.
4. **Check layout**: Ensure ads do not overflow their containers on mobile (320px viewport).
5. **Check navigation**: Navigate between resource pages — ads should re-initialize correctly.

## Policies Enforced

- ✅ No popunders
- ✅ No forced redirects
- ✅ No Smartlinks
- ✅ No adult content
- ✅ Download button is always accessible regardless of ads
- ✅ Mobile ads do not block content
- ✅ Ads are labelled "Advertisement"

## Enabling Ads

1. Go to `/admin` → **Resource Hub → Advertising**
2. Enable desired ad formats
3. Turn on **Enable advertisements globally**
4. Save settings
5. Ads are now live on all published resources that have `ads_enabled: true`

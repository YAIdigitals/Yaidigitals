# YAIdigitals Resource Hub — SEO Guide

## Per-Resource SEO Metadata

Every published resource automatically generates:

### `<head>` Tags (via Next.js `generateMetadata`)
- `<title>` — `seo_title` or `title` (via site title template)
- `<meta name="description">` — `meta_description` or `summary`
- `<link rel="canonical">` — `https://www.yaidigitals.co.in/resources/[slug]`
- `<meta property="og:title">`
- `<meta property="og:description">`
- `<meta property="og:image">` — `og_image` or `cover_image` or site default
- `<meta property="og:type">` — `article`
- `<meta property="article:published_time">`
- `<meta property="article:modified_time">`
- `<meta name="twitter:card">` — `summary_large_image`
- `<meta name="robots">` — `index, follow`

### Robots Directives
- Unpublished resources: `noindex, nofollow` (via `notFound()` — never rendered)
- Published resources: `index, follow`
- Admin routes: `noindex, nofollow` (configured in admin layout)

### Structured Data (JSON-LD)
Each resource page emits:
1. **DigitalDocument** — resource type, name, URL, dates, publisher
2. **BreadcrumbList** — Home → Resources → [Category] → [Resource Title]

### Sitemap
Published resources are automatically included in `/sitemap.xml` with `lastModified` dates from `updated_at` or `published_at`.

The listing page `/resources` is in the static route list.

## SEO Best Practices

### Resource Content Requirements
Every resource page contains:
- A single `<h1>` (resource title)
- Meaningful `<h2>` sections (About, Download, FAQ)
- A full educational article (not just a download link)
- Related resources section (internal linking)
- Breadcrumb navigation

### Admin SEO Tips
1. **SEO Title** — write a keyword-rich title including the file format: `6 Documents Before Vibe Coding — Free PDF | YAIdigitals`
2. **Meta Description** — include the benefit and the keyword: 70–160 characters
3. **Tags** — use tags that match search terms developers use
4. **Cover Image** — an eye-catching OG image improves click-through on social shares
5. **Summary** — used in listing cards and as a fallback meta description

### IndexNow
After publishing new resources, submit URLs to search engines:
```bash
npm run indexnow -- /resources/your-resource-slug
```

## URL Structure

```
/resources                              → Hub listing (CollectionPage)
/resources/[slug]                       → Resource detail (DigitalDocument)
/resources/category/[category]          → Category listing (CollectionPage)
```

Slugs are generated from the title: `6 Documents Before Vibe Coding` → `6-documents-before-vibe-coding`

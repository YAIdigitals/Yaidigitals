# YAIdigitals Technical SEO, GEO/AEO and Search Architecture Audit

Audit date: 30 September 2026

Canonical site: <https://www.yaidigitals.co.in/>

Stack: Next.js 16 App Router, React 19, Supabase, Vercel, Cloudflare

## 1. Executive summary

The canonical YAIdigitals homepage and all 33 URLs currently listed in the XML
sitemap are technically eligible for crawling and indexing. The canonical
homepage returns `200`, is not blocked by robots directives, contains a
self-referencing canonical, exposes one H1 in server-rendered HTML and links to
the main service and evidence pages.

The Search Console status “Page with redirect” is not evidence that the final
homepage is blocked. That status is expected when Google discovers or is asked
to inspect an HTTP or non-`www` variant that permanently redirects. URL
Inspection must be run on the exact canonical URL to distinguish that expected
state from an indexing problem on the final page.

No ranking, indexing, traffic or AI-citation guarantee is possible. This work
improves technical eligibility and clarity; search engines still make their own
crawling, canonicalization and ranking decisions.

## 2. Critical indexing investigation

Observed public behavior before this implementation was deployed:

| Requested homepage | Observed path | Result |
|---|---|---|
| `http://yaidigitals.co.in/` | HTTP apex → HTTPS apex → HTTPS `www` | Two permanent `308` hops, then `200` |
| `https://yaidigitals.co.in/` | HTTPS apex → HTTPS `www` | One permanent `308`, then `200` |
| `http://www.yaidigitals.co.in/` | HTTP `www` → HTTPS `www` | One permanent `308`, then `200` |
| `https://www.yaidigitals.co.in/` | No redirect | `200` |

The final response contained `index, follow`, one H1, crawlable content and no
`X-Robots-Tag: noindex`. Search Console’s affected URL list should be exported
and compared with this table; redirected variants should not be requested for
indexing.

## 3. Root cause assessment

There is no current site-wide `noindex`, `Disallow: /`, soft-404 homepage or
redirect loop. The most likely explanation for the reported Search Console
message is that a noncanonical variant was discovered or submitted. Google
documents permanent redirects, canonical annotations and sitemap inclusion as
canonicalization signals: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

The former application configuration also allowed an environment/CMS domain to
influence canonical URLs. Canonical generation is now fixed in code to the
production `www` origin, preventing preview deployments or stale settings from
creating conflicting signals.

The remaining two-hop HTTP-apex path is infrastructure-level. Public headers
identify Cloudflare as the edge, which upgrades HTTP before the application
redirects the apex host. This is an inference from the observed chain. It should
be collapsed with the Cloudflare rule described under manual actions.

## 4. Redirect analysis

- The application proxy permanently redirects the apex host to HTTPS `www`.
- Legacy `/projects/*` paths permanently redirect to `/work/*`.
- Legacy `/blog/*` paths permanently redirect to `/insights/*`.
- Admin-managed redirects remain supported from Supabase.
- Internal links found in the sitemap crawl point directly to final URLs.
- Missing pages return genuine `404` responses.

Vercel recommends choosing one host and configuring the other as a domain
redirect: [Vercel domain redirects](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).

## 5. Canonical analysis

Every sitemap page has one canonical pointing to its own production URL. The
sitemap, Open Graph URLs, JSON-LD identifiers and internal links use the same
HTTPS `www` host.

Next.js serializes the origin homepage canonical as
`https://www.yaidigitals.co.in` without a visible terminal slash. For an origin
URL, URL parsing normalizes that to `/`; it is the same HTTP resource as
`https://www.yaidigitals.co.in/`. The automated validator compares normalized
URLs. Adding a second manual canonical solely to force a slash would create a
duplicate annotation and is therefore intentionally avoided.

## 6. Robots and crawler policy

`/robots.txt`:

- allows public crawling;
- blocks `/admin`, `/admin/` and `/api/`;
- does not block CSS, JavaScript, images or fonts;
- references the canonical sitemap;
- applies the standard wildcard policy to search and AI discovery crawlers.

There are no speculative crawler-specific blocks. Admin and API responses also
send `X-Robots-Tag: noindex, nofollow` as defense in depth.

## 7. Sitemap analysis

`/sitemap.xml` is generated from public CMS data and contains 33 canonical
URLs at audit time. It includes only:

- active services;
- published projects, industries, courses and insights;
- active products when any exist;
- stable public collection, company and legal pages.

The empty store is currently excluded and marked `noindex`. Admin, API, preview,
draft and redirecting URLs are excluded. `lastmod` is emitted only when the
database provides a valid real timestamp; static pages do not receive fake
freshness dates. This follows [Google’s sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## 8. Changes implemented

- Fixed canonical URL generation to one production origin.
- Added permanent apex-to-`www` application redirect protection.
- Added unique metadata, Open Graph and Twitter card data across public routes.
- Updated the homepage title to target brand plus website, app, software and AI
  development intent naturally.
- Ensured server-rendered H1s and descriptive content remain visible without
  client-side interaction.
- Filtered all dynamic public routes and sitemap queries by active/published
  state.
- Added Organization, WebSite, WebPage, BreadcrumbList, Service, FAQPage,
  CreativeWork, Article, Course and Product data where the visible page supports
  it.
- Added visible breadcrumbs to detail pages.
- Added related services and project links to strengthen topical paths.
- Added a factual `llms.txt` without claiming ranking benefit.
- Added a branded manifest, SVG icon, generated Apple touch icon and Open Graph
  image.
- Removed the dead `twitter.com/yaidigitals` link and `sameAs` value; that URL
  returned `404` during the audit.
- Added safe response headers: `nosniff`, `SAMEORIGIN`, strict referrer policy
  and restricted camera/microphone/geolocation permissions.
- Upgraded Next.js 14/React 18 to patched Next.js 16.3.7/React 19.3 and removed
  all npm audit findings.
- Removed the continuously running Lenis smooth-scroll loop in favor of native
  browser scrolling while preserving page animations and reduced-motion support.
- Added repeatable SEO crawl tests and an explicit IndexNow submission tool.

## 9. Structured data

Structured data is emitted as escaped JSON-LD and describes visible content.
The organization graph uses a stable `@id`, website publisher connection,
verified production URL and configured public contact details. Service FAQ
markup is generated only when the same questions and answers are visible on the
page. No review, rating, award, location, founder or performance claims were
invented.

The local crawl parsed 99 JSON-LD script blocks with zero JSON errors. A script
may contain a JSON array of multiple Schema.org nodes, so the number of entities
is greater than the number of script elements.

## 10. Search intent and keyword/topic map

| Page | Primary intent | Supporting concepts |
|---|---|---|
| `/` | YAIdigitals / digital product development company | websites, apps, custom software, AI automation |
| `/services/website-development` | website development company | business websites, performance, CMS, SEO-ready structure |
| `/services/web-application-development` | web application development | portals, dashboards, workflow applications |
| `/services/mobile-app-development` | mobile app development company | Android, iOS, cross-platform delivery |
| `/services/custom-software` | custom software development | internal tools, business workflows, integrations |
| `/services/ai-automation` | AI automation solutions | workflow automation, integrations, human oversight |
| `/services/ai-calling-agents` | AI calling agents for business | enquiries, qualification, booking, escalation |
| `/services/ecommerce` | e-commerce development company | storefronts, marketplaces, payments, operations |
| `/work/localgo` | LocalGo development case study | hyperlocal commerce, delivery workflows, React Native |
| `/work/sparkx-car-care` | SparkX Car Care case study | automotive service discovery and booking |

One primary intent is assigned per major page. No misspelling pages, city-page
permutations or keyword doorway pages were created.

## 11. GEO and AEO improvements

Important pages now use descriptive headings, concise introductory answers,
capability lists, development processes, visible FAQs, evidence links and
related-service paths. This helps a human or retrieval system determine who the
company is, what it offers, who the service is for, how work is approached and
what evidence exists without relying on animation or client-only rendering.

The content does not claim fixed prices or delivery times where the business has
not supplied them. Pricing content should explain scope factors until verified
price ranges are available.

## 12. AI-search discoverability

The public site provides crawlable HTML, consistent entity identifiers,
descriptive service pages, case studies, a sitemap and a lightweight `llms.txt`.
These are retrieval aids, not mechanisms that force citations. Bing now exposes
AI citation reporting—including cited pages, grounding queries, intents, topics
and citation share—in its Webmaster Tools previews:
[AI Performance introduction](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/) and
[expanded AI visibility insights](https://blogs.bing.com/search/2026/6/New-AI-Visibility-Insights-in-Bing-Webmaster-Tools-Intents-Topics-Citation-Share-Compare/).

## 13. IndexNow implementation

The public verification file is `/indexnow-key.txt`. The reusable
`scripts/submit-indexnow.mjs` command:

- accepts only explicitly supplied changed URLs;
- restricts submissions to the canonical host;
- deduplicates URLs;
- supports `--dry-run`;
- sends batches to the global IndexNow endpoint;
- treats HTTP `200` and `202` as accepted notifications.

Examples:

```bash
npm run indexnow -- --dry-run /services/website-development
npm run indexnow -- /services/website-development /work/localgo
```

Use it only for meaningful creates, updates, redirects and deletions. IndexNow
states that a successful response means the URL was received, not that it will
be indexed: [IndexNow protocol documentation](https://www.indexnow.org/documentation).

## 14. Performance and Core Web Vitals

Implemented safeguards:

- server-rendered/static HTML for critical content;
- Next/font for self-hosted font delivery;
- no hero bitmap competing for LCP;
- reserved image containers to reduce layout movement;
- lazy loading for below-the-fold CMS imagery;
- analytics loaded after interactivity;
- native scrolling instead of a continuous animation-frame loop;
- reduced-motion handling;
- package import optimization for icon code.

Five live homepage requests produced a median TTFB of approximately `0.93s`
from the audit environment and roughly `22KB` compressed HTML. Results ranged
from about `0.51s` to `2.18s`, so origin/edge latency should be monitored. The
response showed a Vercel cache hit while Cloudflare reported dynamic handling.
No lab LCP/INP/CLS scores are claimed because the PageSpeed API quota was
unavailable. Run mobile and desktop PageSpeed Insights after deployment and use
Search Console field data as the authoritative ongoing CWV view.

## 15. Content and authority gaps

- The two case studies have useful architecture and workflow detail but no
  screenshots in the CMS. Add real, descriptive project images and captions.
- Only two insight articles are published, and they focus on short-form content
  rather than YAIdigitals’ core B2B development expertise.
- No verified office address is configured, so LocalBusiness/location schema
  and local landing pages were correctly not created.
- Article authors should receive factual bios or profile pages when the real
  people and credentials are available.
- Add decision-support content gradually: cost factors, platform tradeoffs,
  architecture lessons and implementation checklists based on actual work.
- Earned mentions and links require genuine partnerships, useful resources and
  client/project exposure; no link scheme is recommended.

## 16. Competitor/SERP gap observations

Search results sampled during the audit favored pages with direct service
definitions, detailed capability lists, explicit processes, decision support
and concrete evidence. Examples included [The Tech Genius](https://www.thetechgenius.in/),
[Webneco](https://www.webneco.com/),
[RisonAI Tech](https://risonaitech.com/services/ai-automation) and
[Layercodes](https://layercodes.com/services/).

The opportunity is not to copy them. YAIdigitals can differentiate with its own
LocalGo/SparkX engineering decisions, cross-platform architecture experience,
workflow diagrams, screenshots, constraints, technology-selection reasoning
and honest scoping guidance. A web search for the brand and `site:` variants
returned no result in the audit tool, but that is only a discovery signal—not a
substitute for Google Search Console’s index data.

## 17. Files changed

Main implementation areas:

- `src/lib/seo.ts`, `src/lib/settings.ts`
- `src/proxy.ts`, `next.config.js`
- public route metadata and detail-page templates under `src/app/`
- `src/components/Breadcrumbs.tsx`, `src/components/Footer.tsx`,
  `src/components/Header.tsx`
- `public/indexnow-key.txt`
- `scripts/seo-audit.mjs`, `scripts/submit-indexnow.mjs`
- `package.json`, lockfile, ESLint/TypeScript configuration
- `DEPLOY.md` and this report

The admin UI, database schema, responsive design, contact flow and conversion
routes were preserved.

## 18. Tests performed

- Next.js production build: passed.
- TypeScript `--noEmit`: passed.
- ESLint: zero errors; 12 pre-existing admin warnings remain.
- npm production/development dependency audit: zero known vulnerabilities after
  the upgrade.
- Local sitemap crawl: 33 URLs, all `200`, no redirects, no noindex pages,
  exactly one H1 per page, unique titles/descriptions and matching canonicals.
- Internal links checked: 34 unique internal destinations, no broken links.
- JSON-LD: 99 script blocks parsed, zero JSON errors.
- Missing-page check: genuine `404` with `noindex`.
- IndexNow key endpoint and dry-run submission: passed.
- Mixed-content references on the live homepage: none found.

Run the regression suite at any time with:

```bash
npm run test:seo
```

## 19. Remaining manual actions

1. Add a Cloudflare Single Redirect from any apex-host request directly to the
   same path/query on HTTPS `www`, ahead of generic HTTPS enforcement.
2. Confirm the exact affected URLs in Search Console’s “Page with redirect”
   report; do not request indexing for the redirect sources.
3. Resolve whether `info@yaidigitals.com` is the official business email. The
   public website uses `.co.in`, while the configured email uses `.com`; it was
   not changed without factual confirmation.
4. Confirm the Instagram and Facebook profiles represent the same business.
   The former X/Twitter profile was removed because it returned `404`.
5. Upload real project screenshots and factual image captions.
6. Configure organic conversion events for successful enquiry submission,
   WhatsApp, phone and email clicks in GA4 if those public contact methods are
   enabled.
7. Run PageSpeed Insights and review Search Console CWV after the new deployment
   has accumulated field data.

## 20. Google Search Console instructions

1. Open URL Inspection and inspect exactly
   `https://www.yaidigitals.co.in/`.
2. Confirm: URL available to Google, indexing allowed, fetched over HTTPS,
   user-declared canonical is the `www` homepage and rendered HTML contains the
   title, H1, content and links.
3. Check Google-selected canonical. If it differs, compare the inspected page,
   sitemap URL and inbound/internal links before requesting re-indexing.
4. Use “Test live URL”, then request indexing once after deployment.
5. Submit `https://www.yaidigitals.co.in/sitemap.xml` under Sitemaps.
6. Review Page indexing by exact example URL, not only reason totals.
7. Monitor Search results performance for branded queries and each mapped
   service intent.
8. Review Core Web Vitals, HTTPS, Enhancements, Manual Actions and Security
   Issues. Use any AI/overview reporting only when it appears in the property;
   feature availability varies.

## 21. Bing Webmaster Tools instructions

1. Add and verify the canonical `www` site; importing the verified Search
   Console property is acceptable if offered.
2. Submit the canonical sitemap and test robots.txt.
3. Inspect the homepage and main service URLs with URL Inspection.
4. Verify `/indexnow-key.txt`, then use the explicit submission command after
   meaningful content changes.
5. Review Index Explorer, Site Scan, crawl/index reports and search performance.
6. In AI Performance/AI Visibility, monitor total citations, cited pages,
   grounding queries, intents, topics, citation share and competitors over time.
   Citation counts are visibility observations, not rankings or endorsements.

## 22. Deployment instructions

```bash
npm ci
npm run lint
npx tsc --noEmit
npm run build
# deploy through the linked Vercel project or push to the production branch
npm run test:seo
```

After a production deployment, verify the four homepage variants, the public
IndexNow key, robots, sitemap, manifest, representative service/case-study
pages, admin noindex headers and one missing URL.

## 23. 30/60/90-day roadmap

### First 30 days: indexing and measurement

- Complete the Cloudflare one-hop redirect.
- Submit/validate the sitemap in Google and Bing.
- Inspect the homepage and all seven service pages.
- Establish branded-query, nonbranded-query, conversion and CWV baselines.
- Verify business email and social profiles.
- Add real screenshots to both case studies.

### Days 31–60: evidence and decision support

- Expand LocalGo and SparkX with factual constraints, architecture diagrams,
  screenshots and implementation lessons.
- Publish one high-quality website-development decision guide and one mobile-app
  platform comparison using YAIdigitals’ actual engineering experience.
- Add factual author bios and editorial ownership.
- Add GA4 events for qualified organic enquiries and contact actions.

### Days 61–90: topical authority and iteration

- Publish one original AI automation workflow guide and one custom-software
  scoping guide; avoid mass generation.
- Link each guide to its service, relevant case study and adjacent guide.
- Review GSC query/page data and Bing AI citation/grounding-query data.
- Refresh only pages where evidence, services or customer questions have
  materially changed, and notify IndexNow only for those URLs.
- Prioritize future content using real impressions, conversions, sales questions
  and project knowledge rather than keyword volume alone.

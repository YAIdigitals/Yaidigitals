const CANONICAL_ORIGIN = 'https://www.yaidigitals.co.in';
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const baseArg = args.find((arg) => arg.startsWith('--base='))?.slice('--base='.length);
const BASE = (baseArg || process.env.SEO_BASE_URL || CANONICAL_ORIGIN).replace(/\/$/, '');

const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function attribute(tag, name) {
  const quoted = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  if (quoted) return quoted[2];
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*([^\\s>]+)`, 'i'))?.[1] ?? '';
}

function decodeHtml(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;|&#38;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&lt;|&#60;/gi, '<')
    .replace(/&gt;|&#62;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function elementText(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi'))].map(
    (match) => decodeHtml(match[1])
  );
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function normalizedUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    return url.href;
  } catch {
    return value;
  }
}

function localUrl(canonicalUrl) {
  const url = new URL(canonicalUrl);
  return new URL(`${url.pathname}${url.search}`, `${BASE}/`).href;
}

async function request(url, init = {}) {
  const response = await fetch(url, {
    redirect: 'manual',
    headers: { 'user-agent': 'YAIdigitals-SEO-Validator/1.0' },
    ...init,
  });
  return response;
}

async function traceRedirects(start) {
  const hops = [];
  let current = start;
  for (let count = 0; count < 6; count += 1) {
    const response = await request(current);
    const location = response.headers.get('location');
    hops.push({ url: current, status: response.status, location });
    if (!location || response.status < 300 || response.status >= 400) return hops;
    current = new URL(location, current).href;
  }
  return hops;
}

function parsePage(url, response, html) {
  const metaTags = tags(html, 'meta');
  const linkTags = tags(html, 'link');
  const title = elementText(html, 'title')[0] ?? '';
  const descriptionTag = metaTags.find((tag) => attribute(tag, 'name').toLowerCase() === 'description');
  const robotsTag = metaTags.find((tag) => attribute(tag, 'name').toLowerCase() === 'robots');
  const canonicalTag = linkTags.find((tag) =>
    attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical')
  );
  const h1s = elementText(html, 'h1');
  const schemaBlocks = [
    ...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ].map((match) => match[1]);
  let schemaErrors = 0;
  for (const block of schemaBlocks) {
    try {
      JSON.parse(block.replace(/\\u003c/g, '<'));
    } catch {
      schemaErrors += 1;
    }
  }
  const links = [...html.matchAll(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1/gi)]
    .map((match) => match[2])
    .filter((href) => !/^(?:mailto:|tel:|sms:|javascript:|#)/i.test(href))
    .map((href) => new URL(href, url))
    .filter((link) => link.origin === new URL(url).origin && !link.pathname.startsWith('/cdn-cgi/'))
    .map((link) => {
      link.hash = '';
      return link.href;
    });

  return {
    url,
    status: response.status,
    redirected: Boolean(response.headers.get('location')),
    title,
    description: descriptionTag ? attribute(descriptionTag, 'content') : '',
    canonical: canonicalTag ? attribute(canonicalTag, 'href') : '',
    robots: robotsTag ? attribute(robotsTag, 'content') : '',
    xRobots: response.headers.get('x-robots-tag') ?? '',
    h1s,
    schemaCount: schemaBlocks.length,
    schemaErrors,
    links,
  };
}

function duplicates(pages, key) {
  const grouped = new Map();
  for (const page of pages) {
    const value = page[key];
    if (!value) continue;
    grouped.set(value, [...(grouped.get(value) ?? []), page.url]);
  }
  return [...grouped.entries()].filter(([, urls]) => urls.length > 1);
}

console.log(`SEO audit target: ${BASE}`);

const homepage = await request(`${BASE}/`);
const homepageHtml = await homepage.text();
const homepageData = parsePage(`${BASE}/`, homepage, homepageHtml);
if (homepageData.status !== 200) addError(`Homepage returned ${homepageData.status}, expected 200.`);
if (/noindex/i.test(`${homepageData.robots} ${homepageData.xRobots}`)) addError('Homepage is noindex.');
if (normalizedUrl(homepageData.canonical) !== `${CANONICAL_ORIGIN}/`) {
  addError(`Homepage canonical is ${homepageData.canonical || 'missing'}, expected ${CANONICAL_ORIGIN}/.`);
}

const robotsResponse = await request(`${BASE}/robots.txt`);
const robotsText = await robotsResponse.text();
if (robotsResponse.status !== 200) addError(`robots.txt returned ${robotsResponse.status}.`);
if (/Disallow:\s*\/\s*$/im.test(robotsText)) addError('robots.txt blocks the entire site.');
if (!robotsText.includes(`${CANONICAL_ORIGIN}/sitemap.xml`)) addError('robots.txt does not reference the canonical sitemap.');

const sitemapResponse = await request(`${BASE}/sitemap.xml`);
const sitemapText = await sitemapResponse.text();
if (sitemapResponse.status !== 200) addError(`sitemap.xml returned ${sitemapResponse.status}.`);
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeHtml(match[1]));
if (!sitemapUrls.includes(`${CANONICAL_ORIGIN}/`)) addError('Sitemap does not contain the canonical homepage.');
if (new Set(sitemapUrls).size !== sitemapUrls.length) addError('Sitemap contains duplicate URLs.');
for (const url of sitemapUrls) {
  if (!url.startsWith(`${CANONICAL_ORIGIN}/`)) addError(`Sitemap contains a noncanonical host: ${url}`);
}

const manifestResponse = await request(`${BASE}/manifest.webmanifest`);
if (manifestResponse.status !== 200) addError(`manifest.webmanifest returned ${manifestResponse.status}.`);

const indexNowKeyResponse = await request(`${BASE}/indexnow-key.txt`);
const indexNowKey = (await indexNowKeyResponse.text()).trim();
if (indexNowKeyResponse.status !== 200) addError(`IndexNow key file returned ${indexNowKeyResponse.status}.`);
if (!/^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)) addError('IndexNow key file has an invalid format.');

const pages = await Promise.all(
  sitemapUrls.map(async (canonicalUrl) => {
    const crawlUrl = localUrl(canonicalUrl);
    const response = await request(crawlUrl);
    const html = await response.text();
    return { ...parsePage(crawlUrl, response, html), expectedCanonical: normalizedUrl(canonicalUrl) };
  })
);

for (const page of pages) {
  const label = new URL(page.expectedCanonical).pathname;
  if (page.status !== 200) addError(`${label} returned ${page.status}.`);
  if (page.redirected) addError(`${label} redirects but is included in the sitemap.`);
  if (!page.title) addError(`${label} has no title.`);
  if (!page.description) addError(`${label} has no meta description.`);
  if (!page.canonical) addError(`${label} has no canonical.`);
  if (normalizedUrl(page.canonical) !== page.expectedCanonical) {
    addError(`${label} canonical points to ${page.canonical || 'nothing'}.`);
  }
  if (/noindex/i.test(`${page.robots} ${page.xRobots}`)) addError(`${label} is noindex but appears in the sitemap.`);
  if (page.h1s.length !== 1) addError(`${label} has ${page.h1s.length} H1 elements.`);
  if (page.schemaErrors > 0) addError(`${label} has ${page.schemaErrors} invalid JSON-LD block(s).`);
}

for (const [title, urls] of duplicates(pages, 'title')) {
  addError(`Duplicate title on ${urls.length} URLs: ${title}`);
}
for (const [description, urls] of duplicates(pages, 'description')) {
  addError(`Duplicate description on ${urls.length} URLs: ${description}`);
}

const importantPaths = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/services/website-development',
  '/services/mobile-app-development',
  '/services/custom-software',
  '/services/ai-automation',
  '/services/ai-calling-agents',
  '/services/ecommerce',
  '/work/localgo',
  '/work/sparkx-car-care',
];
for (const path of importantPaths) {
  if (!sitemapUrls.map((url) => new URL(url).pathname).includes(path)) {
    addError(`Important route is absent from sitemap: ${path}`);
  }
}

const internalLinks = [...new Set(pages.flatMap((page) => page.links))];
const linkChecks = await Promise.all(
  internalLinks.map(async (url) => {
    const response = await request(url, { method: 'HEAD' });
    return { url, status: response.status, location: response.headers.get('location') };
  })
);
for (const link of linkChecks) {
  if (link.status >= 400) addError(`Broken internal link (${link.status}): ${link.url}`);
  if (link.location) addWarning(`Internal link redirects (${link.status}): ${link.url} -> ${link.location}`);
}

const notFoundResponse = await request(`${BASE}/seo-validator-missing-page-${Date.now()}`);
if (notFoundResponse.status !== 404) addError(`Missing URL returned ${notFoundResponse.status}, expected 404.`);

if (BASE === CANONICAL_ORIGIN) {
  const variants = [
    'http://yaidigitals.co.in/',
    'https://yaidigitals.co.in/',
    'http://www.yaidigitals.co.in/',
    'https://www.yaidigitals.co.in/',
  ];
  for (const variant of variants) {
    const hops = await traceRedirects(variant);
    const final = hops.at(-1);
    if (final?.status !== 200 || normalizedUrl(final.url) !== `${CANONICAL_ORIGIN}/`) {
      addError(`Homepage variant does not resolve to the canonical 200 URL: ${variant}`);
    }
    const redirects = hops.filter((hop) => hop.status >= 300 && hop.status < 400);
    if (variant !== `${CANONICAL_ORIGIN}/` && redirects.some((hop) => ![301, 308].includes(hop.status))) {
      addError(`Homepage variant uses a temporary redirect: ${variant}`);
    }
    if (redirects.length > 1) {
      addWarning(`${variant} uses ${redirects.length} redirect hops; configure one edge redirect to ${CANONICAL_ORIGIN}/.`);
    }
  }
}

console.log(`Sitemap URLs checked: ${pages.length}`);
console.log(`Internal links checked: ${linkChecks.length}`);
console.log(`JSON-LD blocks checked: ${pages.reduce((total, page) => total + page.schemaCount, 0)}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

for (const message of errors) console.error(`ERROR: ${message}`);
for (const message of warnings) console.warn(`WARN: ${message}`);

if (strict && errors.length > 0) process.exit(1);

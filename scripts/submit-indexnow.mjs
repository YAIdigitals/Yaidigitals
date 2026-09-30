import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE_ORIGIN = 'https://www.yaidigitals.co.in';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const KEY_PATH = resolve(process.cwd(), 'public/indexnow-key.txt');

function usage() {
  console.error(
    'Usage: npm run indexnow -- /changed-path [/another-path]\n' +
      '       npm run indexnow -- --dry-run https://www.yaidigitals.co.in/changed-path'
  );
}

const key = readFileSync(KEY_PATH, 'utf8').trim();
if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  throw new Error('public/indexnow-key.txt does not contain a valid IndexNow key.');
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const requested = args.filter((arg) => arg !== '--dry-run');

if (requested.length === 0) {
  usage();
  process.exit(1);
}

const urls = [
  ...new Set(requested.map((value) => new URL(value, `${SITE_ORIGIN}/`).href)),
].map((value) => new URL(value));
for (const url of urls) {
  if (url.origin !== SITE_ORIGIN) {
    throw new Error(`IndexNow URL must use the canonical origin: ${url.href}`);
  }
  url.hash = '';
}

if (urls.length > 10_000) {
  throw new Error('IndexNow accepts at most 10,000 URLs in one request.');
}

const urlList = urls.map((url) => url.href);
const payload = {
  host: new URL(SITE_ORIGIN).host,
  key,
  keyLocation: `${SITE_ORIGIN}/indexnow-key.txt`,
  urlList,
};

if (dryRun) {
  console.log(`Dry run: ${urlList.length} URL(s) would be submitted.`);
  for (const url of urlList) console.log(url);
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
});

if (![200, 202].includes(response.status)) {
  const responseText = (await response.text()).slice(0, 500);
  throw new Error(`IndexNow rejected the submission (${response.status}): ${responseText}`);
}

console.log(`IndexNow accepted ${urlList.length} changed URL(s) with HTTP ${response.status}.`);

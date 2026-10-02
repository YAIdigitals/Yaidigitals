import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('primary form and navigation preserve accessible interaction contracts', async () => {
  const [form, header] = await Promise.all([
    readFile(new URL('../src/components/ContactForm.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/Header.tsx', import.meta.url), 'utf8'),
  ]);
  assert.match(form, /<label htmlFor=/);
  assert.match(form, /aria-invalid=/);
  assert.match(form, /role="alert"/);
  assert.match(form, /type="checkbox"/);
  assert.match(header, /<details/);
  assert.match(header, /<summary/);
  assert.match(header, /aria-label="Toggle navigation menu"/);
  assert.match(header, /aria-label="Mobile"/);
  assert.match(header, /WhatsApp us/);
});

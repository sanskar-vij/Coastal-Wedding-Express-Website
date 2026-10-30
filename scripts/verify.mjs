import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root, readContent } from './sync.mjs';
import { countdownParts } from '../src/scripts/countdown.js';
const now = Date.parse('2026-01-01T00:00:00Z');
assert.deepEqual(countdownParts('2026-01-08T03:04:05Z', now), {
  days: 7,
  hours: 3,
  minutes: 4,
  seconds: 5,
  total: 615845,
});
assert.equal(countdownParts('2025-12-31T23:59:59Z', now).total, 0);
assert.equal(countdownParts('not a date', now).total, 0);
const content = readContent(),
  built = path.join(root, 'dist/index.html');
assert(fs.existsSync(built), 'Build the website before running verification.');
const html = fs.readFileSync(built, 'utf8');
for (const id of [
  'welcome',
  'couple',
  'story',
  'celebrations',
  'memories',
  'venue',
  'rsvp',
  'guide',
])
  assert(html.includes(`id="${id}"`), `Missing section ${id}`);
for (const event of content.events)
  assert(html.includes(`data-event="${event.id}"`), `Missing built event ${event.id}`);
assert(!html.includes('pdf-crop'), 'Blurry PDF image variants must not return.');
const welcome = html.match(/<section[^>]*id="welcome"[\s\S]*?<\/section>/);
assert(!welcome?.[0].includes('assets/train1.mp4'), 'Opening train video must be removed.');
assert(
  !welcome?.[0].includes('class="welcome-train-canvas"'),
  'Opening train chroma-key canvas must be removed.',
);
assert(
  !html.includes(content.assets.flowers),
  'Decorative flower overlays must not appear on any page.',
);
for (const id of ['couple', 'story', 'celebrations', 'memories', 'rsvp']) {
  const section = html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`));
  assert(section?.[0].includes('class="scene-video"'), `Missing background video on ${id}`);
  assert(section[0].includes('assets/train2.mp4'), `Missing train video source on ${id}`);
}
assert.equal(
  (html.match(/class="scene-video"/g) ?? []).length,
  5,
  'Expected the train video on pages 2 through 5 and page 7.',
);
assert(!html.includes('class="site-header"'), 'Removed top logo/menu must not return.');
assert(!html.includes('directions-footer'), 'Removed directions footer must not return.');
for (const name of ['app.js', 'foliage.js', 'content.js'])
  assert.equal(
    fs.readFileSync(path.join(root, 'dist', name), 'utf8'),
    fs.readFileSync(path.join(root, 'public', name), 'utf8'),
    `Generated file mismatch: ${name}`,
  );
const references = [...html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)].map((m) => m[1]);
for (const ref of references) {
  if (/^(?:https?:|data:|mailto:)/.test(ref)) continue;
  const file = ref.split(/[?#]/)[0].replace(/^\//, '');
  assert(fs.existsSync(path.join(root, 'dist', file)), `Broken built reference: ${ref}`);
}
console.log(
  'Verified countdown boundaries, eight sections, all 15 events, clean illustrated welcome station, pages 2-5 and 7 video backgrounds, clean images and generated file synchronization.',
);

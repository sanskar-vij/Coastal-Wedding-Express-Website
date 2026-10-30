import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root, readContent } from './sync.mjs';
const content = readContent();
assert(
  !JSON.stringify(content).includes('Â'),
  'Invitation content must not contain corrupted UTF-8 text.',
);
assert(
  Number.isFinite(Date.parse(content.date)),
  'Wedding date must include a valid date/time/timezone.',
);
assert.equal(content.events.length, 15, 'Expected all 15 events from the car website.');
assert.equal(new Set(content.events.map((e) => e.id)).size, 15, 'Event IDs must be unique.');
assert.equal(
  new Set(content.events.map((e) => content.assets[e.art])).size,
  15,
  'Each event needs its own suitable illustration.',
);
for (const [key, asset] of Object.entries(content.assets)) {
  assert(!asset.includes('..'), 'Assets must remain within public/.');
  assert(fs.existsSync(path.join(root, 'public', asset)), `Missing ${key}: ${asset}`);
}
for (const e of content.events) {
  assert(e.title && e.tagline && e.place, `Incomplete event ${e.id}`);
  assert(content.assets[e.art], `Missing event illustration ${e.id}`);
  if (!e.dateTBC) assert(Number.isFinite(Date.parse(e.date)), `Invalid date for ${e.id}`);
}
for (const file of [
  content.music.src,
  content.entrance.background,
  'assets/fonts/Lora-OFL.txt',
  'assets/fonts/DM-Sans-OFL.txt',
])
  assert(fs.existsSync(path.join(root, 'public', file)), `Missing file ${file}`);
console.log(
  `Content valid: ${content.events.length} events; ${Object.keys(content.assets).length} assets; local fonts, music and entrance artwork present.`,
);

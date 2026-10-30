import fs from 'node:fs';

const s = fs.readFileSync('src/pages/index.astro', 'utf8');
const start = s.indexOf('id="rsvp"');
const end = s.indexOf('id="guide"', start);
console.log(s.substring(start, end));

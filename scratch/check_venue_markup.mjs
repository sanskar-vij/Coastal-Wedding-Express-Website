import fs from 'node:fs';

const s = fs.readFileSync('src/pages/index.astro', 'utf8');
const start = s.indexOf('id="venue"');
const end = s.indexOf('id="rsvp"', start);
console.log(s.substring(start, end));

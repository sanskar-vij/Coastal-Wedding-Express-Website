import fs from 'node:fs';

const s = fs.readFileSync('src/pages/index.astro', 'utf8');
const start = s.indexOf('class="travel-map');
console.log(s.substring(start - 40, start + 700));

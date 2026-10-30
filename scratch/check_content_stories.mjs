import fs from 'node:fs';

const c = fs.readFileSync('src/data/content.ts', 'utf8');
const start = c.indexOf('"stories":');
console.log(c.substring(start, start + 800));

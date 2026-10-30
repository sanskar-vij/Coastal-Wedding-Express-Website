import fs from 'node:fs';

const c = fs.readFileSync('src/styles/styles.css', 'utf8');
const idx = c.indexOf('@keyframes map-journey');
console.log(c.substring(idx, idx + 400));

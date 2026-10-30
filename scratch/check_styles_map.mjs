import fs from 'node:fs';

const c = fs.readFileSync('src/styles/styles.css', 'utf8');
const lines = c.split('\n');
console.log(lines.slice(418, 455).join('\n'));

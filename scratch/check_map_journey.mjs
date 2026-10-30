import fs from 'node:fs';

for (const f of fs.readdirSync('src/styles')) {
  const c = fs.readFileSync('src/styles/' + f, 'utf8');
  if (c.includes('map-journey')) console.log('map-journey in', f);
}

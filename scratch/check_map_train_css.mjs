import fs from 'node:fs';

['styles.css', 'opening.css', 'refinements.css'].forEach(f => {
  const c = fs.readFileSync('src/styles/' + f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('map-train') || l.includes('map-motion')) {
      console.log(f, i + 1, l);
    }
  });
});

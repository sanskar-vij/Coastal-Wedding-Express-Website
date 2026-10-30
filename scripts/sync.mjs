import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function readContent() {
  const source = fs.readFileSync(path.join(root, 'src/data/content.ts'), 'utf8');
  const match = source.match(/export const content\s*=\s*([\s\S]*);\s*$/);
  if (!match) throw new Error('content.ts must export a JSON-compatible content object.');
  return JSON.parse(match[1]);
}
export function sync() {
  const content = readContent();
  const write = (name, text) => fs.writeFileSync(path.join(root, 'public', name), text, 'utf8');
  write(
    'content.js',
    '/** Generated from src/data/content.ts. Edit the source, then npm run sync. */\nwindow.WEDDING=' +
      JSON.stringify(content, null, 2) +
      ';\nwindow.WEDDING_ASSETS=window.WEDDING.assets;\n',
  );
  const helper = fs
    .readFileSync(path.join(root, 'src/scripts/countdown.js'), 'utf8')
    .replace(/^export /gm, '');
  write(
    'app.js',
    '/** Generated from src/scripts/app.js and countdown.js. */\n' +
      helper +
      '\n' +
      fs.readFileSync(path.join(root, 'src/scripts/app.js'), 'utf8') +
      '\n' +
      fs.readFileSync(path.join(root, 'src/scripts/enhancements.js'), 'utf8'),
  );
  for (const name of ['foliage.js'])
    write(name, fs.readFileSync(path.join(root, 'src/scripts', name), 'utf8'));
  console.log('Synchronized content and browser scripts.');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) sync();

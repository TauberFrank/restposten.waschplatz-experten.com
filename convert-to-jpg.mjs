import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';

const IMG_DIR = './img';

const dirs = readdirSync(IMG_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => join(IMG_DIR, d.name));

let total = 0;

for (const dir of dirs) {
  const files = readdirSync(dir).filter(f => f.endsWith('.webp'));
  for (const file of files) {
    const src  = join(dir, file);
    const dest = join(dir, basename(file, '.webp') + '.jpg');
    if (existsSync(dest)) { console.log(`SKIP  ${dest}`); continue; }
    await sharp(src).jpeg({ quality: 88, progressive: true }).toFile(dest);
    console.log(`OK    ${dest}`);
    total++;
  }
}

console.log(`\nFertig: ${total} JPG-Dateien erstellt.`);

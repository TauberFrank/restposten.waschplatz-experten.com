import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const IMG_DIR = './img';
const MAX_WIDTH = 1200;
const QUALITY = 80;

async function getJpgs(dir) {
    const files = [];
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) files.push(...await getJpgs(full));
        else if (entry.name.endsWith('.jpg')) files.push(full);
    }
    return files;
}

const jpgs = await getJpgs(IMG_DIR);
let totalBefore = 0, totalAfter = 0;

for (const file of jpgs) {
    const outFile = file.replace(/\.jpg$/, '.webp');
    const before = (await stat(file)).size;
    totalBefore += before;

    await sharp(file)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outFile);

    const after = (await stat(outFile)).size;
    totalAfter += after;

    const savings = ((1 - after / before) * 100).toFixed(0);
    console.log(`${file} → ${outFile}  (${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB, -${savings}%)`);
}

console.log(`\nGesamt: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB (-${((1-totalAfter/totalBefore)*100).toFixed(0)}%)`);
console.log(`${jpgs.length} Bilder konvertiert.`);

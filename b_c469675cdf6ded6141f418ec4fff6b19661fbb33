import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const catDir = path.resolve('public/images/categories');
const files = fs.readdirSync(catDir);

console.log('=== INSPECTING PUBLIC/IMAGES/CATEGORIES ===');
console.log('Total files in public/images/categories:', files.length);

async function inspectAll() {
  for (const f of files) {
    const full = path.join(catDir, f);
    const stat = fs.statSync(full);
    const meta = await sharp(full).metadata();
    console.log(`- ${f}: ${meta.width}x${meta.height}, format: ${meta.format}, size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  }
}

inspectAll();
